'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CountryMovie {
    id: string;
    title: string;
    subtitle?: string;
    backdropUrl: string;
    episodeCount?: number;
    rating?: number;
    gradientColor?: string;
}

interface CountryMovieRowProps {
    title: string;
    href?: string;
    movies?: CountryMovie[];
    gradientFrom?: string;
    gradientTo?: string;
}

// Default Korean Movies
const defaultKoreanMovies: CountryMovie[] = [
    {
        id: 'k1',
        title: 'Tên Trộm Dấu Yêu',
        subtitle: 'To My Beloved Thief',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        episodeCount: 6,
        rating: 4,
        gradientColor: 'from-pink-500/60'
    },
    {
        id: 'k2',
        title: 'Baby Đến Rồi!',
        subtitle: 'Positively Yours',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        episodeCount: 2,
        gradientColor: 'from-purple-500/60'
    },
    {
        id: 'k3',
        title: 'Thời Vàng Son',
        subtitle: 'Our Golden Days',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvez8tKL8rLj5Bjs.jpg',
        episodeCount: 47,
        rating: 46,
        gradientColor: 'from-teal-500/60'
    },
    {
        id: 'k4',
        title: 'Tay Đấm Bốc',
        subtitle: 'I Am Boxer',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        episodeCount: 9,
        gradientColor: 'from-rose-500/60'
    },
    {
        id: 'k5',
        title: 'Điều Tra Viên Hồng',
        subtitle: 'Undercover Miss Hong',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        episodeCount: 2,
        gradientColor: 'from-blue-500/60'
    },
    {
        id: 'k6',
        title: 'Điều Tra Viên Hồng',
        subtitle: 'Undercover Miss Hong',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        episodeCount: 2,
        gradientColor: 'from-blue-500/60'
    },
    {
        id: 'k7',
        title: 'Điều Tra Viên Hồng',
        subtitle: 'Undercover Miss Hong',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        episodeCount: 2,
        gradientColor: 'from-blue-500/60'
    },
    {
        id: 'k8',
        title: 'Điều Tra Viên Hồng',
        subtitle: 'Undercover Miss Hong',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        episodeCount: 2,
        gradientColor: 'from-blue-500/60'
    },
    {
        id: 'k9',
        title: 'Điều Tra Viên Hồng',
        subtitle: 'Undercover Miss Hong',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        episodeCount: 2,
        gradientColor: 'from-blue-500/60'
    },
    {
        id: 'k10',
        title: 'Điều Tra Viên Hồng',
        subtitle: 'Undercover Miss Hong',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        episodeCount: 2,
        gradientColor: 'from-blue-500/60'
    },
];

// Default Chinese Movies
const defaultChineseMovies: CountryMovie[] = [
    {
        id: 'c1',
        title: 'Khánh Niên',
        subtitle: 'Forever Young',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        episodeCount: 32,
        gradientColor: 'from-amber-500/60'
    },
    {
        id: 'c2',
        title: 'Vịnh Hoa Lệnh',
        subtitle: 'Glory in Shadows',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        episodeCount: 21,
        gradientColor: 'from-pink-500/60'
    },
    {
        id: 'c3',
        title: 'Chuyện Lớn Nơi Thành Phố Nhỏ',
        subtitle: 'The Dream Maker',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7LsyBnq43j2k.jpg',
        episodeCount: 17,
        gradientColor: 'from-violet-500/60'
    },
    {
        id: 'c4',
        title: 'Yết Hi',
        subtitle: 'Love Between Lines',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
        episodeCount: 28,
        rating: 20,
        gradientColor: 'from-rose-500/60'
    },
    {
        id: 'c5',
        title: 'Mùa Đông Phủ Đầy Tuyết Thu',
        subtitle: 'Loving Strangers',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg',
        gradientColor: 'from-cyan-500/60'
    },
];

