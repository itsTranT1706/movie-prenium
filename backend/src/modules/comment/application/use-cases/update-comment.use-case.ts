import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  ICommentRepository,
  COMMENT_REPOSITORY,
} from '../../domain/ports/comment.repository.port';
import { Comment } from '../../domain/entities';

export interface UpdateCommentInput {
  commentId: string;
  userId: string;
  content?: string;
  isSpoiler?: boolean;
}

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(input: UpdateCommentInput): Promise<Comment> {
    // Find comment
    const comment = await this.commentRepository.findById(input.commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Verify ownership
    if (comment.userId !== input.userId) {
      throw new ForbiddenException(
        'You do not have permission to update this comment',
      );
    }

    // Validate content if provided
    if (input.content !== undefined) {
      const trimmedContent = input.content.trim();
      if (!trimmedContent) {
        throw new BadRequestException('Content cannot be empty');
      }

      if (trimmedContent.length > 1000) {
        throw new BadRequestException('Content cannot exceed 1000 characters');
      }

      input.content = trimmedContent;
    }

    // Update comment
    const updatedComment = await this.commentRepository.update(
      input.commentId,
      {
        content: input.content,
        isSpoiler: input.isSpoiler,
      },
    );

    return updatedComment;
  }
}
