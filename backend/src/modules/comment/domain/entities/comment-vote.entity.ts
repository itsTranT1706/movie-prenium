export type VoteType = 'UPVOTE' | 'DOWNVOTE';

export interface CommentVote {
  id: string;
  userId: string;
  commentId: string;
  voteType: VoteType;
  createdAt: Date;

  // Relations
  user?: {
    id: string;
    name: string | null;
  };
  comment?: {
    id: string;
    content: string;
  };
}

export interface CreateVoteData {
  userId: string;
  commentId: string;
  voteType: VoteType;
}
