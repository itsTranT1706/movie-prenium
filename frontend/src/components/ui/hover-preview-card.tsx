'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Play, Heart, Info, Volume2, VolumeX, Check } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks';

export interface MoviePreviewData {
    id: string;
    externalId?: string;
    title: string;
    subtitle?: string;
    originalTitle?: string;
    posterUrl?: string;
    backdropUrl?: string;
    trailerUrl?: string;
    ageRating?: string;
    year?: number;
    season?: number;
    episode?: number;
    episodeCurrent?: string;
    duration?: string;
    genres?: string[];
    quality?: string;
    rating?: number;
    mediaType?: 'movie' | 'tv';
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
    const { isAuthenticated } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [actualPosition, setActualPosition] = useState<'left' | 'right' | 'center'>('center');
    const [isMounted, setIsMounted] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState<string | undefined>(movie.trailerUrl);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Check if component is mounted (for portal)
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Fetch trailer when preview becomes visible
    useEffect(() => {
        if (isVisible && !trailerUrl && !isLoadingTrailer) {
            const fetchTrailer = async () => {
                try {
                    setIsLoadingTrailer(true);
                    const tmdbId = movie.externalId || movie.id;
                    const response = await apiClient.getMovieDetails(tmdbId, true);
                    if (response.success && response.data?.trailerUrl) {
                        // console.log(`✅ Loaded trailer for ${movie.title}:`, response.data.trailerUrl);
                        setTrailerUrl(response.data.trailerUrl);
                    }
                } catch (error) {
                    console.error(`Failed to fetch trailer for ${movie.title}:`, error);
                } finally {
                    setIsLoadingTrailer(false);
                }
            };
            fetchTrailer();
        }
    }, [isVisible, trailerUrl, isLoadingTrailer, movie.externalId, movie.id, movie.title]);

    // Check if movie is in favorites when preview becomes visible
    useEffect(() => {
        const checkFavorite = async () => {
            if (!isVisible || !isAuthenticated) return;

            try {
                const response = await apiClient.getFavorites();
                const favoriteData = response?.data || response || [];
                const favorites = Array.isArray(favoriteData) ? favoriteData : [];

                // Check if current movie is in favorites
                const movieIdentifier = movie.externalId || movie.id;
                const isInFavorites = favorites.some((fav: any) => {
                    if (fav.movie) {
                        return fav.movie.id === movie.id ||
                            fav.movie.externalId === movieIdentifier ||
                            fav.movie.id === movieIdentifier;
                    }
                    return fav.movieId === movie.id || fav.movieId === movieIdentifier;
                });

                setIsFavorite(isInFavorites);
            } catch (error) {
                console.error('Failed to check favorite status:', error);
            }
        };

        checkFavorite();
    }, [isVisible, isAuthenticated, movie.externalId, movie.id]);

    // Calculate position based on viewport
    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const previewWidth = 500;

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
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    // Get media source - prioritize trailer
    const hasTrailer = trailerUrl;
    const youtubeVideoId = hasTrailer ? getYouTubeVideoId(trailerUrl!) : null;
    const mediaSrc = movie.backdropUrl || movie.posterUrl || '';

