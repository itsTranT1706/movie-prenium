import BaseApiClient from '../base-client';

export interface Comment {
  id: string;
  userId: string;
  movieId: string;
  parentId: string | null;
  content: string;
  isSpoiler: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  replies?: Comment[];
}

export interface CreateCommentInput {
  movieId: string;
  content: string;
  isSpoiler?: boolean;
}

export interface CreateReplyInput {
  content: string;
  isSpoiler?: boolean;
}

export interface UpdateCommentInput {
  content?: string;
  isSpoiler?: boolean;
}

export type VoteType = 'UPVOTE' | 'DOWNVOTE';

class CommentService extends BaseApiClient {
  async createComment(input: CreateCommentInput) {
    const response = await this.request<{
      success: boolean;
      data: Comment;
      message: string;
    }>('/comments', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    if (!response.success && response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async createReply(parentId: string, input: CreateReplyInput) {
    const response = await this.request<{
      success: boolean;
      data: Comment;
      message: string;
    }>(`/comments/${parentId}/replies`, {
      method: 'POST',
      body: JSON.stringify(input),
    });

    if (!response.success && response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async getMovieComments(movieId: string) {
    const response = await this.request<{
      success: boolean;
      data: Comment[];
    }>(`/comments/movie/${movieId}`);

    if (!response.success && response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async getCommentCount(movieId: string) {
    const response = await this.request<{
      success: boolean;
      data: { count: number };
    }>(`/comments/movie/${movieId}/count`);

    if (!response.success && response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async updateComment(commentId: string, input: UpdateCommentInput) {
    const response = await this.request<{
      success: boolean;
      data: Comment;
      message: string;
    }>(`/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });

    if (!response.success && response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async deleteComment(commentId: string) {
    const response = await this.request<{
      success: boolean;
      message: string;
    }>(`/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.success && response.error) {
      throw new Error(response.error);
    }

    return response;
  }

  async voteComment(commentId: string, voteType: VoteType) {
    const response = await this.request<{
      success: boolean;
      data: Comment;
      message: string;
    }>(`/comments/${commentId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });

    if (!response.success && response.error) {
      throw new Error(response.error);
    }

    return response;
  }
}

export default CommentService;
