import { Injectable, Inject } from '@nestjs/common';
import {
  ICommentRepository,
  COMMENT_REPOSITORY,
} from '../../domain/ports/comment.repository.port';

@Injectable()
export class GetCommentCountUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(movieId: string): Promise<number> {
    // Count all comments (parents + replies) for the movie
    const count = await this.commentRepository.countByMovieId(movieId);
    return count;
  }
}
