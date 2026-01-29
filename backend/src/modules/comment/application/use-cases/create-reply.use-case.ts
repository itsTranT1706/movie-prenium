import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import {
  ICommentRepository,
  COMMENT_REPOSITORY,
} from '../../domain/ports/comment.repository.port';
import {
  ISpamDetector,
  SPAM_DETECTOR,
} from '../../domain/ports/spam-detector.port';
import { Comment } from '../../domain/entities';

export interface CreateReplyInput {
  userId: string;
  parentId: string;
  content: string;
  isSpoiler?: boolean;
}

@Injectable()
export class CreateReplyUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
    @Inject(SPAM_DETECTOR)
    private readonly spamDetector: ISpamDetector,
  ) {}

  async execute(input: CreateReplyInput): Promise<Comment> {
    // Validate content
    const trimmedContent = input.content.trim();
    if (!trimmedContent) {
      throw new BadRequestException('Content cannot be empty');
    }

    if (trimmedContent.length > 1000) {
      throw new BadRequestException('Content cannot exceed 1000 characters');
    }

    // Validate parent exists
    const parentComment = await this.commentRepository.findById(
      input.parentId,
    );
    if (!parentComment) {
      throw new NotFoundException('Parent comment not found');
    }

    // Validate parent is not a reply (two-level constraint)
    if (parentComment.parentId !== null) {
      throw new BadRequestException(
        'Cannot reply to a reply. Only two levels of comments are allowed.',
      );
    }

    // Check rate limit
    const rateLimitCheck = await this.spamDetector.checkRateLimit(
      input.userId,
    );
    if (!rateLimitCheck.allowed) {
      throw new ConflictException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: `Rate limit exceeded. Please wait ${rateLimitCheck.waitTime} seconds before commenting again.`,
        error: 'Too Many Requests',
      });
    }

    // Check duplicate
    const isDuplicate = await this.spamDetector.checkDuplicate(
      input.userId,
      trimmedContent,
    );
    if (isDuplicate) {
      throw new ConflictException(
        'Duplicate comment detected. Please wait before posting the same content again.',
      );
    }

    // Create reply
    const reply = await this.commentRepository.create({
      userId: input.userId,
      movieId: parentComment.movieId,
      content: trimmedContent,
      isSpoiler: input.isSpoiler ?? false,
      parentId: input.parentId,
    });

    return reply;
  }
}
