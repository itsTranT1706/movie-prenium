import {
  Injectable,
  Inject,
  BadRequestException,
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

export interface CreateCommentInput {
  userId: string;
  movieId: string;
  content: string;
  isSpoiler?: boolean;
}

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
    @Inject(SPAM_DETECTOR)
    private readonly spamDetector: ISpamDetector,
  ) {}

  async execute(input: CreateCommentInput): Promise<Comment> {
    // Validate content
    const trimmedContent = input.content.trim();
    if (!trimmedContent) {
      throw new BadRequestException('Content cannot be empty');
    }

    if (trimmedContent.length > 1000) {
      throw new BadRequestException('Content cannot exceed 1000 characters');
    }

    // Note: Movie existence is validated by database foreign key constraint
    // If movie doesn't exist, Prisma will throw a foreign key error

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

    // Create parent comment
    const comment = await this.commentRepository.create({
      userId: input.userId,
      movieId: input.movieId,
      content: trimmedContent,
      isSpoiler: input.isSpoiler ?? false,
      parentId: null,
    });

    return comment;
  }
}
