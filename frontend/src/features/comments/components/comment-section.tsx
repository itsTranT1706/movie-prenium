'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth, useRequireAuth } from '@/features/auth';
import { apiClient } from '@/shared/lib/api';
import type { Comment } from '@/features/comments';
import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';

interface CommentSectionProps {
    movieId: string;
}

/**
 * Reusable Comment Section Component
 * Handles authentication, comment input, and comment list display
 * Used in both movie detail and watch pages
 */
export function CommentSection({ movieId }: CommentSectionProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentCount, setCommentCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Fetch comments on mount
    useEffect(() => {
        // console.log('🎬 CommentSection mounted with movieId:', movieId);
        fetchComments();
        fetchCommentCount();
    }, [movieId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            // console.log('📡 Fetching comments for movieId:', movieId);
            const comments = await apiClient.getMovieComments(movieId);
            // console.log('✅ Comments response:', comments);
            setComments(comments);
        } catch (error) {
            console.error('❌ Error fetching comments:', error);
            toast.error('Không thể tải bình luận');
        } finally {
            setLoading(false);
        }
    };

    const fetchCommentCount = async () => {
        try {
            const count = await apiClient.getCommentCount(movieId);
            setCommentCount(count);
        } catch (error) {
            console.error('Error fetching comment count:', error);
        }
    };

    const handleSubmitComment = async (content: string, isSpoiler: boolean) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để bình luận');
            return;
        }

        // Create optimistic comment
        const optimisticComment: Comment = {
            id: `temp-${Date.now()}`,
            movieId,
            content,
            isSpoiler,
            userId: user.id,
            parentId: null,
            user: {
                id: user.id,
                name: user.name || 'Bạn',
                avatar: user.avatar || null,
            },
            upvotes: 0,
            downvotes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            replies: [],
        };

        // Optimistic update - add to top of list immediately
        setComments(prev => [optimisticComment, ...prev]);
        setCommentCount(prev => prev + 1);

        try {
            setSubmitting(true);
            const newComment = await apiClient.createComment({
                movieId,
                content,
                isSpoiler,
            });

            // Replace optimistic comment with real one
            setComments(prev => prev.map(c =>
                c.id === optimisticComment.id ? newComment : c
            ));
            toast.success('Bình luận đã được đăng!');
        } catch (error: any) {
            // Rollback on error
            setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
            setCommentCount(prev => prev - 1);
            console.error('Error submitting comment:', error);
            toast.error(error.message || 'Không thể đăng bình luận');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCommentUpdate = async () => {
        await fetchComments();
        await fetchCommentCount();
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-2">
                Bình luận {commentCount > 0 && `(${commentCount})`}
            </h2>

            {/* Comment Input */}
            <div className="mb-6">
                <CommentForm
                    onSubmit={handleSubmitComment}
                    submitting={submitting}
                    placeholder="Thêm bình luận..."
                />
            </div>

            {/* Comments List */}
            <div className="space-y-0">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={comment.id}>
                            <CommentItem
                                comment={comment}
                                onUpdate={handleCommentUpdate}
                            />
                            {index < comments.length - 1 && (
                                <div className="border-t border-white/5" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;
