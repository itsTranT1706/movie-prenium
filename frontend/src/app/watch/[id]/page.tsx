'use client';

import Link from 'next/link';
import { 
    Heart,
    Plus,
    Star,
    Calendar,
    Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { EpisodeSelector, CommentSection } from '@/components/features';
import { useAuth, useRequireAuth } from '@/hooks';

export default function WatchPage({ params }: { params: { id: string } }) {
    const { user } = useAuth();
    const requireAuth = useRequireAuth();

    // Sample movie data
    const movie = {
        id: params.id,
        title: 'Ranh Giới Tội Ác',
        subtitle: 'The Rip',
        videoUrl: 'https://embed11.streamc.xyz/embed.php?hash=162622c76599d49fbc5cbcb9c3e6b5c3',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        description: 'Lòng tham gạn rỉ khi đối diện với những phức tạp của hàng triệu đô la tiền mặt bất thường mới đó, chỉ có một người - và một thứ có thể xây dựng nghề cá.',
        rating: 8.0,
        year: 2024,
        duration: '1h 52m',
        quality: '4K',
        genres: ['Hành Động', 'Cao Cấp', 'Kinh Dị', 'Hành Động', 'Tâm Lý', 'Phiêu Lưu'],
        director: 'Denis Villeneuve',
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
        type: 'series',
    };

    // Sample seasons data
    const seasons = [
        {
            id: 's1',
            number: 1,
            name: 'Phần 1',
            episodes: [
                { id: 'e1', number: 1, title: 'Episode 1' },
                { id: 'e2', number: 2, title: 'Episode 2' },
                { id: 'e3', number: 3, title: 'Episode 3' },
                { id: 'e4', number: 4, title: 'Episode 4' },
                { id: 'e5', number: 5, title: 'Episode 5' },
                { id: 'e6', number: 6, title: 'Episode 6' },
            ],
        },
    ];

    // Sample comments
    const comments = [
        { id: '1', user: 'Alex Chen', avatar: 'AC', text: 'Phim hay quá!', time: '2 giờ trước' },
        { id: '2', user: 'Sarah Miller', avatar: 'SM', text: 'Cảnh quay đẹp tuyệt vời.', time: '5 giờ trước' },
        { id: '3', user: 'Mike Johnson', avatar: 'MJ', text: 'Đáng xem!', time: '1 ngày trước' },
    ];

    // Sample top weekly movies
    const topWeeklyMovies = [
        { id: '101', title: 'Tiếng Yêu Này, Anh Dịch Được Không?', subtitle: 'Can This Love Be Translated?', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', season: 'T13', episode: 'Phần 1 • Tập 12' },
        { id: '102', title: 'Yêu Hỉ', subtitle: 'Love Between Lines', posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', season: 'T13', episode: 'Phần 1 • Tập 20' },
        { id: '103', title: 'Ẩn Danh', subtitle: 'Taxi Driver', posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', season: 'T16', episode: 'Phần 3 • Tập 16' },
        { id: '104', title: 'Ngọc Minh Trà Cốt', subtitle: 'Glory', posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', season: 'T13', episode: 'Phần 1 • Tập 36' },
        { id: '105', title: 'Avatar: Lửa và Tro Tàn', subtitle: 'Avatar: Fire and Ash', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', season: 'T13', episode: '2025 • 3h 12m' },
    ];

    const handleAddToFavorites = () => {
        requireAuth(
            () => {
                console.log('Adding to favorites...');
                toast.success('Đã thêm vào yêu thích!');
            },
            'Vui lòng đăng nhập để thêm vào yêu thích'
        );
    };

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
        <div className="min-h-screen bg-[#0a0a0a] pt-16">
            {/* Back Button */}
            <div className="w-full flex justify-center px-4">
                <div className="w-full max-w-7xl py-4">
                    <Link
                    href={`/movies/${movie.id}`}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Xem phim {movie.title}</span>
                </Link>
                </div>
            </div>

            {/* Video Player Section */}
            <div className="relative bg-[#0a0a0a]">
                <div className="w-full flex justify-center px-4">
                    <div className="w-full max-w-7xl">
                        {/* Video Title Above Player */}
                        <div className="mb-3">
                            <h1 className="text-white text-lg font-semibold">{movie.title}</h1>
                        </div>
                        
                        <div className="relative aspect-video bg-black rounded overflow-hidden">
                            {/* Iframe Video Player */}
                            <iframe
                                src={movie.videoUrl}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={movie.title}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full flex justify-center px-4">
                <div className="w-full max-w-7xl py-6">
                {/* Movie Info */}
                <div className="mb-6">
                    <div className="flex gap-6 mb-4">
                        {/* Poster */}
                        <div className="hidden lg:block flex-shrink-0 w-32">
                            <img
                                src={movie.posterUrl || 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg'}
                                alt={movie.title}
                                className="w-full rounded"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl lg:text-3xl font-black text-white mb-2">
                                {movie.title}
                            </h1>
                            <p className="text-gray-400 text-sm mb-3">{movie.subtitle}</p>

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
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {movie.description}
                            </p>

                            {/* Additional Info */}
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-400">
                                    <span className="text-gray-500">Đạo diễn:</span>{' '}
                                    <span className="text-white">{movie.director}</span>
                                </p>
                                <p className="text-gray-400">
                                    <span className="text-gray-500">Diễn viên:</span>{' '}
                                    <span className="text-white">{movie.cast.join(', ')}</span>
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex-shrink-0 flex gap-2">
                            <button 
                                onClick={handleAddToFavorites}
                                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                            >
                                <Heart className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleAddToList}
                                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Episodes & Comments + Top Movies Section */}
                <div className="border-t border-white/10 pt-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: Episodes & Comments */}
                        <div className="flex-1 min-w-0">
                            {/* Episodes Section */}
                            <div className="mb-8">
                                <EpisodeSelector
                                    movieId={movie.id}
                                    seasons={seasons}
                                    currentSeasonId="s1"
                                    currentEpisodeId="e1"
                                    showSubtitleToggle={false}
                                    showAutoPlay={false}
                                    basePath="watch"
                                />
                            </div>

                            {/* Comments Section */}
                            <div className="border-t border-white/10 pt-8">
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
            </div>
        </div>
    );
}
