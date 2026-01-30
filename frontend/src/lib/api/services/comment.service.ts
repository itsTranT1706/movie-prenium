export interface RecentComment {
  id: string;
  userId: string;
  movieId: string;
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
  movie?: {
    id: string;
    title: string;
  };
  parent?: {
    id: string;
    user: {
      id: string;
      name: string;
    }
  };
}

export interface CreateCommentDto {
  movieId: string;
  content: string;
  isSpoiler?: boolean;
}

export interface CreateReplyDto {
  content: string;
  isSpoiler?: boolean;
}

export interface UpdateCommentDto {
  content: string;
  isSpoiler?: boolean;
}

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

class CommentService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async getRecentComments(limit: number = 10): Promise<RecentComment[]> {
    const response = await fetch(
      `${this.baseURL}/comments/recent?limit=${limit}`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    return data?.data || [];
  }

  async createComment(dto: CreateCommentDto): Promise<Comment> {
    const response = await fetch(`${this.baseURL}/comments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(dto),
    });
    const data = await response.json();
    return data.data;
  }

  async createReply(commentId: string, dto: CreateReplyDto): Promise<Comment> {
    const response = await fetch(`${this.baseURL}/comments/${commentId}/replies`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(dto),
    });
    const data = await response.json();
    return data.data;
  }

  async getMovieComments(movieId: string): Promise<Comment[]> {
    const response = await fetch(
      `${this.baseURL}/comments/movie/${movieId}`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    return data?.data || [];
  }

  async getCommentCount(movieId: string): Promise<number> {
    const response = await fetch(
      `${this.baseURL}/comments/movie/${movieId}/count`,
      {
        headers: this.getHeaders(),
      }
    );
    const data = await response.json();
    return data?.data?.count || 0;
  }

  async updateComment(commentId: string, dto: UpdateCommentDto): Promise<Comment> {
    const response = await fetch(`${this.baseURL}/comments/${commentId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(dto),
    });
    const data = await response.json();
    return data.data;
  }

  async deleteComment(commentId: string): Promise<void> {
    await fetch(`${this.baseURL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  async voteComment(commentId: string, voteType: 'upvote' | 'downvote'): Promise<Comment> {
    const response = await fetch(`${this.baseURL}/comments/${commentId}/vote`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ voteType }),
    });
    const data = await response.json();
    return data.data;
  }
}

export default CommentService;
