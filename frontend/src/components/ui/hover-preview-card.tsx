'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Play, Heart, Info, Volume2, VolumeX } from 'lucide-react';

export interface MoviePreviewData {
    id: string;
    title: string;
    subtitle?: string;
    posterUrl?: string;
    backdropUrl?: string;
    trailerUrl?: string;
    ageRating?: string;
    year?: number;
    season?: number;
    episode?: number;
    duration?: string;
    genres?: string[];
    quality?: string;
}

interface HoverPreviewCardProps {
    movie: MoviePreviewData;
    children: ReactNode;
    /** Position of the preview relative to trigger */
    position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    /** Delay before showing preview (ms) */
    delay?: number;
    /** Disable the preview */
    disabled?: boolean;
}

/**
 * Extract YouTube video ID from URL
 */
function getYouTubeVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * HoverPreviewCard Component
 * Netflix-style hover preview popup for movie cards
 * Uses React Portal to render outside DOM tree for proper z-index
 */
export function HoverPreviewCard({
    movie,
    children,
    delay = 500,
    disabled = false,
}: HoverPreviewCardProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [actualPosition, setActualPosition] = useState<'left' | 'right' | 'center'>('center');
    const [isMounted, setIsMounted] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Check if component is mounted (for portal)
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Calculate position based on viewport
    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const previewWidth = 400;

            if (rect.left < previewWidth / 2) {
                setActualPosition('left');
            } else if (rect.right > viewportWidth - previewWidth / 2) {
                setActualPosition('right');
            } else {
                setActualPosition('center');
            }
        }
    }, [isVisible]);

    const handleMouseEnter = () => {
        if (disabled) return;
        console.log('🎬 Hover preview triggered for:', movie.title);
        timeoutRef.current = setTimeout(() => {
            console.log('✅ Showing preview for:', movie.title);
            setIsVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        console.log('❌ Hiding preview for:', movie.title);
        setIsVisible(false);
    };

    // Get media source
    const hasTrailer = movie.trailerUrl;
    const youtubeVideoId = hasTrailer ? getYouTubeVideoId(movie.trailerUrl!) : null;
    const mediaSrc = movie.backdropUrl || movie.posterUrl || '';

    // Preview content to be rendered via portal
    const previewContent = (
        <div
            ref={previewRef}
            className="fixed pointer-events-auto"
            style={{ 
                width: '400px',
                zIndex: 2147483647, // Max z-index value
                top: triggerRef.current ? `${triggerRef.current.getBoundingClientRect().top + triggerRef.current.getBoundingClientRect().height / 2}px` : '0',
                transform: actualPosition === 'center' ? 'translate(-50%, -50%)' : 'translateY(-50%)',
                left: actualPosition === 'center' 
                    ? `${triggerRef.current ? triggerRef.current.getBoundingClientRect().left + triggerRef.current.getBoundingClientRect().width / 2 : 0}px`
                    : actualPosition === 'left'
                    ? `${triggerRef.current ? triggerRef.current.getBoundingClientRect().left : 0}px`
                    : `${triggerRef.current ? triggerRef.current.getBoundingClientRect().right - 400 : 0}px`
            }}
        >
            <div className="bg-[#181818] rounded-lg overflow-hidden shadow-2xl shadow-black/50 animate-scale-in">
                {/* Media Section - Video or Image */}
                <div className="relative w-full h-[200px] overflow-hidden">
                    {youtubeVideoId ? (
                        <>
                            <div className="absolute inset-0 overflow-hidden">
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${youtubeVideoId}&playsinline=1`}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    style={{ border: 'none', minWidth: '100%', minHeight: '100%' }}
                                />
                            </div>
                            {/* Mute toggle */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsMuted(!isMuted);
                                }}
                                className="absolute bottom-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white/80 hover:text-white transition-all"
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                        </>
                    ) : (
                        <img
                            src={mediaSrc}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* Gradient fade */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#181818] to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-4 pt-0">
                    {/* Title */}
                    <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{movie.title}</h3>
                    {movie.subtitle && movie.subtitle !== movie.title && (
                        <p className="text-xs text-amber-400 mb-2 line-clamp-1">{movie.subtitle}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mb-3">
                        <Link
                            href={`/watch/${movie.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm rounded transition-colors"
                        >
                            <Play className="w-4 h-4 fill-black" />
                            <span>Xem ngay</span>
                        </Link>
                        <button className="w-9 h-9 rounded-full border-2 border-gray-500 hover:border-white flex items-center justify-center text-white transition-colors">
                            <Heart className="w-4 h-4" />
                        </button>
                        <Link
                            href={`/movie/${movie.id}`}
                            className="w-9 h-9 rounded-full border-2 border-gray-500 hover:border-white flex items-center justify-center text-white transition-colors"
                        >
                            <Info className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 flex-wrap">
                        {movie.ageRating && (
                            <span className="px-1.5 py-0.5 border border-gray-600 rounded text-gray-400 font-medium text-[10px]">
                                {movie.ageRating}
                            </span>
                        )}
                        {movie.year && <span>{movie.year}</span>}
                        {movie.season && movie.episode && (
                            <>
                                <span>•</span>
                                <span>Phần {movie.season}</span>
                                <span>•</span>
                                <span>Tập {movie.episode}</span>
                            </>
                        )}
                        {movie.duration && (
                            <>
                                <span>•</span>
                                <span>{movie.duration}</span>
                            </>
                        )}
                    </div>

                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap line-clamp-1">
                            {movie.genres.map((genre, index) => (
                                <span key={genre}>
                                    {genre}
                                    {index < movie.genres!.length - 1 && <span className="mx-1">•</span>}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div
            ref={triggerRef}
            className="relative inline-block hover-preview-trigger"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            {/* Preview Popup - Rendered via Portal to body */}
            {isMounted && isVisible && createPortal(previewContent, document.body)}
        </div>
    );
}

export default HoverPreviewCard;
