'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
    content: string;
    className?: string;
    maxLines?: number;
}

export function ExpandableText({ content, className = '', maxLines = 3 }: ExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkOverflow = () => {
            const element = textRef.current;
            if (element) {
                // If expanded, strictly valid check is hard (scrollHeight == clientHeight).
                // But initially (not expanded), scrollHeight > clientHeight means overflow.
                // If we want to be robust, we can just check if char count is high enough as a heuristic fallback
                // but checking scrollHeight vs clientHeight is standard for line-clamp.
                setIsOverflowing(element.scrollHeight > element.clientHeight);
            }
        };

        // Check on mount and resize
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [content]);

    return (
        <div className={`relative ${className}`}>
            <div
                ref={textRef}
                className={`text-gray-300 text-sm leading-relaxed transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : ''
                    }`}
                style={!isExpanded ? { WebkitLineClamp: maxLines } : {}}
                dangerouslySetInnerHTML={{ __html: content }}
            />
            {(isOverflowing || isExpanded) && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-1 text-xs font-semibold text-white/70 hover:text-white flex items-center gap-1 transition-colors select-none"
                >
                    {isExpanded ? (
                        <>
                            Thu gọn <ChevronUp className="w-3 h-3" />
                        </>
                    ) : (
                        <>
                            Xem thêm <ChevronDown className="w-3 h-3" />
                        </>
                    )}
                </button>
            )}
            {/* Fallback for when expanded -> we still show toggle if it WAS overflowing */}
            {/* Actually, once expanded, scrollHeight === clientHeight.
                So we need to persist "isOverflowing" state once detected as true?
                Or reliance on isExpanded state.
                If isExpanded is true, we should SHOW the button "Thu gọn".
                So the condition is: isOverflowing (detected initially) OR isExpanded (if we allowed expanding)
            */}
        </div>
    );
}
