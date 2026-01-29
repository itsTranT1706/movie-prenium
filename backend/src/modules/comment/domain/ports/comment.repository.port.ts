import { Comment, CreateCommentData, UpdateCommentData } from '../entities/comment.entity';
import { CommentVote, CreateVoteData } from '../entities/comment-vote.entity';

export interface ICommentRepository {
  // Comment CRUD operations
  create(data: CreateCommentData): Promise<Comment>;
  findById(id: string): Promise<Comment | null>;
  findByMovieId(movieId: string): Promise<Comment[]>;
  update(id: string, data: UpdateCommentData): Promise<Comment>;
  delete(id: string): Promise<void>;
  countByMovieId(movieId: string): Promise<number>;

  // Vote operations
  createVote(data: CreateVoteData): Promise<CommentVote>;
  findVote(userId: string, commentId: string): Promise<CommentVote | null>;
  deleteVote(id: string): Promise<void>;
  updateVoteCounts(commentId: string): Promise<void>;

  // Spam detection queries
  countUserCommentsInTimeWindow(userId: string, minutes: number): Promise<number>;
  findDuplicateComment(
    userId: string,
    content: string,
    minutes: number,
  ): Promise<Comment | null>;
}

export const COMMENT_REPOSITORY = Symbol('COMMENT_REPOSITORY');
