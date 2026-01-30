'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks';
import { apiClient } from '@/lib/api/client';
import type { Comment } from '@/lib/api/services';
import { CommentForm } from './comment-form';
import { ReplyList } from './reply-list';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentItemProps {
    comment: Comment;
    onUpdate: () => void;
    isReply?: boolean;
}

export function CommentItem({ comment, onUpdate, isReply = false }: CommentItemProps) {
    const { user } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showSpoiler, setShowSpoiler] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Optimistic UI state
    const [optimisticUpvotes, setOptimisticUpvotes] = useState(comment.upvotes);
    const [optimisticDownvotes, setOptimisticDownvotes] = useState(comment.downvotes);

    const isOwner = user?.id === comment.userId;
    const hasReplies = comment.replies && comment.replies.length > 0;

    // Sync optimistic state with actual data
    useEffect(() => {
        setOptimisticUpvotes(comment.upvotes);
        setOptimisticDownvotes(comment.downvotes);
    }, [comment.upvotes, comment.downvotes]);

    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: true,
                locale: vi,
            });
        } catch {
            return 'vừa xong';
        }
    };

    const handleVote = async (voteType: 'upvote' | 'downvote') => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để vote');
            return;
        }

        if (isOwner) {
            toast.error('Bạn không thể vote bình luận của chính mình');
            return;
        }

        // Optimistic update
        const prevUpvotes = optimisticUpvotes;
        const prevDownvotes = optimisticDownvotes;

        if (voteType === 'upvote') {
            setOptimisticUpvotes(prev => prev + 1);
        } else {
            setOptimisticDownvotes(prev => prev + 1);
        }

        try {
            await apiClient.voteComment(comment.id, voteType);
            onUpdate();
        } catch (error: any) {
            // Rollback on error
            setOptimisticUpvotes(prevUpvotes);
            setOptimisticDownvotes(prevDownvotes);
            toast.error(error.message || 'Không thể vote');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc muốn xóa bình luận này?')) {
            return;
        }

        try {
            await apiClient.deleteComment(comment.id);
            toast.success('Đã xóa bình luận');
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'Không thể xóa bình luận');
        }
    };

    const handleEdit = async (content: string, isSpoiler: boolean) => {
        try {
            setSubmitting(true);
            await apiClient.updateComment(comment.id, { content, isSpoiler });
            toast.success('Đã cập nhật bình luận');
            setIsEditing(false);
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'Không thể cập nhật bình luận');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (content: string, isSpoiler: boolean) => {
        try {
            setSubmitting(true);
            await apiClient.createReply(comment.id, { content, isSpoiler });
            toast.success('Đã trả lời bình luận');
            setShowReplyForm(false);
            onUpdate();
        } catch (error: any) {
            toast.error(error.message || 'Không thể trả lời');
        } finally {
            setSubmitting(false);
        }
    };

    const netScore = optimisticUpvotes - optimisticDownvotes;

    return (
        <div className={`py-3 ${isReply ? 'ml-8' : ''}`}>
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {comment.user?.avatar ? (
                        <img
                            src={comment.user.avatar}
                            alt={comment.user.name || 'User'}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-semibold">
                            {comment.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-semibold">
                            {comment.user?.name || 'Người dùng'}
                        </span>
                        <span className="text-gray-500 text-xs">
                            {formatTime(comment.createdAt)}
                        </span>
                        {comment.isSpoiler && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded">
                                SPOILER
                            </span>
                        )}
                    </div>

                    {/* Comment Content */}
                    {isEditing ? (
                        <div className="mt-2">
                            <CommentForm
                                onSubmit={handleEdit}
                                submitting={submitting}
                                placeholder="Chỉnh sửa bình luận..."
                                buttonText="Lưu"
                                onCancel={() => setIsEditing(false)}
                            />
                        </div>
                    ) : (
                        <>
                            {comment.isSpoiler && !showSpoiler ? (
                                <div className="mt-1">
                                    <button
                                        onClick={() => setShowSpoiler(true)}
                                        className="text-sm text-gray-400 hover:text-white transition-colors underline"
                                    >
                                        Nhấn để xem spoiler
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            )}
                        </>
                    )}

                    {/* Actions */}
                    {!isEditing && (
                        <div className="flex items-center gap-4 mt-2">

                            {/* Vote buttons & Actions - Reference Style */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 pl-2 pr-1">
                                    <button
                                        onClick={() => handleVote('upvote')}
                                        disabled={isOwner}
                                        className="text-zinc-400 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/up"
                                        title="Upvote"
                                    >
                                        <ArrowBigUp className={cn("w-6 h-6 stroke-[1.5]", netScore > 0 && "fill-orange-500/20 text-orange-500")} />
                                    </button>
                                    <span className={cn(
                                        "text-sm font-bold tabular-nums min-w-[1.5rem] text-center mx-1",
                                        netScore > 0 ? 'text-orange-500' : netScore < 0 ? 'text-blue-500' : 'text-zinc-400'
                                    )}>
                                        {netScore}
                                    </span>
                                    <button
                                        onClick={() => handleVote('downvote')}
                                        disabled={isOwner}
                                        className="text-zinc-400 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/down"
                                        title="Downvote"
                                    >
                                        <ArrowBigDown className={cn("w-6 h-6 stroke-[1.5]", netScore < 0 && "fill-blue-500/20 text-blue-500")} />
                                    </button>
                                </div>

                                {/* Reply button */}
                                {!isReply && user && (
                                    <button
                                        onClick={() => setShowReplyForm(!showReplyForm)}
                                        className="p-1.5 text-zinc-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                                        title="Trả lời"
                                    >
                                        <MessageSquare className="w-5 h-5 stroke-[1.5]" />
                                    </button>
                                )}

                                {/* Edit/Delete buttons (owner only) */}
                                {isOwner && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-1.5 text-zinc-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                                            title="Sửa"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-full"
                                            title="Xóa"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Toggle replies */}
                                {!isReply && hasReplies && (
                                    <button
                                        onClick={() => setShowReplies(!showReplies)}
                                        className="ml-auto text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showReplies ? 'Ẩn' : `Xem ${comment.replies!.length} phản hồi`}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reply Form */}
                    {showReplyForm && !isReply && (
                        <div className="mt-3">
                            <CommentForm
                                onSubmit={handleReply}
                                submitting={submitting}
                                placeholder="Viết phản hồi..."
                                buttonText="Trả lời"
                                onCancel={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}

                    {/* Replies List */}
                    {!isReply && hasReplies && showReplies && (
                        <div className="mt-3">
                            <ReplyList replies={comment.replies!} onUpdate={onUpdate} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
