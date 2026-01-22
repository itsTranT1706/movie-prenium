'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';

export interface TheaterMovie {
    id: string;
    title: string;
    subtitle?: string;
    backdropUrl?: string;
    trailerUrl?: string;
    posterUrl: string;
    ageRating?: string;
    year: number;
    duration?: string;
    rating?: number;
    genres?: string[];
}

interface TheaterMoviesSectionProps {
    title?: string;
    href?: string;
    movies: TheaterMovie[];
    autoPlayInterval?: number;
}

/**
 * Extract YouTube video ID from various URL formats
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
 * Check if URL is a YouTube URL
 */
function isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * Theater Movies Section Component (Client)
 * Backdrop/Trailer with poster overlay design
 * Auto-advances every 5s or when trailer ends
 */
export default function TheaterMoviesSection({
    title = 'Theater Movies is coming soon',
    href = '/movies/theater',
    movies,
    autoPlayInterval = 4000,
}: TheaterMoviesSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const activeMovie = movies.length > 0 ? movies[activeIndex] : null;
    // Prioritize trailer over backdrop if available
    const hasTrailer = activeMovie && !!activeMovie.trailerUrl;
    const isYouTube = hasTrailer && activeMovie?.trailerUrl && isYouTubeUrl(activeMovie.trailerUrl);
    const youtubeVideoId = isYouTube && activeMovie?.trailerUrl ? getYouTubeVideoId(activeMovie.trailerUrl) : null;

    // Smooth transition helper
    const transitionTo = useCallback((newIndex: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveIndex(newIndex);
            setTimeout(() => setIsTransitioning(false), 50);
        }, 300);
    }, [isTransitioning]);

    // Go to next movie
    const goToNext = useCallback(() => {
        if (movies.length === 0) return;
        const newIndex = activeIndex === movies.length - 1 ? 0 : activeIndex + 1;
        transitionTo(newIndex);
    }, [activeIndex, movies.length, transitionTo]);

    // Go to previous movie
    const goToPrev = useCallback(() => {
        if (movies.length === 0) return;
        const newIndex = activeIndex === 0 ? movies.length - 1 : activeIndex - 1;
        transitionTo(newIndex);
    }, [activeIndex, movies.length, transitionTo]);

    // Handle trailer end
    const handleTrailerEnd = useCallback(() => {
        goToNext();
    }, [goToNext]);

    // Toggle mute
    const toggleMute = useCallback(() => {
        setIsMuted((prev) => !prev);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    }, [isMuted]);

    // Pause on hover
    const handleMouseEnter = useCallback(() => setIsPaused(true), []);
    const handleMouseLeave = useCallback(() => setIsPaused(false), []);

    // Auto-advance timer
    useEffect(() => {
        if (isPaused || movies.length === 0) return;

        // Clear existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // If current movie has trailer, let video end event handle advancement
        // Otherwise, use timer
        if (!hasTrailer) {
            timerRef.current = setTimeout(() => {
                goToNext();
            }, autoPlayInterval);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [activeIndex, isPaused, hasTrailer, autoPlayInterval, goToNext, movies.length]);

    // Show empty state if no movies
    if (movies.length === 0) {
        return null;
    }

    if (!activeMovie) {
        return null;
    }

    return (
        <section className="py-4 lg:py-6">
            <div className="container">
                {/* Header */}
                <Link
                    href={href}
                    className="inline-flex items-center gap-2 mb-4 group"
                >
                    <h2 className="text-base lg:text-lg font-bold text-white group-hover:text-gray-200 transition-colors">
                        {title}
                    </h2>
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                </Link>

                {/* Main Card with Navigation */}
                <div
                    className="flex items-center gap-3 lg:gap-4"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Left Arrow - Outside */}
                    <button
                        onClick={goToPrev}
                        className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/20 hover:border-white/40 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                        aria-label="Previous movie"
                    >
                        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>

                    {/* Card Content */}
                    <div className={`flex-1 relative bg-[#1a1a2e] rounded-2xl overflow-hidden transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}>
                        {/* Backdrop Image or Video Trailer */}
                        <div className="relative aspect-[21/9] lg:aspect-[21/8]">
                            {hasTrailer ? (
                                <>
                                    {isYouTube && youtubeVideoId ? (
                                        // YouTube Embed - scaled to cover container
                                        <div className="absolute inset-0 overflow-hidden">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${youtubeVideoId}&playsinline=1&vq=hd1080&hd=1`}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] pointer-events-none"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                style={{ border: 'none' }}
                                            />
                                        </div>
                                    ) : (
                                        // Regular video file
                                        <video
                                            ref={videoRef}
                                            src={activeMovie.trailerUrl}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            autoPlay
                                            muted={isMuted}
                                            playsInline
                                            onEnded={handleTrailerEnd}
                                        />
                                    )}
                                    {/* Mute toggle button */}
                                    <button
                                        onClick={toggleMute}
                                        className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white/80 hover:text-white transition-all backdrop-blur-sm"
                                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                                    >
                                        {isMuted ? (
                                            <VolumeX className="w-4 h-4" />
                                        ) : (
                                            <Volume2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </>
                            ) : (
                                // Fallback to backdrop if no trailer
                                activeMovie.backdropUrl ? (
                                    <img
                                        src={activeMovie.backdropUrl}
                                        alt={activeMovie.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    // Fallback to poster if no backdrop
                                    <img
                                        src={activeMovie.posterUrl}
                                        alt={activeMovie.title}
                                        className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
                                    />
                                )
                            )}
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/60 to-transparent" />

                            {/* Progress bar for auto-advance */}
                            {!hasTrailer && !isPaused && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                    <div
                                        className="h-full bg-white/50 animate-progress"
                                        style={{
                                            animation: `progress ${autoPlayInterval}ms linear`,
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content Overlay - Poster + Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                            <div className="flex gap-4 lg:gap-6 items-end">
                                {/* Poster */}
                                <Link
                                    href={`/movies/${activeMovie.id}`}
                                    className="flex-shrink-0 w-24 lg:w-32 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl hover:scale-105 transition-transform"
                                >
                                    <img
                                        src={activeMovie.posterUrl}
                                        alt={activeMovie.title}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>

                                {/* Movie Info */}
                                <div className="flex-1 min-w-0 pb-1">
                                    {/* Genres */}
                                    {activeMovie.genres && activeMovie.genres.length > 0 && (
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            {activeMovie.genres.slice(0, 3).map((genre, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-gray-700/80 rounded text-[10px] font-medium text-gray-300">
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Title */}
                                    <Link href={`/movies/${activeMovie.id}`}>
                                        <h3 className="text-lg lg:text-xl font-bold text-white hover:text-gray-200 transition-colors line-clamp-1">
                                            {activeMovie.title}
                                        </h3>
                                    </Link>

                                    {/* Subtitle */}
                                    {activeMovie.subtitle && activeMovie.subtitle !== activeMovie.title && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {activeMovie.subtitle}
                                        </p>
                                    )}

                                    {/* Metadata */}
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                        {activeMovie.rating && (
                                            <>
                                                <span className="text-yellow-500">★ {activeMovie.rating.toFixed(1)}</span>
                                                <span>•</span>
                                            </>
                                        )}
                                        <span>{activeMovie.year}</span>
                                        {activeMovie.duration && (
                                            <>
                                                <span>•</span>
                                                <span>{activeMovie.duration}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Arrow - Outside */}
                    <button
                        onClick={goToNext}
                        className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/20 hover:border-white/40 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                        aria-label="Next movie"
                    >
                        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                </div>

                {/* Dots indicator */}
                <div className="flex items-center justify-center gap-1.5 mt-4">
                    {movies.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === activeIndex
                                ? 'bg-white w-6'
                                : 'bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Go to movie ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* CSS for progress animation */}
            <style jsx>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </section>
    );
}
