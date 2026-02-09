'use client';

import { useEffect, useRef } from 'react';
import { Heart, Plus, Star, Calendar, Clock } from 'lucide-react';
import { NavigationLink, ExpandableText } from '@/shared/components/ui';
import { toast } from 'sonner';
import { CommentSection } from '@/features/comments';
import { EpisodeSelector } from './episode-selector';
import { CurvedVideoPlayer } from './curved-video-player';
import { EpisodeTabs } from './episode-tabs';
import { MovieReactionSelector } from '@/features/movies/components/movie-reaction-selector';
import { useAuth, useRequireAuth } from '@/features/auth';
import { apiClient } from '@/shared/lib/api';
import { MobileWatchLayout } from './mobile-watch-layout';
import { useMediaQuery } from '@/hooks/use-media-query';

interface WatchPageClientProps {
    movie: any;
    seasons: any[];
    comments: any[];
    topWeeklyMovies: any[];
    currentServerId?: string;
    currentEpisodeId?: string;
}

export function WatchPageClient({
    movie,
    seasons,
    comments,
    topWeeklyMovies,
    currentServerId = 'server1',
    currentEpisodeId = 'e1'
}: WatchPageClientProps) {

    // Helper to format server name for display
    const formatServerName = (name?: string): string | undefined => {
        if (!name) return undefined;
        const lowerName = name.toLowerCase();

        if (lowerName.includes('vietsub') || lowerName.includes('viet sub')) return 'Vietsub';
        if (lowerName.includes('thuyết minh') || lowerName.includes('thuyet minh')) return 'Thuyết minh';
        if (lowerName.includes('lồng tiếng') || lowerName.includes('long tieng')) return 'Lồng tiếng';
        if (lowerName.includes('engsub') || lowerName.includes('eng sub')) return 'Engsub';
        if (lowerName.includes('raw')) return 'Raw';

        // Try to extract text in parentheses
        const parenMatch = name.match(/\(([^)]+)\)/);
        if (parenMatch) return parenMatch[1];

        return name;
    };
    const { user, isAuthenticated } = useAuth();
    const requireAuth = useRequireAuth();
    const playerRef = useRef<HTMLDivElement>(null);
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    // Auto-scroll to player on mount


    // Find the current server and episode
    const currentServer = seasons.find(s => s.id === currentServerId) || seasons[0];
    const currentEpisode = currentServer?.episodes.find((ep: any) => ep.id === currentEpisodeId);
    const episodeNumber = currentEpisode ? currentEpisode.number : 1;

    // Get the server index (server1 -> 0, server2 -> 1, etc.)
    const serverIndex = seasons.findIndex(s => s.id === currentServerId);
    const sourceIndex = serverIndex >= 0 ? serverIndex : 0;

    // Get video URL for the current episode from the selected server
    const selectedSource = movie.sources?.[sourceIndex];
    const episodeData = selectedSource?.episodes?.find((ep: any) => ep.episodeNumber === episodeNumber);
    const videoUrl = episodeData?.embedUrl ||
        selectedSource?.episodes?.[0]?.embedUrl ||
        movie.sources?.[0]?.episodes?.[0]?.embedUrl ||
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGhidWR2ODF5bzl5M2VrMHZxZ2NseXZtcGRjYzA1NXFlcGtsOGJnMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/WmtTa52BN4zTdDdyV7/giphy.gif';


    // Auto-scroll to player on mount with robust handling
    useEffect(() => {
        // Disable browser scroll restoration to ensure we can control initial scroll
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const scrollToPlayer = (attempts = 0) => {
            if (playerRef.current) {
                const element = playerRef.current;
                // Calculate accurate position
                // We use offsetTop + parent offsets or getBoundingClientRect + scrollY
                // Goal: Center the element in viewport
                // Target ScrollY = AbsoluteTop - (ViewportHeight - ElementHeight) / 2

                const elementRect = element.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.scrollY;
                const elementHeight = elementRect.height;
                const viewportHeight = window.innerHeight;

                // Calculate position to center the player in the viewport
                // Goal: elementTop = (viewportHeight - elementHeight) / 2
                // ScrollY = absoluteElementTop - (viewportHeight - elementHeight) / 2
                let targetPosition = absoluteElementTop - (viewportHeight - elementHeight) / 2;

                // Ensure we don't scroll past the top (if element is larger than viewport or very close to top)
                // Also respect the header offset so we don't hide the player under the header if centering puts it too high
                const headerOffset = 80;
                if (targetPosition < absoluteElementTop - headerOffset) {
                    targetPosition = absoluteElementTop - headerOffset;
                }

                // Check distance and scroll
                if (Math.abs(window.scrollY - targetPosition) > 5) { // lowered threshold
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }

                // Retry a few times to ensure layout stability (e.g. images loading)
                if (attempts < 5) {
                    setTimeout(() => scrollToPlayer(attempts + 1), 300 + (attempts * 100));
                }
            }
        };

        // Initial attempt - wait a bit longer for layout
        const timer = setTimeout(() => scrollToPlayer(), 300);

        return () => {
            clearTimeout(timer);
            // Restore default behavior on unmount
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, [movie?.id, videoUrl]);

    // Track watch history
    useEffect(() => {
        const trackHistory = async () => {
            if (isAuthenticated && movie?.id) {
                try {
                    // console.log('🎬 Tracking watch history:', {
                    //     movieId: movie.id,
                    //     episodeNumber,
                    //     serverName: currentServer?.name,
                    //     currentServerId,
                    //     isAuthenticated,
                    //     user,
                    //     movie
                    // });

                    // Send movie data to ensure it exists in database
                    const movieData = {
                        externalId: movie.externalId || movie.id,
                        title: movie.title || 'Unknown Movie',
                        originalTitle: movie.originalTitle,
                        posterUrl: movie.posterUrl,
                        backdropUrl: movie.backdropUrl,
                        mediaType: movie.mediaType || 'movie',
                        description: movie.description,
                        releaseDate: movie.releaseDate,
                        rating: movie.rating,
                        genres: movie.genres || [],
                    };

                    // console.log('📦 Movie data being sent:', movieData);

                    const result = await apiClient.addWatchHistory(
                        movie.id,
                        episodeNumber,
                        movieData,
                        currentServerId, // Pass server ID to ensure correct URL generation for Continue Watching
                        formatServerName(currentServer?.name) // Pass friendly display name
                    );
                    // console.log('✅ Watch history tracked:', result);
                } catch (err) {
                    console.error('❌ Failed to track watch history:', err);
                }
            } else {
                // console.log('⏸️ Not tracking:', { isAuthenticated, movieId: movie?.id });
            }
        };

        trackHistory();
    }, [isAuthenticated, movie?.id, episodeNumber, user]);

    const handleAddToFavorites = async () => {
        // console.log('handleAddToFavorites called!', { movieId: movie.id, externalId: movie.externalId, movie });

        requireAuth(async () => {
            try {
                // console.log('Auth passed, calling API...');
                const apiClient = (await import('@/lib/api/client')).default;
                // console.log('API client loaded:', apiClient);

                // Use externalId if available, otherwise use id
                const movieId = movie.externalId || movie.id;

                // Prepare movie data to send to backend
                const movieData = {
                    title: movie.title,
                    originalTitle: movie.originalTitle,
                    mediaType: movie.mediaType || 'movie',
                    description: movie.description,
                    posterUrl: movie.posterUrl,
                    backdropUrl: movie.backdropUrl,
                    trailerUrl: movie.trailerUrl,
                    releaseDate: movie.releaseDate,
                    duration: movie.duration,
                    rating: movie.rating,
                    genres: movie.genres || [],
                    provider: 'tmdb',
                };

                // console.log('Calling addFavorite with movieId:', movieId, 'and movieData:', movieData);
                const result = await apiClient.addFavorite(movieId, movieData);
                // console.log('Add favorite result:', result);

                toast.success('Đã thêm vào yêu thích!');
            } catch (error: any) {
                console.error('Add to favorites error:', error);

                if (error?.message?.includes('already in favorites')) {
                    toast.info('Phim đã có trong danh sách yêu thích');
                } else {
                    toast.error('Không thể thêm vào yêu thích');
                }
            }
        }, 'Vui lòng đăng nhập để thêm vào yêu thích');
    };

    const handleAddToList = () => {
        requireAuth(() => {
            toast.success('Đã thêm vào danh sách của bạn!');
        }, 'Vui lòng đăng nhập để lưu phim vào danh sách');
    };

    const handleSubmitComment = (text: string) => {
        toast.success('Bình luận đã được đăng!');
    };

    return (
        <>
            {/* Mobile Layout */}
            <div className="block lg:hidden">
                <MobileWatchLayout
                    movie={movie}
                    seasons={seasons}
                    comments={comments}
                    currentServerId={currentServerId}
                    currentEpisodeId={currentEpisodeId}
                    videoUrl={!isDesktop ? videoUrl : ''}
                />
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block min-h-screen bg-[#0a0a0a] pt-16">
                {/* Breadcrumb */}
                <div className="w-full flex justify-center px-4 md:px-12">
                    <div className="w-full py-1">
                        <NavigationLink href={`/movies/${movie.externalId || movie.id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm">Thông tin phim {movie.title}</span>
                        </NavigationLink>
                    </div>
                </div>

                {/* Video Player Section */}
                <div className="relative bg-[#0a0a0a] pb-8 pt-4">
                    <div ref={playerRef} className="w-full flex flex-col items-center scroll-mt-28">
                        <div className="w-full px-4 md:px-12">
                            <div className="mb-3">
                                <h1 className="text-white text-lg font-semibold">{movie.title}</h1>
                                {movie.originalTitle && movie.originalTitle !== movie.title && (
                                    <p className="text-gray-400 text-sm">{movie.originalTitle}</p>
                                )}
                            </div>
                        </div>

                        <div className="w-full">
                            {/* Curved Video Player */}
                            <CurvedVideoPlayer
                                videoUrl={isDesktop ? videoUrl : ''}
                                title={movie.title}
                                posterUrl={movie.backdropUrl || movie.posterUrl}
                            />

                            {/* Episode Tabs - Overlapping the video */}
                            <EpisodeTabs
                                movieId={movie.id}
                                externalId={movie.externalId}
                                seasons={seasons}
                                currentSeasonId={currentServerId}
                                currentEpisodeId={currentEpisodeId}
                            />
                        </div>
                    </div>
                </div>

                {/* Movie Info and Content */}
                <div className="w-full flex justify-center px-4 md:px-12">
                    <div className="w-full py-6">
                        <div className="mb-6">
                            <div className="flex gap-6 mb-4">
                                <div className="hidden lg:block flex-shrink-0 w-32">
                                    <img src={movie.posterUrl} alt={movie.title} className="w-full rounded" />
                                </div>

                                <div className="flex-1">
                                    <h1 className="text-2xl lg:text-3xl font-black text-white mb-2">{movie.title}</h1>
                                    {movie.originalTitle && movie.originalTitle !== movie.title && (
                                        <p className="text-gray-400 text-sm mb-3">{movie.originalTitle}</p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        {movie.rating && (
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 border border-yellow-500/60 rounded text-sm font-bold bg-black/40 text-white shadow-sm">
                                                <span className="text-[#f5c518]">IMDb</span>
                                                <span>{movie.rating.toFixed(1)}</span>
                                            </span>
                                        )}
                                        {movie.releaseDate && (
                                            <span className="flex items-center gap-1 text-gray-400 text-sm">
                                                <Calendar className="w-4 h-4" />{new Date(movie.releaseDate).getFullYear()}
                                            </span>
                                        )}
                                        {movie.duration && (
                                            <span className="flex items-center gap-1 text-gray-400 text-sm">
                                                <Clock className="w-4 h-4" />{Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                                            </span>
                                        )}
                                        {(movie.quality || true) && (
                                            <span className="px-2 py-0.5 bg-[#0057e3] text-white text-xs font-bold rounded-sm shadow-sm">
                                                {movie.quality || 'HD'}
                                            </span>
                                        )}
                                    </div>

                                    {movie.genres && movie.genres.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {movie.genres.map((genre: string) => (
                                                <span
                                                    key={genre}
                                                    className="px-3 py-1 bg-zinc-800/50 border border-white/10 text-gray-300 text-xs font-medium rounded-full hover:bg-white/10 hover:border-white/20 hover:text-white transition-all cursor-default backdrop-blur-sm"
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {movie.description && (
                                        <ExpandableText
                                            content={movie.description}
                                            className="mb-4 lg:w-1/2"
                                        />
                                    )}
                                </div>

                                <div className="flex-shrink-0 flex flex-col items-end gap-4">
                                    <div className="flex gap-2">
                                        <button onClick={handleAddToFavorites} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors" title="Thêm vào yêu thích">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                        <button onClick={handleAddToList} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors" title="Thêm vào danh sách">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Reaction Selector */}
                                    <MovieReactionSelector
                                        movieId={movie.externalId || movie.id}
                                        movieTitle={movie.title}
                                        moviePoster={movie.backdropUrl || movie.posterUrl}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Comments and Sidebar */}
                        <div className="border-t border-white/10 pt-6">
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 min-w-0">
                                    <CommentSection movieId={movie.externalId || movie.id} />
                                </div>

                                <div className="w-full lg:w-80 flex-shrink-0 lg:pl-8 lg:border-l lg:border-white/10">
                                    <h2 className="text-xl font-bold text-white mb-6">Top phim tuần này</h2>
                                    <div className="space-y-0">
                                        {topWeeklyMovies.map((item: any, index: number) => (
                                            <div key={item.id}>
                                                <NavigationLink href={`/movies/${item.id}`} className="flex gap-3 py-3 hover:bg-white/5 transition-colors group">
                                                    <div className="flex-shrink-0 w-16 h-24 rounded overflow-hidden bg-white/5">
                                                        <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2 group-hover:text-gray-200 transition-colors">{item.title}</h3>
                                                        {item.subtitle && <p className="text-gray-400 text-xs mb-1">{item.subtitle}</p>}
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <span>{item.season}</span><span>•</span><span>{item.episode}</span>
                                                        </div>
                                                    </div>
                                                </NavigationLink>
                                                {index < topWeeklyMovies.length - 1 && <div className="border-t border-white/5" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
