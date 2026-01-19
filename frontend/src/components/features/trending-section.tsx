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
    trendingItems?: RankedItem[];
    favoriteItems?: RankedItem[];
    hotCategories?: HotCategory[];
    recentComments?: Comment[];
}

const defaultTrending: RankedItem[] = [
    { id: '1', rank: 1, title: 'Tiếng Yêu Này, Anh Dịch Được Không?', posterUrl: 'https://image.tmdb.org/t/p/w92/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg' },
    { id: '2', rank: 2, title: 'Vết Hí', posterUrl: 'https://image.tmdb.org/t/p/w92/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
    { id: '3', rank: 3, title: 'Thâm Phẩm Trùng Sinh', posterUrl: 'https://image.tmdb.org/t/p/w92/74xTEgt7R36Fvez8tKL8rLj5Bjs.jpg' },
    { id: '4', rank: 4, title: 'Ngọc Minh Trà Cốt', posterUrl: 'https://image.tmdb.org/t/p/w92/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
    { id: '5', rank: 5, title: 'Cậu Bé Mất Tích', posterUrl: 'https://image.tmdb.org/t/p/w92/62HCnUTziyWcpDaBO2i1DX17ljH.jpg' },
];

const defaultFavorites: RankedItem[] = [
    { id: '1', rank: 1, title: 'Tiếng Yêu Này, Anh Dịch Được Không?', posterUrl: 'https://image.tmdb.org/t/p/w92/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg' },
    { id: '2', rank: 2, title: 'Từ Hôm Nay, Tôi Là Con Người', posterUrl: 'https://image.tmdb.org/t/p/w92/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
    { id: '3', rank: 3, title: 'Vết Hí', posterUrl: 'https://image.tmdb.org/t/p/w92/74xTEgt7R36Fvez8tKL8rLj5Bjs.jpg' },
    { id: '4', rank: 4, title: 'Điều Tra Viên Hồng', posterUrl: 'https://image.tmdb.org/t/p/w92/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
    { id: '5', rank: 5, title: 'Baby Đến Rồi!', posterUrl: 'https://image.tmdb.org/t/p/w92/62HCnUTziyWcpDaBO2i1DX17ljH.jpg' },
];

const defaultCategories: HotCategory[] = [
    { id: '1', name: 'Chinh Kịch', color: 'bg-emerald-500' },
    { id: '2', name: 'Lãng Mạn', color: 'bg-pink-500' },
    { id: '3', name: 'Tình Cảm', color: 'bg-rose-500' },
    { id: '4', name: 'Tâm Lý', color: 'bg-amber-500' },
    { id: '5', name: 'Hài', color: 'bg-purple-500' },
];

const defaultComments: Comment[] = [
    { id: '1', username: 'Samuel', avatar: 'https://i.pravatar.cc/40?img=1', content: 'Phim hay với nội xinh quá', movieTitle: 'Tiếng Yêu Này, Anh Dịch Được Không?', isVip: true },
    { id: '2', username: 'NamPhuTanNhan™', avatar: 'https://i.pravatar.cc/40?img=2', content: '6.52 Còn bé nó cười còn tình đi hơn thằng anh...=))', movieTitle: 'Ngã Làng Ma' },
    { id: '3', username: 'ThienTuan', avatar: 'https://i.pravatar.cc/40?img=3', content: '2 ci 2, mình lỡ dịch phim nì thì mọi có thể dịch có lầm xíu dc hong', movieTitle: 'Tiền Trường Siêu Nhiên 2' },
    { id: '4', username: 'YuXun', avatar: 'https://i.pravatar.cc/40?img=4', content: 'j mà tập 11 mới yêu nhau 2 😌', movieTitle: 'Tiếng Yêu Này, Anh Dịch Được Không?', isVip: true },
];

export default function TrendingSection({
    trendingItems = defaultTrending,
    favoriteItems = defaultFavorites,
    hotCategories = defaultCategories,
    recentComments = defaultComments,
}: TrendingSectionProps) {
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
                        <Link href="/trending" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem thêm</Link>
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
                        <Link href="/favorites" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem thêm</Link>
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
                        <Link href="/genres" className="text-[10px] text-gray-500 hover:text-gray-400 mt-2 block">Xem thêm</Link>
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
