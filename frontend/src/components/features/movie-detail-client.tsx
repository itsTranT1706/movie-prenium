'use client';

import Link from 'next/link';
import { Play, Plus, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { MovieRow, EpisodeSelector, CommentSection } from '@/components/features';
import { useAuth, useRequireAuth } from '@/hooks';

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
    const { user } = useAuth();
    const requireAuth = useRequireAuth();

    const handleAddToList = () => {
        requireAuth(
            () => {
                console.log('Adding to list...');
                toast.success('Đã thêm vào danh sách của bạn!');
            },
            'Vui lòng đăng nhập để lưu phim vào danh sách'
        );
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
                <Link
                    href="/movies"
                    className="absolute top-20 left-4 lg:left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors z-10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm">Back</span>
                </Link>
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
                                <Link
                                    href={`/watch/${movie.externalId || movie.id}`}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition-colors"
                                >
                                    <Play className="w-5 h-5 fill-black" />
                                    <span>Xem ngay</span>
                                </Link>
                                <button 
                                    onClick={handleAddToList}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-700/50 text-white font-semibold text-sm rounded hover:bg-gray-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Danh sách</span>
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
                                    <CommentSection
                                        movieId={movie.id}
                                        comments={comments}
                                        onSubmitComment={handleSubmitComment}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Top Movies This Week */}
                            <div className="w-full lg:w-80 flex-shrink-0 lg:pl-8 lg:border-l lg:border-white/10">
                                <h2 className="text-xl font-bold text-white mb-6">Top phim tuần này</h2>
                                <div className="space-y-0">
                                    {topWeeklyMovies.map((item: any, index: number) => (
                                        <div key={item.id}>
                                            <Link
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
                                            </Link>
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
