'use client';

import { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { NavigationLink } from '@/components/ui';
import { toast } from 'sonner';
import { MovieRow, EpisodeSelector, CommentSection } from '@/components/features';
import { useAuth, useRequireAuth } from '@/hooks';
import { apiClient } from '@/lib/api/client';

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
                () => {},
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
            <div className="relative h-[50vh] lg:h-[70vh]">
                {/* Backdrop Image */}
                <div className="absolute inset-0">
                    <img
                        src={movie.backdropUrl || movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />

                {/* Back Button */}
                <NavigationLink
                    href="/movies"
                    className="absolute top-20 left-4 lg:left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors z-10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm">Back</span>
                </NavigationLink>
            </div>

            {/* Content */}
            <div className="relative -mt-32 lg:-mt-40">
                <div className="container">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Poster */}
                        <div className="hidden lg:block flex-shrink-0 w-[200px]">
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">
                                {movie.title}
                            </h1>

                            {movie.originalTitle && movie.originalTitle !== movie.title && (
                                <p className="text-lg text-amber-400 mb-3">{movie.originalTitle}</p>
                            )}

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                {movie.rating && (
                                    <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        {movie.rating.toFixed(1)}
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
                                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">
                                        {movie.quality}
                                    </span>
                                )}
                            </div>

                            {/* Genres */}
                            {movie.genres && movie.genres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {movie.genres.map((genre: string) => (
                                        <span
                                            key={genre}
                                            className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Description */}
                            {movie.description && (
                                <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-2xl">
                                    {movie.description}
                                </p>
                            )}

                            {/* CTA */}
                            <div className="flex gap-3 mb-6">
                                <NavigationLink
                                    href={`/watch/${movie.externalId || movie.id}`}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition-colors"
                                >
                                    <Play className="w-5 h-5 fill-black" />
                                    <span>Xem ngay</span>
                                </NavigationLink>
                                <button 
                                    onClick={handleToggleFavorite}
                                    disabled={isLoadingFavorite}
                                    className={`flex items-center gap-2 px-5 py-2.5 font-semibold text-sm rounded transition-all ${
                                        isFavorite 
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
                                <div className="space-y-2 text-sm">
                                    {movie.director && (
                                        <p className="text-gray-400">
                                            <span className="text-gray-500">Đạo diễn:</span>{' '}
                                            <span className="text-white">{movie.director}</span>
                                        </p>
                                    )}
                                    {movie.cast && (
                                        <p className="text-gray-400">
                                            <span className="text-gray-500">Diễn viên:</span>{' '}
                                            <span className="text-white">{Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast}</span>
                                        </p>
                                    )}
                                </div>
                            )}
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
                                />

                                {/* Comments Section */}
                                <div className="mt-12 pt-8 border-t border-white/10">
                                    <CommentSection movieId={movie.externalId || movie.id} />
                                </div>
                            </div>

                            {/* Right Column: Top Movies This Week */}
                            <div className="w-full lg:w-80 flex-shrink-0 lg:pl-8 lg:border-l lg:border-white/10">
                                <h2 className="text-xl font-bold text-white mb-6">Top phim tuần này</h2>
                                <div className="space-y-0">
                                    {topWeeklyMovies.map((item: any, index: number) => (
                                        <div key={item.id}>
                                            <NavigationLink
                                                href={`/movies/${item.id}`}
                                                className="flex gap-3 py-3 hover:bg-white/5 transition-colors group"
                                            >
                                                <div className="flex-shrink-0 w-16 h-24 rounded overflow-hidden bg-white/5">
                                                    <img
                                                        src={item.posterUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2 group-hover:text-gray-200 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    {item.subtitle && (
                                                        <p className="text-gray-400 text-xs mb-1">
                                                            {item.subtitle}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span>{item.season}</span>
                                                        <span>•</span>
                                                        <span>{item.episode}</span>
                                                    </div>
                                                </div>
                                            </NavigationLink>
                                            {index < topWeeklyMovies.length - 1 && (
                                                <div className="border-t border-white/5" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Movies */}
                {similarMovies.length > 0 && (
                    <div className="mt-12 pb-12">
                        <MovieRow
                            title="Phim tương tự"
                            movies={similarMovies}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