    // Preview content to be rendered via portal
    const previewContent = (
        <div
            ref={previewRef}
            className="fixed pointer-events-auto"
            style={{
                width: '500px',
                zIndex: 2147483647, // Max z-index value
                top: triggerRef.current ? `${triggerRef.current.getBoundingClientRect().top + triggerRef.current.getBoundingClientRect().height / 2}px` : '0',
                transform: actualPosition === 'center' ? 'translate(-50%, -50%)' : 'translateY(-50%)',
                left: actualPosition === 'center'
                    ? `${triggerRef.current ? triggerRef.current.getBoundingClientRect().left + triggerRef.current.getBoundingClientRect().width / 2 : 0}px`
                    : actualPosition === 'left'
                        ? `${triggerRef.current ? triggerRef.current.getBoundingClientRect().left : 0}px`
                        : `${triggerRef.current ? triggerRef.current.getBoundingClientRect().right - 500 : 0}px`
            }}
        >
            <div className="bg-[#181818] rounded-lg overflow-hidden shadow-2xl shadow-black/50 animate-scale-in">
                {/* Media Section - Video or Image */}
                <div className="relative w-full h-[280px] overflow-hidden">
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
                                className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white/80 hover:text-white transition-all"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
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
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#181818] to-transparent" />
                </div>

                {/* Content Section */}
                <div className="p-5 pt-0">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{movie.title}</h3>
                    {(movie.originalTitle || movie.subtitle) && (movie.originalTitle || movie.subtitle) !== movie.title && (
                        <p className="text-sm text-gray-400 mb-2 line-clamp-1">{movie.originalTitle || movie.subtitle}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mb-4">
                        <Link
                            href={`/watch/${movie.externalId || movie.id}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-200 text-black font-semibold text-sm rounded transition-colors"
                        >
                            <Play className="w-4 h-4 fill-black" />
                            <span>Xem ngay</span>
                        </Link>
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                if (!isAuthenticated) {
                                    const { toast } = await import('sonner');
                                    toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
                                    return;
                                }

                                setIsLoadingFavorite(true);
                                const previousState = isFavorite; // Save previous state for rollback

                                try {
                                    const movieId = movie.externalId || movie.id;

                                    if (isFavorite) {
                                        setIsFavorite(false);
                                        await apiClient.removeFavorite(movieId);
                                        const { toast } = await import('sonner');
                                        toast.success('Đã xóa khỏi danh sách yêu thích');
                                    } else {
                                        setIsFavorite(true);
                                        const movieData = {
                                            title: movie.title,
                                            originalTitle: movie.subtitle,
                                            mediaType: 'movie',
                                            posterUrl: movie.posterUrl,
                                            backdropUrl: movie.backdropUrl,
                                            trailerUrl: movie.trailerUrl,
                                            releaseDate: movie.year ? `${movie.year}-01-01` : undefined,
                                            duration: movie.duration ? parseInt(movie.duration) : undefined,
                                            genres: movie.genres || [],
                                            provider: 'tmdb',
                                        };

                                        await apiClient.addFavorite(movieId, movieData);
                                        const { toast } = await import('sonner');
                                        toast.success('Đã thêm vào danh sách yêu thích');
                                    }
                                } catch (error: any) {
                                    console.error('Toggle favorite error:', error);
                                    setIsFavorite(previousState);
                                    const { toast } = await import('sonner');
                                    const errorMessage = error?.message || '';

                                    if (errorMessage.includes('already in favorites') || errorMessage.includes('Movie already in favorites')) {
                                        setIsFavorite(true);
                                        toast.info('Phim đã có trong danh sách yêu thích');
                                    } else if (errorMessage.includes('not in favorites') || errorMessage.includes('Movie not in favorites')) {
                                        setIsFavorite(false);
                                        toast.info('Phim không có trong danh sách yêu thích');
                                    } else {
                                        toast.error(previousState ? 'Không thể xóa khỏi danh sách' : 'Không thể thêm vào danh sách');
                                    }
                                } finally {
                                    setIsLoadingFavorite(false);
                                }
                            }}
                            disabled={isLoadingFavorite}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isFavorite
                                ? 'border-white bg-white/10 text-white hover:bg-white/20'
                                : 'border-gray-500 hover:border-white text-white hover:bg-white/10'
                                }`}
                            title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                        >
                            {isLoadingFavorite ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : isFavorite ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Heart className="w-4 h-4" />
                            )}
                        </button>
                        <Link
                            href={`/movies/${movie.externalId || movie.id}`}
                            className="w-10 h-10 rounded-full border-2 border-gray-500 hover:border-white flex items-center justify-center text-white transition-colors"
                        >
                            <Info className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Metadata Row - IMDb style (Glassmorphism) */}
                    <div className="flex items-center gap-3 text-xs text-gray-300 mb-2.5 flex-wrap">
                        {/* IMDb Rating Badge */}
                        {movie.rating && movie.rating > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-[2px] bg-[#E2B616]/90 backdrop-blur-md border border-[#E2B616]/30 text-black font-black text-[11px] rounded-[4px] shadow-[0_0_10px_rgba(226,182,22,0.4)] tracking-tight">
                                <span>IMDb</span>
                                <span className="font-extrabold">{movie.rating.toFixed(1)}</span>
                            </span>
                        )}
                        {/* Age Rating */}
                        {movie.ageRating && (
                            <span className="px-1.5 py-[1px] border border-white/40 bg-white/10 backdrop-blur-sm rounded-sm text-gray-200 font-medium text-[10px]">
                                {movie.ageRating}
                            </span>
                        )}
                        {/* Year */}
                        {movie.year && <span className="text-white font-medium drop-shadow-md">{movie.year}</span>}
                        {/* Quality badge - Vivid Blue HD (Glassmorphism Glow) */}
                        {movie.quality && (
                            <span className="px-1.5 py-[2px] bg-[#0066FF]/80 backdrop-blur-md border border-[#0066FF]/50 text-white font-bold text-[10px] tracking-wide rounded-[4px] shadow-[0_0_15px_rgba(0,102,255,0.6)]">
                                {movie.quality}
                            </span>
                        )}
                        {/* Season */}
                        {movie.season && (
                            <span className="text-gray-400">Phần {movie.season}</span>
                        )}
                        {/* Episode */}
                        {(movie.episode || movie.episodeCurrent) && (
                            <span className="text-gray-400">
                                Tập {movie.episode || movie.episodeCurrent}
                            </span>
                        )}
                        {/* Duration */}
                        {movie.duration && !movie.episode && !movie.episodeCurrent && (
                            <span className="text-gray-400">{movie.duration}</span>
                        )}
                    </div>

                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap line-clamp-1">
                            {movie.genres.map((genre, index) => (
                                <span key={genre}>
                                    {genre}
                                    {index < (movie.genres?.length || 0) - 1 && <span className="mx-1">•</span>}
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