const defaultUSUKMovies: CountryMovie[] = [
    {
        id: 'u1',
        title: 'Thế Giới Ngầm',
        subtitle: 'Peaky Blinders',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/ilfJ2L1x6Yv6dD5m9H7ZL0PjFZK.jpg',
        episodeCount: 36,
        gradientColor: 'from-red-600/60'
    },
    {
        id: 'u2',
        title: 'Nhà Giấy',
        subtitle: 'Money Heist',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
        episodeCount: 41,
        gradientColor: 'from-rose-600/60'
    },
    {
        id: 'u3',
        title: 'Trò Chơi Vương Quyền',
        subtitle: 'Game of Thrones',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
        episodeCount: 73,
        rating: 18,
        gradientColor: 'from-indigo-600/60'
    },
    {
        id: 'u4',
        title: 'Kẻ Săn Tội Ác',
        subtitle: 'Mindhunter',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/fbKE87mojpIETWepSbD5Qt741fp.jpg',
        episodeCount: 19,
        gradientColor: 'from-emerald-600/60'
    },
    {
        id: 'u5',
        title: 'Những Điều Kỳ Lạ',
        subtitle: 'Stranger Things',
        backdropUrl: 'https://image.tmdb.org/t/p/w500/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
        episodeCount: 34,
        gradientColor: 'from-fuchsia-600/60'
    }
];

/**
 * Country Movie Row Component
 * Horizontal scrolling movie cards with landscape thumbnails
 * Similar to streaming platforms like iQIYI/Viki style
 */
