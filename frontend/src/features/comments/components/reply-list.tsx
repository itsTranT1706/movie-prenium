'use client';

import type { Comment } from '@/features/comments';
import { CommentItem } from './comment-item';

interface ReplyListProps {
    replies: Comment[];
    onUpdate: () => void;
}

export function ReplyList({ replies, onUpdate }: ReplyListProps) {
    if (!replies || replies.length === 0) {
        return null;
    }

    return (
        <div className="space-y-0 border-l-2 border-white/10 pl-0">
            {replies.map((reply, index) => (
                <div key={reply.id}>
                    <CommentItem comment={reply} onUpdate={onUpdate} isReply={true} />
                    {index < replies.length - 1 && (
                        <div className="border-t border-white/5 ml-8" />
                    )}
                </div>
            ))}
        </div>
    );
}
