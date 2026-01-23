'use client';

import Link from 'next/link';
import { Flame, Heart, Tag, MessageCircle } from 'lucide-react';

interface RankedItem {
    id: string;
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
    isVip?: boolean;
}

interface TrendingSectionProps {
    trendingItems: RankedItem[];
    favoriteItems: RankedItem[];
    hotCategories: HotCategory[];
    recentComments: Comment[];
}

export default function TrendingSection({
    trendingItems,
    favoriteItems,
    hotCategories,
    recentComments,
}: TrendingSectionProps) {
    // Don't render if no data
    if (!trendingItems?.length && !favoriteItems?.length && !hotCategories?.length && !recentComments?.length) {
        return null;
    }
    return (
        <section className="py-4 lg:py-6 bg-[#0a0a0a]">
            <div className="container">
                {/* Top border divider */}
                <div className="border-t border-white/10 pt-4 mb-4" />

                {/* 4-column grid with vertical dividers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
                    {/* Sôi Nổi Nhất */}
                    <div className="pr-0 lg:pr-5 pb-4 lg:pb-0">
                        <div className="flex items-center gap-2 mb-3">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <h3 className="text-xs font-bold text-white uppercase">Sôi Nổi Nhất</h3>
                        </div>
                        <div className="space-y-1">
                            {trendingItems.map((item) => (
                                <Link key={item.id} href={`/movie/${item.id}`} className="flex items-center gap-2 py-1 hover:bg-white/5 rounded transition-colors group">
                                    <span className="text-sm font-bold text-gray-500 w-4">{item.rank}</span>
                                    <span className="text-gray-600 text-xs">—</span>
                                    <img src={item.posterUrl} alt={item.title} className="w-8 h-11 rounded object-cover" />
                                    <span className="text-xs text-gray-300 group-hover:text-white line-clamp-2">{item.title}</span>
                                </Link>
                            ))}
                        </div>
                        <Link href="/movies/trending" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem toàn bộ</Link>
                    </div>

                    {/* Yêu Thích Nhất */}
                    <div className="px-0 lg:px-5 pb-4 lg:pb-0 border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
                        <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-4 h-4 text-pink-500" />
                            <h3 className="text-xs font-bold text-white uppercase">Yêu Thích Nhất</h3>
                        </div>
                        <div className="space-y-1">
                            {favoriteItems.map((item) => (
                                <Link key={item.id} href={`/movie/${item.id}`} className="flex items-center gap-2 py-1 hover:bg-white/5 rounded transition-colors group">
                                    <span className="text-sm font-bold text-gray-500 w-4">{item.rank}</span>
                                    <span className="text-gray-600 text-xs">—</span>
                                    <img src={item.posterUrl} alt={item.title} className="w-8 h-11 rounded object-cover" />
                                    <span className="text-xs text-gray-300 group-hover:text-white line-clamp-2">{item.title}</span>
                                </Link>
                            ))}
                        </div>
                        <Link href="/movies" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem toàn bộ</Link>
                    </div>

                    {/* Thể Loại Hot */}
                    <div className="px-0 lg:px-5 pb-4 lg:pb-0 border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-xs font-bold text-white uppercase">Thể Loại Hot</h3>
                        </div>
                        <div className="space-y-1">
                            {hotCategories.map((category, index) => (
                                <Link key={category.id} href={`/genre/${category.id}`} className="flex items-center gap-2 py-1.5 hover:bg-white/5 rounded transition-colors">
                                    <span className="text-sm font-bold text-gray-500 w-4">{index + 1}</span>
                                    <span className="text-gray-600 text-xs">—</span>
                                    <span className={`px-2 py-0.5 ${category.color} rounded-full text-[10px] font-medium text-white`}>{category.name}</span>
                                </Link>
                            ))}
                        </div>
                        <Link href="/movies" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem toàn bộ</Link>
                    </div>

                    {/* Bình Luận Mới */}
                    <div className="pl-0 lg:pl-5 border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            <h3 className="text-xs font-bold text-white uppercase">Bình Luận Mới</h3>
                        </div>
                        <div className="space-y-2">
                            {recentComments.map((comment) => (
                                <div key={comment.id} className="flex gap-2 py-1 hover:bg-white/5 rounded transition-colors">
                                    <img src={comment.avatar} alt={comment.username} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-medium text-white">{comment.username}</span>
                                            {comment.isVip && <span className="text-[8px] px-1 bg-yellow-500/20 text-yellow-400 rounded">VIP</span>}
                                        </div>
                                        <p className="text-[10px] text-gray-400 line-clamp-1">{comment.content}</p>
                                        <Link href={`/movie/${comment.id}`} className="text-[9px] text-gray-500 hover:text-gray-400 truncate block">▸ {comment.movieTitle}</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
