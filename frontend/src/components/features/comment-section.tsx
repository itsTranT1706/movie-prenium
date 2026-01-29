'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth, useRequireAuth } from '@/hooks';
import { apiClient } from '@/lib/api/client';
import type { Comment } from '@/lib/api/services/comment.service';
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
        console.log('🎬 CommentSection mounted with movieId:', movieId);
        fetchComments();
        fetchCommentCount();
    }, [movieId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            console.log('📡 Fetching comments for movieId:', movieId);
            const response = await apiClient.getMovieComments(movieId);
            console.log('✅ Comments response:', response);
            if (response.success) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('❌ Error fetching comments:', error);
            toast.error('Không thể tải bình luận');
        } finally {
            setLoading(false);
        }
    };

    const fetchCommentCount = async () => {
        try {
            const response = await apiClient.getCommentCount(movieId);
            if (response.success) {
                setCommentCount(response.data.count);
            }
        } catch (error) {
            console.error('Error fetching comment count:', error);
        }
    };

    const handleSubmitComment = async (content: string, isSpoiler: boolean) => {
        try {
            setSubmitting(true);
            const response = await apiClient.createComment({
                movieId,
                content,
                isSpoiler,
            });

            if (response.success) {
                toast.success('Bình luận đã được đăng!');
                await fetchComments();
                await fetchCommentCount();
            }
        } catch (error: any) {
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
