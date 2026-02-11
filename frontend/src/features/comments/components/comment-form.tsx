'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth, useRequireAuth } from '@/features/auth';

interface CommentFormProps {
    onSubmit: (content: string, isSpoiler: boolean) => Promise<void>;
    submitting: boolean;
    placeholder?: string;
    buttonText?: string;
    onCancel?: () => void;
}

export function CommentForm({
    onSubmit,
    submitting,
    placeholder = 'Thêm bình luận...',
    buttonText = 'Đăng',
    onCancel,
}: CommentFormProps) {
    const { user } = useAuth();
    const requireAuth = useRequireAuth();
    const [content, setContent] = useState('');
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const MAX_LENGTH = 1000;

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (text.length <= MAX_LENGTH) {
            setContent(text);
            setCharCount(text.length);
        }
    };

    const handleSubmit = async () => {
        requireAuth(
            async () => {
                const trimmedContent = content.trim();
                if (trimmedContent) {
                    await onSubmit(trimmedContent, isSpoiler);
                    setContent('');
                    setIsSpoiler(false);
                    setCharCount(0);
                }
            },
            'Vui lòng đăng nhập để bình luận'
        );
    };

    const handleTextareaClick = () => {
        if (!user) {
            requireAuth(
                () => { },
                'Vui lòng đăng nhập để bình luận'
            );
        }
    };

    const handleCancel = () => {
        setContent('');
        setIsSpoiler(false);
        setCharCount(0);
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div>
            <textarea
                placeholder={placeholder}
                value={content}
                onChange={handleContentChange}
                onClick={handleTextareaClick}
                disabled={submitting}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-white/20 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
            />

            {user && (
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={isSpoiler}
                                onClick={() => setIsSpoiler(!isSpoiler)}
                                disabled={submitting}
                                className={`
                                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                                    transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/20
                                    ${isSpoiler ? 'bg-red-600' : 'bg-zinc-700'}
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`
                                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                                        transition duration-200 ease-in-out
                                        ${isSpoiler ? 'translate-x-5' : 'translate-x-0'}
                                    `}
                                />
                            </button>
                            <span
                                className="text-xs text-gray-400 cursor-pointer select-none hover:text-gray-300 transition-colors"
                                onClick={() => !submitting && setIsSpoiler(!isSpoiler)}
                            >
                                Đánh dấu spoiler
                            </span>
                        </div>

                        <span className={`text-xs ${charCount > MAX_LENGTH * 0.9 ? 'text-yellow-500' : 'text-gray-500'}`}>
                            {charCount}/{MAX_LENGTH}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {onCancel && (
                            <button
                                onClick={handleCancel}
                                disabled={submitting}
                                className="px-4 py-2 text-zinc-400 text-sm font-medium hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() || submitting}
                            className="flex items-center gap-2 px-6 py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
                        >
                            <Send className="w-3.5 h-3.5" />
                            {submitting ? 'Đang gửi...' : buttonText}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
