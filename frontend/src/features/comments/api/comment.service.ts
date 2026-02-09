import BaseApiClient from '@/shared/lib/api/base-client';

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

class CommentService extends BaseApiClient {
    async getRecentComments(limit: number = 10): Promise<RecentComment[]> {
        const response = await this.get<RecentComment[]>(`/comments/recent?limit=${limit}`);
        return response?.data || [];
    }

    async createComment(dto: CreateCommentDto): Promise<Comment> {
        const response = await this.request<Comment>(`/comments`, {
            method: 'POST',
            body: JSON.stringify(dto),
        });
        return response.data!;
    }

    async createReply(commentId: string, dto: CreateReplyDto): Promise<Comment> {
        const response = await this.request<Comment>(`/comments/${commentId}/replies`, {
            method: 'POST',
            body: JSON.stringify(dto),
        });
        return response.data!;
    }

    async getMovieComments(movieId: string): Promise<Comment[]> {
        const response = await this.get<Comment[]>(`/comments/movie/${movieId}`);
        return response?.data || [];
    }

    async getCommentCount(movieId: string): Promise<number> {
        const response = await this.get<{ count: number }>(`/comments/movie/${movieId}/count`);
        return response?.data?.count || 0;
    }

    async updateComment(commentId: string, dto: UpdateCommentDto): Promise<Comment> {
        const response = await this.request<Comment>(`/comments/${commentId}`, {
            method: 'PATCH',
            body: JSON.stringify(dto),
        });
        return response.data!;
    }

    async deleteComment(commentId: string): Promise<void> {
        await this.request(`/comments/${commentId}`, {
            method: 'DELETE',
        });
    }

    async voteComment(commentId: string, voteType: 'upvote' | 'downvote'): Promise<Comment> {
        const response = await this.request<Comment>(`/comments/${commentId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ voteType }),
        });
        return response.data!;
    }
}

export const commentService = new CommentService();
export default CommentService;
