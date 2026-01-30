export interface Comment {
  id: string;
  userId: string;
  movieId: string;
  parentId: string | null;
  content: string;
  isSpoiler: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  user?: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
  movie?: {
    id: string;
    title: string;
    posterUrl?: string | null;
  };
  parent?: Comment;
  replies?: Comment[];
  votes?: Array<{
    id: string;
    userId: string;
    voteType: 'UPVOTE' | 'DOWNVOTE';
  }>;
}

export interface CreateCommentData {
  userId: string;
  movieId: string;
  parentId?: string | null;
  content: string;
  isSpoiler?: boolean;
}

export interface UpdateCommentData {
  content?: string;
  isSpoiler?: boolean;
}
