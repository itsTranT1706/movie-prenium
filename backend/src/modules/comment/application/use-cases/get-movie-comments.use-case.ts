import { Injectable, Inject } from '@nestjs/common';
import {
  ICommentRepository,
  COMMENT_REPOSITORY,
} from '../../domain/ports/comment.repository.port';
import { Comment } from '../../domain/entities';

@Injectable()
export class GetMovieCommentsUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(movieId: string): Promise<Comment[]> {
    // Repository will handle:
    // - Fetching all parent comments (parentId = null)
    // - Including nested replies for each parent
    // - Including user info (username, avatar)
    // - Ordering parents by createdAt DESC
    // - Ordering replies by createdAt ASC
    const comments = await this.commentRepository.findByMovieId(movieId);

    return comments;
  }
}
