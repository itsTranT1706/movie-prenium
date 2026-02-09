import Link from 'next/link';
import { Flame, Heart, Tag, MessageCircle, TrendingUp, TrendingDown, Minus, ThumbsUp, CornerDownRight } from 'lucide-react';

interface RankedItem {
    id: string;
    externalId: string;
    rank: number;
    title: string;
    posterUrl: string;
}

interface HotCategory {
    id: string;
    name: string;
    color: string;
}

interface Comment {
    id: string;
    username: string;
    avatar: string;
    content: string;
    movieTitle: string;
    movieId: string;
    moviePoster?: string | null;
    isVip?: boolean;
    likeCount?: number;

    parent?: {
        user: {
            name: string;
        };
    };
}

interface TrendingSectionProps {
    trendingItems: RankedItem[];
    favoriteItems: RankedItem[];
    hotCategories: HotCategory[];
    recentComments: Comment[];
    loading?: boolean;
}

export default function TrendingSection({
    trendingItems,
    favoriteItems,
    hotCategories,
    recentComments,
    loading = false,
}: TrendingSectionProps) {
    // Skeleton components
    const MovieSkeleton = () => (
        <div className="flex items-center gap-3 h-[72px] px-2 animate-pulse">
            <div className="w-5 h-5 bg-white/10 rounded" />
            <div className="w-5 h-4 bg-white/10 rounded" />
            <div className="w-10 h-14 bg-white/10 rounded" />
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded w-3/4" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
            </div>
        </div>
    );

    const CategorySkeleton = () => (
        <div className="flex items-center gap-3 h-[72px] px-2 animate-pulse">
            <div className="w-5 h-5 bg-white/10 rounded" />
            <div className="w-5 h-4 bg-white/10 rounded" />
            <div className="w-20 h-6 bg-white/10 rounded-full" />
        </div>
    );

    const CommentSkeleton = () => (
        <div className="flex gap-3 h-[72px] px-3 items-center bg-white/5 rounded-xl border border-white/5 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded w-1/3" />
                <div className="h-2 bg-white/10 rounded w-full" />
                <div className="h-2 bg-white/10 rounded w-1/2" />
            </div>
        </div>
    );

    // Helper to get simulated trend icon
    const getTrendIcon = (index: number) => {
        if (index === 1) return <TrendingUp className="w-4 h-4 text-lime-400" />;
        if (index === 2 || index === 3) return <TrendingDown className="w-4 h-4 text-pink-500" />;
        return <Minus className="w-4 h-4 text-gray-600" />;
    };

    return (
        <section className="py-4 lg:py-6 bg-[#0a0a0a]">
            {/* ... keeping simplified wrapper content ... */}
            <div className="w-full px-4 md:px-12 lg:px-16 2xl:px-12">
                {/* Top border divider */}
                <div className="border-t border-white/10 pt-4 mb-4" />

                {/* Mobile: Horizontal scroll - keeping as is for now, main edit is desktop */}
                <div className="lg:hidden -mx-4 md:-mx-12 px-4 md:px-12 overflow-x-auto scrollbar-hide">
                    {/* ... mobile code ... */}
                    <div className="flex gap-4 pb-2">
                        {/* Sôi Nổi Nhất */}
                        <div className="flex-shrink-0 w-[280px]">
                            <div className="flex items-center gap-2 mb-3">
                                <Flame className="w-4 h-4 text-orange-500" />
                                <h3 className="text-xs font-bold text-white uppercase">Sôi Nổi Nhất</h3>
                            </div>
                            <div className="space-y-1">
                                {trendingItems.slice(0, 5).map((item) => (
                                    <Link key={item.id} href={`/movie/${item.id}`} className="flex items-center gap-2 py-1 hover:bg-white/5 rounded transition-colors group">
                                        <span className="text-sm font-bold text-gray-500 w-4">{item.rank}</span>
                                        <span className="text-gray-600 text-xs">—</span>
                                        <img src={item.posterUrl} alt={item.title} className="w-8 h-11 rounded object-cover" />
                                        <span className="text-xs text-gray-300 group-hover:text-white line-clamp-2 flex-1">{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/movies/trending" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem toàn bộ</Link>
                        </div>

                        {/* Yêu Thích Nhất */}
                        <div className="flex-shrink-0 w-[280px]">
                            <div className="flex items-center gap-2 mb-3">
                                <Heart className="w-4 h-4 text-pink-500" />
                                <h3 className="text-xs font-bold text-white uppercase">Yêu Thích Nhất</h3>
                            </div>
                            <div className="space-y-1">
                                {favoriteItems.slice(0, 5).map((item) => (
                                    <Link key={item.id} href={`/movie/${item.id}`} className="flex items-center gap-2 py-1 hover:bg-white/5 rounded transition-colors group">
                                        <span className="text-sm font-bold text-gray-500 w-4">{item.rank}</span>
                                        <span className="text-gray-600 text-xs">—</span>
                                        <img src={item.posterUrl} alt={item.title} className="w-8 h-11 rounded object-cover" />
                                        <span className="text-xs text-gray-300 group-hover:text-white line-clamp-2 flex-1">{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/movies" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem toàn bộ</Link>
                        </div>

                        {/* Thể Loại Hot */}
                        <div className="flex-shrink-0 w-[280px]">
                            <div className="flex items-center gap-2 mb-3">
                                <Tag className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-xs font-bold text-white uppercase">Thể Loại Hot</h3>
                            </div>
                            <div className="space-y-0.5">
                                {hotCategories.slice(0, 5).map((category, index) => (
                                    <Link key={category.id} href={`/genre/${category.id}`} className="flex items-center gap-3 py-1 hover:bg-white/5 rounded transition-colors">
                                        <span className="text-xs font-bold text-gray-500 w-4 font-mono">{index + 1}.</span>
                                        <div className="w-4 flex justify-center">{getTrendIcon(index)}</div>
                                        <span className={`px-3 py-1 ${category.color} rounded-full text-[10px] font-medium text-white whitespace-nowrap shadow-lg`}>{category.name}</span>
                                    </Link>
                                ))}
                            </div>
                            <Link href="/movies" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem toàn bộ</Link>
                        </div>

                        {/* Bình Luận Mới */}
                        <div className="flex-shrink-0 w-[280px]">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageCircle className="w-4 h-4 text-blue-500" />
                                <h3 className="text-xs font-bold text-white uppercase">Bình Luận Mới</h3>
                            </div>
                            <div className="space-y-2">
                                {recentComments.slice(0, 5).map((comment) => (
                                    <div key={comment.id} className="flex gap-2 py-1 hover:bg-white/5 rounded transition-colors">
                                        <img src={comment.avatar} alt={comment.username} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-medium text-white">{comment.username}</span>
                                                {comment.isVip && <span className="text-[8px] px-1 bg-yellow-500/20 text-yellow-400 rounded">VIP</span>}
                                            </div>
                                            <p className="text-[10px] text-gray-400 line-clamp-1">{comment.content}</p>
                                            <Link href={`/movie/${comment.movieId}`} className="text-[9px] text-gray-500 hover:text-gray-400 truncate block">▸ {comment.movieTitle}</Link>
                                        </div>
                                        {comment.moviePoster && (
                                            <Link href={`/movie/${comment.movieId}`} className="flex-shrink-0">
                                                <img src={comment.moviePoster} alt={comment.movieTitle} className="w-8 h-11 rounded object-cover" />
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop: 4-column grid with vertical dividers */}
                <div className="hidden lg:grid grid-cols-4 divide-x divide-white/10">
                    {/* Sôi Nổi Nhất */}
                    <div className="pr-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <h3 className="text-xs font-bold text-white uppercase">Sôi Nổi Nhất</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <MovieSkeleton key={i} />)
                            ) : (
                                trendingItems.map((item, index) => (
                                    <Link key={item.id} href={`/movies/${item.externalId}`} className="flex items-center gap-3 h-[72px] px-2 hover:bg-white/5 rounded-lg transition-colors group">
                                        <span className="text-lg font-bold text-gray-500 w-5 font-mono">{item.rank}</span>
                                        <div className="w-5 flex justify-center">
                                            {getTrendIcon(index)}
                                        </div>
                                        <img src={item.posterUrl} alt={item.title} className="w-10 h-14 rounded shadow-md group-hover:shadow-white/10 transition-shadow object-cover" />
                                        <span className="text-xs font-medium text-gray-300 group-hover:text-white line-clamp-2 transition-colors">{item.title}</span>
                                    </Link>
                                ))
                            )}
                        </div>
                        <Link href="/movies/trending" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem toàn bộ</Link>
                    </div>

                    {/* Yêu Thích Nhất */}
                    <div className="px-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-4 h-4 text-pink-500" />
                            <h3 className="text-xs font-bold text-white uppercase">Yêu Thích Nhất</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <MovieSkeleton key={i} />)
                            ) : (
                                favoriteItems.map((item, index) => (
                                    <Link key={item.id} href={`/movies/${item.externalId}`} className="flex items-center gap-3 h-[72px] px-2 hover:bg-white/5 rounded-lg transition-colors group">
                                        <span className="text-lg font-bold text-gray-500 w-5 font-mono">{item.rank}</span>
                                        <div className="w-5 flex justify-center">
                                            {getTrendIcon(index)}
                                        </div>
                                        <img src={item.posterUrl} alt={item.title} className="w-10 h-14 rounded shadow-md group-hover:shadow-white/10 transition-shadow object-cover" />
                                        <span className="text-xs font-medium text-gray-300 group-hover:text-white line-clamp-2 transition-colors">{item.title}</span>
                                    </Link>
                                ))
                            )}
                        </div>
                        <Link href="/movies" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem toàn bộ</Link>
                    </div>

                    {/* Thể Loại Hot */}
                    <div className="px-5 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-xs font-bold text-white uppercase">Thể Loại Hot</h3>
                        </div>
                        <div className="flex-1 flex flex-col gap-2 mt-1">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <CategorySkeleton key={i} />)
                            ) : (
                                hotCategories.slice(0, 5).map((category, index) => (
                                    <Link
                                        key={category.id}
                                        href={`/genre/${category.id}`}
                                        className="flex items-center gap-3 h-[72px] px-2 hover:bg-white/5 rounded-lg transition-colors group"
                                    >
                                        <span className="text-lg font-bold text-gray-600 group-hover:text-gray-500 w-5 text-right font-mono">{index + 1}.</span>
                                        <div className="w-5 flex justify-center">
                                            {getTrendIcon(index)}
                                        </div>
                                        <span className={`px-4 py-2 ${category.color} rounded-full text-xs font-bold text-white shadow-md shadow-black/20 hover:scale-105 transition-transform duration-200`}>
                                            {category.name}
                                        </span>
                                    </Link>
                                ))
                            )}
                        </div>
                        <Link href="/movies" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem toàn bộ</Link>
                    </div>

                    {/* Bình Luận Mới */}
                    <div className="pl-5">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            <h3 className="text-xs font-bold text-white uppercase">Bình Luận Mới</h3>
                        </div>
                        <div className="flex flex-col gap-2 h-[392px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)
                            ) : (
                                recentComments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 h-[72px] px-3 items-center bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors flex-shrink-0">
                                        <img src={comment.avatar} alt={comment.username} className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-white/10" />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                                <span className="text-xs font-medium text-white">{comment.username}</span>
                                                {comment.isVip && <span className="text-[8px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded font-bold">VIP</span>}
                                                {comment.parent && (
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                        <CornerDownRight className="w-2.5 h-2.5" />
                                                        <span>Trả lời <span className="text-gray-400 font-medium">{comment.parent.user.name}</span></span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-300 line-clamp-1 mb-0.5 leading-normal">{comment.content}</p>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/movies/${comment.movieId}`} className="text-[9px] text-gray-500 hover:text-gray-300 truncate block transition-colors">via {comment.movieTitle}</Link>
                                                {comment.likeCount !== undefined && comment.likeCount > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="w-0.5 h-0.5 rounded-full bg-gray-600"></span>
                                                        <div className="flex items-center gap-0.5 text-[9px] text-gray-500">
                                                            <ThumbsUp className="w-2.5 h-2.5" />
                                                            <span className="font-medium">{comment.likeCount}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {comment.moviePoster && (
                                            <Link href={`/movies/${comment.movieId}`} className="flex-shrink-0 ml-auto self-center">
                                                <img src={comment.moviePoster} alt={comment.movieTitle} className="w-8 h-10 rounded shadow-sm hover:shadow-white/20 transition-all object-cover" />
                                            </Link>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
