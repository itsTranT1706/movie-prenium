'use client';

import Link from 'next/link';
import {
    Flame,
    Laugh,
    Ghost,
    Heart,
    Rocket,
    Film,
    Skull,
    Theater,
    ChevronRight
} from 'lucide-react';

interface Genre {
    id: string;
    name: string;
    count: number;
    gradient: string;
    icon: React.ReactNode;
}

interface GenreCardGridProps {
    genres?: Genre[];
}

/**
 * Genre Card Grid Component
 * - Compact, tight layout
 * - Cinema-style immersive design
 * - Shows only 6 featured genres on homepage
 */
export default function GenreCardGrid({ genres, showAll = false }: GenreCardGridProps & { showAll?: boolean }) {
    const defaultGenres: Genre[] = [
        { id: 'hanh-dong', name: 'Hành Động', count: 423, gradient: 'from-red-600 to-orange-600', icon: <Flame className="w-6 h-6" /> },
        { id: 'hai-huoc', name: 'Hài Hước', count: 312, gradient: 'from-yellow-500 to-orange-400', icon: <Laugh className="w-6 h-6" /> },
        { id: 'kinh-di', name: 'Kinh Dị', count: 198, gradient: 'from-gray-800 to-red-900', icon: <Ghost className="w-6 h-6" /> },
        { id: 'tinh-cam', name: 'Tình Cảm', count: 267, gradient: 'from-pink-500 to-rose-500', icon: <Heart className="w-6 h-6" /> },
        { id: 'vien-tuong', name: 'Viễn Tưởng', count: 156, gradient: 'from-blue-600 to-cyan-500', icon: <Rocket className="w-6 h-6" /> },
        { id: 'phieu-luu', name: 'Phiêu Lưu', count: 534, gradient: 'from-purple-600 to-pink-500', icon: <Film className="w-6 h-6" /> },
        { id: 'tam-ly', name: 'Tâm Lý', count: 245, gradient: 'from-slate-700 to-slate-600', icon: <Skull className="w-6 h-6" /> },
        { id: 'chinh-kich', name: 'Chính Kịch', count: 389, gradient: 'from-indigo-600 to-purple-600', icon: <Theater className="w-6 h-6" /> },
        { id: 'co-trang', name: 'Cổ Trang', count: 178, gradient: 'from-amber-600 to-yellow-600', icon: <Theater className="w-6 h-6" /> },
        { id: 'chien-tranh', name: 'Chiến Tranh', count: 134, gradient: 'from-gray-700 to-gray-900', icon: <Flame className="w-6 h-6" /> },
        { id: 'tai-lieu', name: 'Tài Liệu', count: 89, gradient: 'from-green-600 to-teal-600', icon: <Film className="w-6 h-6" /> },
        { id: 'bi-an', name: 'Bí Ẩn', count: 201, gradient: 'from-purple-800 to-indigo-900', icon: <Ghost className="w-6 h-6" /> },
        { id: 'the-thao', name: 'Thể Thao', count: 112, gradient: 'from-orange-600 to-red-600', icon: <Flame className="w-6 h-6" /> },
        { id: 'am-nhac', name: 'Âm Nhạc', count: 145, gradient: 'from-pink-600 to-purple-600', icon: <Heart className="w-6 h-6" /> },
        { id: 'gia-dinh', name: 'Gia Đình', count: 223, gradient: 'from-blue-500 to-cyan-500', icon: <Heart className="w-6 h-6" /> },
        { id: 'hoc-duong', name: 'Học Đường', count: 167, gradient: 'from-teal-600 to-green-600', icon: <Film className="w-6 h-6" /> },
        { id: 'hinh-su', name: 'Hình Sự', count: 189, gradient: 'from-red-800 to-gray-900', icon: <Skull className="w-6 h-6" /> },
        { id: 'vo-thuat', name: 'Võ Thuật', count: 156, gradient: 'from-orange-700 to-red-700', icon: <Flame className="w-6 h-6" /> },
        { id: 'khoa-hoc', name: 'Khoa Học', count: 98, gradient: 'from-cyan-600 to-blue-700', icon: <Rocket className="w-6 h-6" /> },
        { id: 'than-thoai', name: 'Thần Thoại', count: 134, gradient: 'from-purple-700 to-pink-700', icon: <Theater className="w-6 h-6" /> },
        { id: 'kinh-dien', name: 'Kinh Điển', count: 267, gradient: 'from-amber-700 to-orange-700', icon: <Film className="w-6 h-6" /> },
    ];

    const allGenres = genres || defaultGenres;
    // Show only 6 genres on homepage, all on genres page
    const displayGenres = showAll ? allGenres : allGenres.slice(0, 6);

    return (
        <section className="relative pt-6 lg:pt-8 pb-4 lg:pb-5">
            <div className="container">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 md:mb-3">
                    <h2 className="text-xl md:text-lg lg:text-xl font-bold text-white">
                        {showAll ? 'Tất Cả Thể Loại' : 'Thể Loại'}
                    </h2>
                    {!showAll && (
                        <Link
                            href="/genres"
                            className="text-sm md:text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <span>Xem tất cả</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {/* Mobile: Horizontal Scroll (only on homepage) */}
                {!showAll && (
                    <div className="md:hidden -mx-4">
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 snap-x snap-mandatory">
                            {displayGenres.map((genre) => (
                                <GenreCard key={genre.id} genre={genre} mobile />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tablet: Grid 3 columns */}
                {!showAll && (
                    <div className="hidden md:grid lg:hidden grid-cols-3 gap-3">
                        {displayGenres.map((genre) => (
                            <GenreCard key={genre.id} genre={genre} />
                        ))}
                    </div>
                )}

                {/* Desktop: Grid - compact like original */}
                <div className={`hidden lg:grid gap-3 ${showAll ? 'grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6' : 'grid-cols-3 xl:grid-cols-6'}`}>
                    {displayGenres.map((genre) => (
                        <GenreCard key={genre.id} genre={genre} />
                    ))}
                </div>

                {/* Mobile/Tablet: Grid (only on all genres page) */}
                {showAll && (
                    <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-3">
                        {displayGenres.map((genre) => (
                            <GenreCard key={genre.id} genre={genre} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function GenreCard({ genre, mobile = false }: { genre: Genre; mobile?: boolean }) {
    return (
        <Link
            href={`/genre/${genre.id}`}
            className={`group ${mobile ? 'flex-shrink-0 w-[140px] snap-start' : 'w-auto'}`}
        >
            <div className={`
                relative overflow-hidden rounded-lg
                ${mobile ? 'p-5 h-[120px]' : 'p-4'}
                bg-gradient-to-br ${genre.gradient}
                transition-all duration-200
                group-hover:scale-[1.03] group-hover:shadow-lg
                group-active:scale-[0.98]
                ${mobile ? 'flex flex-col justify-between' : ''}
            `}>
                {/* Icon */}
                <div className={`text-white/50 group-hover:text-white/70 transition-colors ${mobile ? '' : 'mb-2'}`}>
                    {genre.icon}
                </div>

                {/* Content */}
                <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">
                        {genre.name}
                    </h3>
                    <p className="text-[10px] text-white/70">
                        {genre.count} phim
                    </p>
                </div>
            </div>
        </Link>
    );
}
