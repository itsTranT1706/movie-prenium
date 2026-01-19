'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';

/**
 * Animated Loader Component
 * Three bars that animate with a wave effect
 */
export function Loader({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center py-12 ${className}`}>
            <div className="loader" />
            <style jsx>{`
                .loader {
                    width: 45px;
                    aspect-ratio: 1;
                    --c: no-repeat linear-gradient(#6366f1 0 0);
                    background: 
                        var(--c) 0% 50%,
                        var(--c) 50% 50%,
                        var(--c) 100% 50%;
                    background-size: 20% 100%;
                    animation: loader-wave 1s infinite linear;
                }
                @keyframes loader-wave {
                    0%   { background-size: 20% 100%, 20% 100%, 20% 100% }
                    33%  { background-size: 20% 10%, 20% 100%, 20% 100% }
                    50%  { background-size: 20% 100%, 20% 10%, 20% 100% }
                    66%  { background-size: 20% 100%, 20% 100%, 20% 10% }
                    100% { background-size: 20% 100%, 20% 100%, 20% 100% }
                }
            `}</style>
        </div>
    );
}

interface LazySectionProps {
    children: ReactNode;
    /** Minimum height for placeholder to prevent layout shift */
    minHeight?: string;
    /** Root margin for intersection observer - load before visible */
    rootMargin?: string;
    /** Custom loader component */
    loader?: ReactNode;
    /** Delay before showing content (for smoother UX) */
    delay?: number;
    /** Unique key for the section */
    sectionKey?: string;
}

/**
 * LazySection Component
 * Wraps content to load only when scrolled into viewport
 * Uses Intersection Observer API for efficient detection
 */
export function LazySection({
    children,
    minHeight = '200px',
    rootMargin = '100px',
    loader,
    delay = 0,
    sectionKey,
}: LazySectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);

                    // Optional delay before showing content
                    if (delay > 0) {
                        setTimeout(() => setIsLoaded(true), delay);
                    } else {
                        setIsLoaded(true);
                    }

                    // Stop observing once loaded
                    if (sectionRef.current) {
                        observer.unobserve(sectionRef.current);
                    }
                }
            },
            {
                rootMargin,
                threshold: 0.1,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible, rootMargin, delay]);

    return (
        <div
            ref={sectionRef}
            style={{ minHeight: isLoaded ? 'auto' : minHeight }}
            data-section={sectionKey}
        >
            {isLoaded ? (
                <div className="animate-fade-in">
                    {children}
                </div>
            ) : (
                loader || <Loader />
            )}
        </div>
    );
}

export default LazySection;
