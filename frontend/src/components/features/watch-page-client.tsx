'use client';

import Link from 'next/link';
import { Heart, Plus, Star, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { EpisodeSelector, CommentSection } from '@/components/features';
import { useAuth, useRequireAuth } from '@/hooks';

interface WatchPageClientProps {
    movie: any;
    seasons: any[];
    comments: any[];
    topWeeklyMovies: any[];
}

export function WatchPageClient({ movie, seasons, comments, topWeeklyMovies }: WatchPageClientProps) {
    const { user } = useAuth();
    const requireAuth = useRequireAuth();

    const videoUrl = movie.sources?.[0]?.episodes?.[0]?.embedUrl || 
                     'https://embed11.streamc.xyz/embed.php?hash=162622c76599d49fbc5cbcb9c3e6b5c3';

    const handleAddToFavorites = () => {
        requireAuth(() => {
            toast.success('Đã thêm vào yêu thích!');
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
        <div className="min-h-screen bg-[#0a0a0a] pt-16">
            <div className="w-full flex justify-center px-4">
                <div className="w-full max-w-7xl py-4">
                    <Link href={`/movies/${movie.externalId || movie.id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm">Xem phim {movie.title}</span>
                    </Link>
                </div>
            </div>

            <div className="relative bg-[#0a0a0a]">
                <div className="w-full flex justify-center px-4">
                    <div className="w-full max-w-7xl">
                        <div className="mb-3">
                            <h1 className="text-white text-lg font-semibold">{movie.title}</h1>
                            {movie.originalTitle && movie.originalTitle !== movie.title && (
                                <p className="text-gray-400 text-sm">{movie.originalTitle}</p>
                            )}
                        </div>
                        
                        <div className="relative aspect-video bg-black rounded overflow-hidden">
                            <iframe src={videoUrl} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={movie.title}></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center px-4">
                <div className="w-full max-w-7xl py-6">
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
                                        <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                                            <Star className="w-4 h-4 fill-yellow-400" />{movie.rating.toFixed(1)}
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
                                </div>

                                {movie.genres && movie.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {movie.genres.map((genre: string) => (
                                            <span key={genre} className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">{genre}</span>
                                        ))}
                                    </div>
                                )}

                                {movie.description && <p className="text-gray-300 text-sm leading-relaxed mb-4">{movie.description}</p>}
                            </div>

                            <div className="flex-shrink-0 flex gap-2">
                                <button onClick={handleAddToFavorites} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button onClick={handleAddToList} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1 min-w-0">
                                <div className="mb-8">
                                    <EpisodeSelector movieId={movie.id} seasons={seasons} currentSeasonId="s1" currentEpisodeId="e1" showSubtitleToggle={false} showAutoPlay={false} basePath="watch" />
                                </div>
                                <div className="border-t border-white/10 pt-8">
                                    <CommentSection movieId={movie.id} comments={comments} onSubmitComment={handleSubmitComment} />
                                </div>
                            </div>

                            <div className="w-full lg:w-80 flex-shrink-0 lg:pl-8 lg:border-l lg:border-white/10">
                                <h2 className="text-xl font-bold text-white mb-6">Top phim tuần này</h2>
                                <div className="space-y-0">
                                    {topWeeklyMovies.map((item: any, index: number) => (
                                        <div key={item.id}>
                                            <Link href={`/movies/${item.id}`} className="flex gap-3 py-3 hover:bg-white/5 transition-colors group">
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
                                            </Link>
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
    );
}
