import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ICommentRepository,
  COMMENT_REPOSITORY,
} from '../../domain/ports/comment.repository.port';

export interface DeleteCommentInput {
  commentId: string;
  userId: string;
}

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(input: DeleteCommentInput): Promise<void> {
    // Find comment
    const comment = await this.commentRepository.findById(input.commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Verify ownership
    if (comment.userId !== input.userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }

    // Delete comment
    // If parent: Prisma cascade will delete all replies
    // If reply: only the reply is deleted
    await this.commentRepository.delete(input.commentId);
  }
}
