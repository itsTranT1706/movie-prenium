'use client';

import { useState, useEffect, useMemo } from 'react';
import { Play, Plus, Check, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { NavigationLink, LazySection, ExpandableText } from '@/shared/components/ui';
import { toast } from 'sonner';
import { CommentSection } from '@/features/comments';
import { EpisodeSelector } from '@/features/watch';
import MovieRow from './movie-row';
import { CommunityPulse } from './community-pulse';
import { MovieCastList } from './movie-cast-list';
import { TopWeeklyMoviesSidebar } from './top-weekly-movies-sidebar';
import { Gallery3DCarousel } from './gallery-3d-carousel';
import { ShortsCarousel } from './shorts-carousel';
import { useAuth, useRequireAuth } from '@/features/auth';
import { apiClient } from '@/shared/lib/api';
import { getRandomImage } from '@/shared/lib/utils/image-utils';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface MovieDetailClientProps {
    movie: any;
    seasons: any[];
    comments: any[];
    similarMovies: any[];
    topWeeklyMovies: any[];
}


export function MovieDetailClient({
    movie,
    seasons,
    comments,
    similarMovies,
    topWeeklyMovies,
}: MovieDetailClientProps) {
    const { user, isAuthenticated } = useAuth();
    const requireAuth = useRequireAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

    // Poster Scale Logic
    const { scrollY } = useScroll();
    const scale = useTransform(scrollY, [0, 500], [1, 1.15]); // Scales from 1 to 1.15 over 500px scroll

    // Randomize images on mount/prop change
    const displayBackdrop = useMemo(() => getRandomImage(movie.backdrops, movie.backdropUrl || movie.posterUrl), [movie]);
    const displayPoster = useMemo(() => getRandomImage(movie.posters, movie.posterUrl), [movie]);

    // Check if movie is in favorites
    useEffect(() => {
        const checkFavorite = async () => {
            if (!isAuthenticated || !movie?.id) return;

            try {
                const response = await apiClient.getFavorites();
                const favoriteData = response?.data || response || [];
                const favorites = Array.isArray(favoriteData) ? favoriteData : [];

                // Check if current movie is in favorites
                // Compare with both internal movieId and externalId from the favorite's movie object
                const movieIdentifier = movie.externalId || movie.id;
                const isInFavorites = favorites.some((fav: any) => {
                    // Check against the favorite's movie data if available
                    if (fav.movie) {
                        return fav.movie.id === movie.id ||
                            fav.movie.externalId === movieIdentifier ||
                            fav.movie.id === movieIdentifier;
                    }
                    // Fallback to checking movieId directly
                    return fav.movieId === movie.id || fav.movieId === movieIdentifier;
                });

                console.log('🔍 Check favorite status:', {
                    movieId: movie.id,
                    externalId: movie.externalId,
                    isInFavorites,
                    totalFavorites: favorites.length
                });

                setIsFavorite(isInFavorites);
            } catch (error) {
                console.error('Failed to check favorite status:', error);
            }
        };

        checkFavorite();
    }, [isAuthenticated, movie?.id, movie?.externalId]);

    const handleToggleFavorite = async () => {
        if (!isAuthenticated) {
            requireAuth(
                () => { },
                'Vui lòng đăng nhập để lưu phim vào danh sách'
            );
            return;
        }

        setIsLoadingFavorite(true);
        const previousState = isFavorite; // Save previous state for rollback

        try {
            const movieId = movie.externalId || movie.id;

            if (isFavorite) {
                // Optimistically update UI
                setIsFavorite(false);

                // Remove from favorites
                await apiClient.removeFavorite(movieId);
                toast.success('Đã xóa khỏi danh sách yêu thích');
            } else {
                // Optimistically update UI
                setIsFavorite(true);

                // Add to favorites
                await apiClient.addFavorite(movieId);
                toast.success('Đã thêm vào danh sách yêu thích');
            }
        } catch (error: any) {
            console.error('Toggle favorite error:', error);

            // Rollback UI state on error
            setIsFavorite(previousState);

            // Check error message for specific cases
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
    };

    const handleSubmitComment = (text: string) => {
        console.log('Submitting comment:', text);
        toast.success('Bình luận đã được đăng!');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Hero Section with Backdrop */}
            <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh]">
                {/* Backdrop Image */}
                <div className="absolute inset-0">
                    <img
                        src={displayBackdrop}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Halftone Dot Shading Layer - Consistent with Hero Banner */}
                <div
                    className="absolute inset-0 pointer-events-none z-0"
                    style={{
                        // Pattern: Fine halftone dots
                        backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.4) 1px, transparent 1px), radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
                        backgroundSize: '4px 4px, 4px 4px',
                        backgroundPosition: '0 0, 2px 2px',

                        // Blend
                        mixBlendMode: 'overlay',
                        opacity: 0.4,

                        // Mask: Center subject lighter
                        maskImage: `radial-gradient(circle at 50% 50%, transparent 0%, black 100%)`,
                        WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent 0%, black 100%)`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent md:from-black md:via-black/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />

                {/* Back Button - Icon only on mobile */}
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-4 md:top-20 left-4 lg:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2.5 md:px-4 md:py-2 rounded-full md:rounded-lg border border-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden md:inline text-sm font-medium">Quay lại</span>
                </button>

                {/* Mobile Floating Poster */}
                <motion.div
                    style={{ scale }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 md:hidden z-20 origin-bottom"
                >
                    <img
                        src={displayPoster}
                        alt={movie.title}
                        className="w-28 h-auto rounded-xl shadow-2xl ring-2 ring-black/50"
                    />
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative pt-16 md:pt-0 md:-mt-32 lg:-mt-40 z-10">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Poster - Desktop only */}
                        <div className="hidden lg:block flex-shrink-0 w-[200px]">
                            <img
                                src={displayPoster}
                                alt={movie.title}
                                className="w-full rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2 md:mb-3">
                                {movie.title}
                            </h1>

                            {movie.originalTitle && movie.originalTitle !== movie.title && (
                                <p className="text-base md:text-lg text-amber-400 mb-2 md:mb-3">{movie.originalTitle}</p>
                            )}

                            {/* Meta - Horizontal scroll on mobile */}
                            <div className="flex flex-nowrap md:flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 mb-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                {movie.rating && (
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 border border-yellow-500/60 rounded text-sm font-bold bg-black/40 text-white shadow-sm">
                                        <span className="text-[#f5c518]">IMDb</span>
                                        <span>{movie.rating.toFixed(1)}</span>
                                    </span>
                                )}
                                {movie.releaseDate && (
                                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(movie.releaseDate).getFullYear()}
                                    </span>
                                )}
                                {movie.duration && (
                                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                                        <Clock className="w-4 h-4" />
                                        {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                    </span>
                                )}
                                {movie.quality && (
                                    <span className="px-2 py-0.5 bg-[#0057e3] text-white text-xs font-bold rounded-sm">
                                        {movie.quality}
                                    </span>
                                )}
                            </div>

                            {/* Genres - Horizontal scroll on mobile, centered */}
                            {movie.genres && movie.genres.length > 0 && (
                                <div className="flex flex-nowrap md:flex-wrap justify-center md:justify-start gap-2 mb-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                    {movie.genres.map((genre: string) => (
                                        <span
                                            key={genre}
                                            className="shrink-0 px-3 py-1 bg-zinc-800/50 border border-white/10 text-gray-300 text-xs font-medium rounded-full hover:bg-white/10 hover:border-white/20 hover:text-white transition-all cursor-default backdrop-blur-sm"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Description */}
                            {movie.description && (
                                <ExpandableText
                                    content={movie.description}
                                    className="mb-6 max-w-xl mx-auto md:mx-0 text-center md:text-left"
                                />
                            )}

                            {/* CTA - Full width on mobile */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <NavigationLink
                                    href={`/watch/${movie.externalId || movie.id}`}
                                    className="flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 bg-white text-black font-bold text-sm rounded-lg md:rounded hover:bg-gray-200 transition-colors w-full sm:w-auto"
                                >
                                    <Play className="w-5 h-5 fill-black" />
                                    <span>Xem ngay</span>
                                </NavigationLink>
                                <button
                                    onClick={handleToggleFavorite}
                                    disabled={isLoadingFavorite}
                                    className={`cursor-pointer flex items-center justify-center gap-2 px-5 py-3 md:py-2.5 font-semibold text-sm rounded-lg md:rounded transition-all w-full sm:w-auto ${isFavorite
                                        ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                                        : 'bg-gray-700/50 text-white hover:bg-gray-700'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isLoadingFavorite ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : isFavorite ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>Đã thêm</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            <span>Danh sách</span>
                                        </>
                                    )}
                                </button>
                            </div>


                            {/* Credits */}
                            {(movie.director || movie.cast) && (
                                <div className="space-y-2 text-sm max-w-xl mb-6">
                                    {movie.director && (
                                        <div className="text-gray-400 flex gap-1">
                                            <span className="text-gray-500 shrink-0">Đạo diễn:</span>
                                            <span className="text-white" dangerouslySetInnerHTML={{ __html: movie.director }} />
                                        </div>
                                    )}
                                    {movie.cast && (
                                        <div className="text-gray-400 flex gap-1">
                                            <span className="text-gray-500 shrink-0">Diễn viên:</span>
                                            <span
                                                className="text-white"
                                                dangerouslySetInnerHTML={{
                                                    __html: Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Cast List - Compact in Center Column */}
                            <div className="-ml-1">
                                <MovieCastList movieId={movie.id} externalId={movie.externalId} />
                            </div>

                            {/* Mobile/Tablet: Community Pulse & Gallery (hidden on xl+) */}
                            <div className="xl:hidden mt-6 space-y-6">
                                <CommunityPulse movie={movie} comments={comments} />

                                {/* Gallery for mobile - simplified layout */}
                                <div className="overflow-hidden rounded-xl">
                                    <Gallery3DCarousel items={[
                                        ...(movie.trailerUrl ? [{
                                            id: 'trailer',
                                            type: 'video' as const,
                                            url: movie.trailerUrl,
                                            title: 'Trailer',
                                            rating: movie.rating,
                                            category: movie.genres?.[0],
                                            duration: '2:30'
                                        }] : []),
                                        ...(movie.backdrops?.slice(0, 5).map((url: string, i: number) => ({
                                            id: `backdrop-${i}`,
                                            type: 'image' as const,
                                            url: url,
                                            title: `Backdrop ${i + 1}`,
                                            rating: movie.rating,
                                            category: movie.genres?.[0]
                                        })) || []),
                                        ...(!movie.backdrops?.length ? [{
                                            id: 'poster',
                                            type: 'image' as const,
                                            url: movie.posterUrl,
                                            title: movie.title,
                                            rating: movie.rating
                                        }] : [])
                                    ]} />
                                </div>
                            </div>
                        </div>

                        {/* Community Pulse & Trailer - Right Column (Desktop) */}
                        <div className="hidden xl:flex flex-col gap-4 w-[550px] flex-shrink-0 overflow-visible">
                            <CommunityPulse movie={movie} comments={comments} />

                            {/* 3D Gallery Carousel */}
                            <div className="mt-4 overflow-visible">
                                <Gallery3DCarousel items={[
                                    // Trailer
                                    ...(movie.trailerUrl ? [{
                                        id: 'trailer',
                                        type: 'video' as const,
                                        url: movie.trailerUrl,
                                        title: 'Trailer',
                                        rating: movie.rating,
                                        category: movie.genres?.[0],
                                        duration: '2:30'
                                    }] : []),
                                    // Backdrops
                                    ...(movie.backdrops?.slice(0, 5).map((url: string, i: number) => ({
                                        id: `backdrop-${i}`,
                                        type: 'image' as const,
                                        url: url,
                                        title: `Backdrop ${i + 1}`,
                                        rating: movie.rating,
                                        category: movie.genres?.[0]
                                    })) || []),
                                    // Fallback to poster if backdrops are empty
                                    ...(!movie.backdrops?.length ? [{
                                        id: 'poster',
                                        type: 'image' as const,
                                        url: movie.posterUrl,
                                        title: movie.title,
                                        rating: movie.rating
                                    }] : [])
                                ]} />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Main Content Section with 2 Columns */}
                <div className="container mt-12">
                    <div className="border-t border-white/10 pt-8">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
                            {/* Left Column: Episodes + Comments */}
                            <div className="flex-1 lg:pr-8">
                                {/* Episodes Section */}
                                <EpisodeSelector
                                    movieId={movie.id}
                                    externalId={movie.externalId}
                                    seasons={seasons}
                                    currentSeasonId="server1"
                                    currentEpisodeId="e1"
                                    showSubtitleToggle={true}
                                    showAutoPlay={false}
                                    basePath="movies"
                                    mediaType={movie.mediaType}
                                    movieTitle={movie.title}
                                    backdropUrl={displayBackdrop}
                                />

                                {/* Comments Section */}
                                <div className="mt-12 pt-8 border-t border-white/10">
                                    <CommentSection movieId={movie.externalId || movie.id} />
                                </div>
                            </div>

                            {/* Right Column: Community Pulse & Top Movies */}
                            <div className="w-full lg:w-80 flex-shrink-0 lg:pl-8 lg:border-l lg:border-white/10 space-y-8">
                                {/* Community Pulse Section moved to top */}


                                {/* Related Shorts */}
                                <div className="mb-8">
                                    <ShortsCarousel
                                        title="Shorts liên quan"
                                        mode="related"
                                        query={`${movie.title} shorts`}
                                        className="py-0"
                                    />
                                </div>

                                <div>
                                    <TopWeeklyMoviesSidebar movies={topWeeklyMovies} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function TrailerEmbed({ url, title }: { url: string; title: string }) {
    if (!url) return null;

    // Simple YouTube ID extraction
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;

    // Only render if it looks like a valid embeddable URL or we extracted an ID
    if (!videoId && !url.includes('embed')) return null;

    return (
        <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Play className="w-4 h-4 text-red-500 fill-red-500" />
                Trailer
            </h3>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black group cursor-pointer">
                <iframe
                    src={embedUrl}
                    title={`Trailer for ${title}`}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>
        </div>
    );
}
