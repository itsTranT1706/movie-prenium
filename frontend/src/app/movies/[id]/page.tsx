'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Plus, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { MovieRow, EpisodeSelector, CommentSection } from '@/components/features';
import { useAuth, useRequireAuth } from '@/hooks';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
    const { user } = useAuth();
    const requireAuth = useRequireAuth();
    // Sample movie data - would come from API
    const movie = {
        id: params.id,
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        rating: 8.8,
        year: 2024,
        duration: '2h 46m',
        quality: '4K',
        genres: ['Sci-Fi', 'Adventure', 'Drama'],
        director: 'Denis Villeneuve',
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Josh Brolin'],
        type: 'movie', // 'movie' or 'series'
    };

    // Sample episodes data - always show at least episode 1
    const seasons = [
        {
            id: 's1',
            number: 1,
            name: 'Phần 1',
            episodes: movie.type !== 'series' 
                ? [
                    { id: 'e1', number: 1, title: 'The Beginning' },
                    { id: 'e2', number: 2, title: 'The Journey' },
                    { id: 'e3', number: 3, title: 'The Revelation' },
                    { id: 'e4', number: 4, title: 'The Challenge' },
                    { id: 'e5', number: 5, title: 'The Discovery' },
                    { id: 'e6', number: 6, title: 'The Truth' },
                    { id: 'e7', number: 7, title: 'The Battle' },
                    { id: 'e8', number: 8, title: 'The Victory' },
                    { id: 'e9', number: 9, title: 'The Aftermath' },
                    { id: 'e10', number: 10, title: 'The Future' },
                    { id: 'e11', number: 11, title: 'The Return' },
                    { id: 'e12', number: 12, title: 'The End' },
                ]
                : [
                    { id: 'e1', number: 1, title: movie.title },
                ],
        },
    ];

    // Sample comments data
    const comments = [
        { id: '1', user: 'Alex Chen', avatar: 'AC', text: 'Absolutely stunning visuals. Denis Villeneuve outdid himself.', time: '2 hours ago' },
        { id: '2', user: 'Sarah Miller', avatar: 'SM', text: 'The soundtrack is incredible. Hans Zimmer never disappoints.', time: '5 hours ago' },
        { id: '3', user: 'Mike Johnson', avatar: 'MJ', text: 'Best sci-fi film in years. Can\'t wait for Part Three.', time: '1 day ago' },
    ];

    // Sample top weekly movies data
    const topWeeklyMovies = [
        { id: '101', title: 'Tiếng Yêu Này, Anh Dịch Được Không?', subtitle: 'Can This Love Be Translated?', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', season: 'T13', episode: 'Phần 1 • Tập 12' },
        { id: '102', title: 'Yêu Hỉ', subtitle: 'Love Between Lines', posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', season: 'T13', episode: 'Phần 1 • Tập 20' },
        { id: '103', title: 'Ẩn Danh', subtitle: 'Taxi Driver', posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', season: 'T16', episode: 'Phần 3 • Tập 16' },
        { id: '104', title: 'Ngọc Minh Trà Cốt', subtitle: 'Glory', posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', season: 'T13', episode: 'Phần 1 • Tập 36' },
        { id: '105', title: 'Avatar: Lửa và Tro Tàn', subtitle: 'Avatar: Fire and Ash', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', season: 'T13', episode: '2025 • 3h 12m • CAM' },
        { id: '106', title: 'Cậu Bé Mất Tích', subtitle: 'Stranger Things', posterUrl: 'https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg', season: 'T16', episode: 'Phần 5 • Tập 8' },
    ];

    const similarMovies = [
        { id: '2', title: 'Dune', posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', rating: 8.0, year: 2021, quality: '4K' },
        { id: '3', title: 'Arrival', posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', rating: 7.9, year: 2016, quality: 'HD' },
        { id: '4', title: 'Blade Runner 2049', posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', rating: 8.0, year: 2017, quality: '4K' },
        { id: '5', title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.7, year: 2014, quality: '4K' },
        { id: '6', title: 'The Martian', posterUrl: 'https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg', rating: 8.0, year: 2015, quality: 'HD' },
        { id: '7', title: 'Sicario', posterUrl: 'https://image.tmdb.org/t/p/w500/8dp7M8MOkyK7DhnVVnjpIFvPKZ0.jpg', rating: 7.6, year: 2015, quality: 'HD' },
    ];

    const handleAddToList = () => {
        requireAuth(
            () => {
                // Add to list logic
                console.log('Adding to list...');
                toast.success('Đã thêm vào danh sách của bạn!');
            },
            'Vui lòng đăng nhập để lưu phim vào danh sách'
        );
    };

    const handleSubmitComment = (text: string) => {
        // Submit comment logic
        console.log('Submitting comment:', text);
        toast.success('Bình luận đã được đăng!');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Hero Section */}
            <div className="relative h-[50vh] lg:h-[60vh]">
                {/* Backdrop */}
                <div className="absolute inset-0">
                    <img
                        src={movie.backdropUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />

                {/* Back Button */}
                <Link
                    href="/movies"
                    className="absolute top-20 left-4 lg:left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
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

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                                    <Star className="w-4 h-4 fill-yellow-400" />
                                    {movie.rating}
                                </span>
                                <span className="flex items-center gap-1 text-gray-400 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    {movie.year}
                                </span>
                                <span className="flex items-center gap-1 text-gray-400 text-sm">
                                    <Clock className="w-4 h-4" />
                                    {movie.duration}
                                </span>
                                <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">
                                    {movie.quality}
                                </span>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-2xl">
                                {movie.description}
                            </p>

                            {/* CTA */}
                            <div className="flex gap-3 mb-6">
                                <Link
                                    href={`/watch/${movie.id}`}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition-colors"
                                >
                                    <Play className="w-5 h-5 fill-black" />
                                    <span>Play</span>
                                </Link>
                                <button 
                                    onClick={handleAddToList}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-700/50 text-white font-semibold text-sm rounded hover:bg-gray-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>My List</span>
                                </button>
                            </div>

                            {/* Credits */}
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-400">
                                    <span className="text-gray-500">Director:</span>{' '}
                                    <span className="text-white">{movie.director}</span>
                                </p>
                                <p className="text-gray-400">
                                    <span className="text-gray-500">Cast:</span>{' '}
                                    <span className="text-white">{movie.cast.join(', ')}</span>
                                </p>
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
                                    seasons={seasons}
                                    currentSeasonId="s1"
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
                                    {topWeeklyMovies.map((item, index) => (
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
                                                    <p className="text-gray-400 text-xs mb-1">
                                                        {item.subtitle}
                                                    </p>
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
                <div className="mt-12 pb-12">
                    <MovieRow
                        title="You May Also Like"
                        movies={similarMovies}
                    />
                </div>
            </div>
        </div>
    );
}
