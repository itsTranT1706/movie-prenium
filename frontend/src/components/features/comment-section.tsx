'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth, useRequireAuth } from '@/hooks';

interface Comment {
    id: string;
    user: string;
    avatar: string;
    text: string;
    time: string;
}

interface CommentSectionProps {
    movieId: string;
    comments?: Comment[];
    onSubmitComment?: (text: string) => void;
}

/**
 * Reusable Comment Section Component
 * Handles authentication, comment input, and comment list display
 * Used in both movie detail and watch pages
 */
export function CommentSection({ 
    movieId, 
    comments = [],
    onSubmitComment 
}: CommentSectionProps) {
    const { user } = useAuth();
    const requireAuth = useRequireAuth();
    const [commentText, setCommentText] = useState('');

    const handleSubmitComment = () => {
        requireAuth(
            () => {
                if (commentText.trim()) {
                    // Call parent callback if provided
                    if (onSubmitComment) {
                        onSubmitComment(commentText);
                    } else {
                        // Default behavior
                        console.log('Submitting comment:', commentText);
                        toast.success('Bình luận đã được đăng!');
                    }
                    setCommentText('');
                }
            },
            'Vui lòng đăng nhập để bình luận'
        );
    };

    const handleTextareaClick = () => {
        if (!user) {
            requireAuth(
                () => {},
                'Vui lòng đăng nhập để bình luận'
            );
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-white mb-6">Bình luận</h2>
            
            {/* Comment Input */}
            <div className="mb-6">
                <textarea
                    placeholder="Thêm bình luận..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onClick={handleTextareaClick}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-white/20 resize-none"
                    rows={3}
                />
                {user && (
                    <div className="flex justify-end mt-2">
                        <button 
                            onClick={handleSubmitComment}
                            disabled={!commentText.trim()}
                            className="px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Đăng
                        </button>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-0">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </p>
                ) : (
                    comments.map((comment, index) => (
                        <div key={comment.id}>
                            <div className="py-3">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-semibold">
                                        {comment.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-white text-sm font-semibold">
                                                {comment.user}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {comment.time}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
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
