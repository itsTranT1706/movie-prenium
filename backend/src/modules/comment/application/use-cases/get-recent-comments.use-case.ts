import { Injectable, Inject } from '@nestjs/common';
import {
  ICommentRepository,
  COMMENT_REPOSITORY,
} from '../../domain/ports/comment.repository.port';
import { Comment } from '../../domain/entities';

@Injectable()
export class GetRecentCommentsUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(limit: number = 10): Promise<Comment[]> {
    return this.commentRepository.findRecent(limit);
  }
}