export default function CountryMovieRow({
    title,
    href = '/movies',
    movies,
    gradientFrom = 'from-pink-500/30',
    gradientTo = 'to-purple-500/30',
}: CountryMovieRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const displayMovies = movies || (title.toLowerCase().includes('hàn') ? defaultKoreanMovies : defaultChineseMovies);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 320;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section className="py-3 lg:py-4">
            <div className="container">
                {/* Rounded container wrapper */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 lg:p-5">
                    {/* Flex row: Title left, Carousel right */}
                    <div className="flex gap-4 lg:gap-6">
                        {/* Left: Title Section */}
                        <div className="flex-shrink-0 w-24 lg:w-32">
                            <h2 className="text-sm lg:text-base font-bold text-white leading-tight mb-1">
                                {title}
                            </h2>
                            <Link
                                href={href}
                                className="text-[10px] lg:text-[11px] text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-0.5"
                            >
                                Xem toàn bộ <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Right: Scrollable Cards */}
                        <div className="flex-1 min-w-0 relative group">
                            {/* Left Arrow */}
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            {/* Cards */}
                            <div
                                ref={scrollRef}
                                className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
                            >
                                {displayMovies.map((movie) => (
                                    <Link
                                        key={movie.id}
                                        href={`/movie/${movie.id}`}
                                        className="country-movie-card group/card flex-shrink-0"
                                    >
                                        {/* Card Container */}
                                        <div className="relative w-36 lg:w-44 aspect-[16/10] rounded-lg overflow-hidden">
                                            {/* Background Image */}
                                            <img
                                                src={movie.backdropUrl}
                                                alt={movie.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                                loading="lazy"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-t ${movie.gradientColor || gradientFrom} via-transparent to-black/40 opacity-60 group-hover/card:opacity-40 transition-opacity`} />

                                            {/* Badges */}
                                            <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                                                {movie.episodeCount && (
                                                    <span className="px-1 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] font-medium text-white">
                                                        EP.{movie.episodeCount}
                                                    </span>
                                                )}
                                                {movie.rating && (
                                                    <span className="px-1 py-0.5 bg-emerald-500/80 backdrop-blur-sm rounded text-[9px] font-bold text-white">
                                                        TM.{movie.rating}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Play indicator on hover */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[7px] border-y-transparent ml-1" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title Section */}
                                        <div className="mt-1.5 px-0.5">
                                            <h3 className="text-xs font-medium text-white line-clamp-1 group-hover/card:text-gray-200 transition-colors">
                                                {movie.title}
                                            </h3>
                                            {movie.subtitle && (
                                                <p className="text-[10px] text-gray-500 line-clamp-1">
                                                    {movie.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Gradient presets for title text - automatically cycles through
const TITLE_GRADIENTS = [
    'from-purple-400 via-pink-400 to-purple-400',
    'from-cyan-400 via-blue-400 to-cyan-400',
    'from-amber-400 via-orange-400 to-amber-400',
    'from-emerald-400 via-teal-400 to-emerald-400',
    'from-rose-400 via-red-400 to-rose-400',
    'from-indigo-400 via-violet-400 to-indigo-400',
];

/**
 * Inner row component without container wrapper
 * Used inside CountryMoviesSection
 */
function CountryMovieRowInner({
    title,
    href = '/movies',
    movies,
    gradientFrom = 'from-pink-500/30',
    titleGradient = TITLE_GRADIENTS[0],
}: Omit<CountryMovieRowProps, 'gradientTo'> & { titleGradient?: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const displayMovies = movies || (title.toLowerCase().includes('hàn') ? defaultKoreanMovies : defaultChineseMovies);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 320;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="flex gap-4 lg:gap-6 items-center">
            {/* Left: Title Section - centered vertically */}
            <div className="flex-shrink-0 w-28 lg:w-36 flex flex-col justify-center">
                <h2 className={`text-lg lg:text-xl font-bold leading-tight mb-2 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>
                    {title}
                </h2>
                <Link
                    href={href}
                    className="text-[10px] lg:text-[11px] text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-0.5"
                >
                    Xem toàn bộ <ChevronRight className="w-3 h-3" />
                </Link>
            </div>

            {/* Right: Scrollable Cards */}
            <div className="flex-1 min-w-0 relative group overflow-hidden">
                {/* Fade mask on right edge to hide partial cards */}
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-[5] pointer-events-none" />

                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                {/* Cards */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pr-16"
                >
                    {displayMovies.map((movie) => (
                        <Link
                            key={movie.id}
                            href={`/movie/${movie.id}`}
                            className="country-movie-card group/card flex-shrink-0"
                        >
                            <div className="relative w-44 lg:w-56 aspect-[16/10] rounded-lg overflow-hidden">
                                <img
                                    src={movie.backdropUrl}
                                    alt={movie.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                    loading="lazy"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${movie.gradientColor || gradientFrom} via-transparent to-black/40 opacity-60 group-hover/card:opacity-40 transition-opacity`} />
                                <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                                    {movie.episodeCount && (
                                        <span className="px-1 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] font-medium text-white">
                                            EP.{movie.episodeCount}
                                        </span>
                                    )}
                                    {movie.rating && (
                                        <span className="px-1 py-0.5 bg-emerald-500/80 backdrop-blur-sm rounded text-[9px] font-bold text-white">
                                            TM.{movie.rating}
                                        </span>
                                    )}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[7px] border-y-transparent ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-1.5 px-0.5">
                                <h3 className="text-xs font-medium text-white line-clamp-1 group-hover/card:text-gray-200 transition-colors">
                                    {movie.title}
                                </h3>
                                {movie.subtitle && (
                                    <p className="text-[10px] text-gray-500 line-clamp-1">
                                        {movie.subtitle}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Pre-configured Korean Movies Row
 */
export function KoreanMoviesRow() {
    return (
        <CountryMovieRow
            title="Phim Hàn Quốc mới"
            href="/movies/korean"
            movies={defaultKoreanMovies}
        />
    );
}

/**
 * Pre-configured Chinese Movies Row
 */
export function ChineseMoviesRow() {
    return (
        <CountryMovieRow
            title="Phim Trung Quốc mới"
            href="/movies/chinese"
            movies={defaultChineseMovies}
        />
    );
}

/**
 * Combined Country Movies Section - Both Korean and Chinese in ONE container
 */
export function CountryMoviesSection() {
    return (
        <section className="py-3 lg:py-4">
            <div className="container">
                {/* Single rounded container for both rows */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 lg:p-5 space-y-5">
                    {/* Korean Movies Row */}
                    <CountryMovieRowInner
                        title="Phim Hàn Quốc mới"
                        href="/movies/korean"
                        movies={defaultKoreanMovies}
                        titleGradient={TITLE_GRADIENTS[0]}
                    />

                    {/* Divider */}
                    <div className="border-t border-white/10" />

                    {/* Chinese Movies Row */}
                    <CountryMovieRowInner
                        title="Phim Trung Quốc mới"
                        href="/movies/chinese"
                        movies={defaultChineseMovies}
                        titleGradient={TITLE_GRADIENTS[4]}
                    />

                    {/* Divider */}
                    <div className="border-t border-white/10" />

                    {/* US UK Movies Row */}
                    <CountryMovieRowInner
                        title="Phim Hoa Kỳ - Anh Quốc mới"
                        href="/movies/us-uk"
                        movies={defaultUSUKMovies}
                        titleGradient={TITLE_GRADIENTS[3]}
                    />
                </div>
            </div>
        </section>
    );
}
