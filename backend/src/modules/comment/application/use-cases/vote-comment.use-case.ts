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
import { Comment, VoteType } from '../../domain/entities';

export interface VoteCommentInput {
  commentId: string;
  userId: string;
  voteType: VoteType;
}

@Injectable()
export class VoteCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(input: VoteCommentInput): Promise<Comment> {
    // Find comment
    const comment = await this.commentRepository.findById(input.commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Prevent self-voting
    if (comment.userId === input.userId) {
      throw new ForbiddenException('You cannot vote on your own comment');
    }

    // Check if user already voted
    const existingVote = await this.commentRepository.findVote(
      input.userId,
      input.commentId,
    );

    if (existingVote) {
      if (existingVote.voteType === input.voteType) {
        // Same vote type: remove vote (toggle)
        await this.commentRepository.deleteVote(existingVote.id);
      } else {
        // Different vote type: delete old vote and create new one
        await this.commentRepository.deleteVote(existingVote.id);
        await this.commentRepository.createVote({
          userId: input.userId,
          commentId: input.commentId,
          voteType: input.voteType,
        });
      }
    } else {
      // No existing vote: create new vote
      await this.commentRepository.createVote({
        userId: input.userId,
        commentId: input.commentId,
        voteType: input.voteType,
      });
    }

    // Update vote counts
    await this.commentRepository.updateVoteCounts(input.commentId);

    // Return updated comment
    const updatedComment = await this.commentRepository.findById(
      input.commentId,
    );
    return updatedComment!;
  }
}
