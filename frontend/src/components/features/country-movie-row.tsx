'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HoverPreviewCard } from '@/components/ui';

interface CountryMovie {
    id: string;
    externalId?: string;
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
    movies: CountryMovie[];
    gradientFrom?: string;
    titleGradient?: string;
}

// Gradient presets for title text
const TITLE_GRADIENTS = [
    'from-purple-400 via-pink-400 to-purple-400',
    'from-cyan-400 via-blue-400 to-cyan-400',
    'from-amber-400 via-orange-400 to-amber-400',
    'from-emerald-400 via-teal-400 to-emerald-400',
    'from-rose-400 via-red-400 to-rose-400',
    'from-indigo-400 via-violet-400 to-indigo-400',
];

/**
 * Country Movie Row Component (Inner)
 * Used inside CountryMoviesSection
 */
function CountryMovieRow({
    title,
    href = '/movies',
    movies,
    gradientFrom = 'from-pink-500/30',
    titleGradient = TITLE_GRADIENTS[0],
}: CountryMovieRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 320;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (!movies.length) return null;

    return (
        <div className="flex gap-4 lg:gap-6 items-center">
            {/* Left: Title Section */}
            <div className="flex-shrink-0 w-28 lg:w-36 flex flex-col justify-center">
                <h2 className={`text-xl lg:text-2xl xl:text-3xl font-bold leading-tight mb-2 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>
                    {title}
                </h2>
                <Link
                    href={href}
                    className="text-xs lg:text-sm text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-0.5"
                >
                    Xem toàn bộ <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                </Link>
            </div>

            {/* Right: Scrollable Cards */}
            <div className="flex-1 min-w-0 relative group overflow-hidden">
                {/* Fade mask on right edge */}
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
                    {movies.map((movie) => (
                        <HoverPreviewCard
                            key={movie.id}
                            movie={{
                                id: movie.id,
                                externalId: movie.externalId,
                                title: movie.title,
                                subtitle: movie.subtitle,
                                backdropUrl: movie.backdropUrl,
                                posterUrl: movie.backdropUrl,
                            }}
                            delay={600}
                        >
                            <Link
                                href={`/movies/${movie.externalId || movie.id}`}
                                className="country-movie-card group/card flex-shrink-0 block"
                            >
                                <div className="relative w-52 lg:w-64 xl:w-72 aspect-[16/10] rounded-lg overflow-hidden">
                                    <img
                                        src={movie.backdropUrl}
                                        alt={movie.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                        loading="lazy"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${movie.gradientColor || gradientFrom} via-transparent to-black/40 opacity-60 group-hover/card:opacity-40 transition-opacity`} />
                                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                                        {movie.episodeCount && (
                                            <span className="px-1.5 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] lg:text-xs font-medium text-white">
                                                EP.{movie.episodeCount}
                                            </span>
                                        )}
                                        {movie.rating && (
                                            <span className="px-1.5 py-1 bg-emerald-500/80 backdrop-blur-sm rounded text-[10px] lg:text-xs font-bold text-white">
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
                                    <h3 className="text-sm lg:text-base font-medium text-white line-clamp-1 group-hover/card:text-gray-200 transition-colors">
                                        {movie.title}
                                    </h3>
                                    {movie.subtitle && (
                                        <p className="text-xs lg:text-sm text-gray-500 line-clamp-1">
                                            {movie.subtitle}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </HoverPreviewCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface CountryMoviesSectionProps {
    koreanMovies?: CountryMovie[];
    chineseMovies?: CountryMovie[];
    usukMovies?: CountryMovie[];
}

/**
 * Combined Country Movies Section - Korean, Chinese, and US/UK in ONE container
 */
export function CountryMoviesSection({ 
    koreanMovies = [], 
    chineseMovies = [], 
    usukMovies = [] 
}: CountryMoviesSectionProps) {
    if (!koreanMovies.length && !chineseMovies.length && !usukMovies.length) {
        return null;
    }

    return (
        <section className="py-3 lg:py-4">
            <div className="container">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 lg:p-5 space-y-5">
                    {/* Korean Movies Row */}
                    {koreanMovies.length > 0 && (
                        <CountryMovieRow
                            title="Phim Hàn Quốc mới"
                            href="/movies/korean"
                            movies={koreanMovies}
                            titleGradient={TITLE_GRADIENTS[0]}
                        />
                    )}

                    {/* Divider */}
                    {koreanMovies.length > 0 && chineseMovies.length > 0 && (
                        <div className="border-t border-white/10" />
                    )}

                    {/* Chinese Movies Row */}
                    {chineseMovies.length > 0 && (
                        <CountryMovieRow
                            title="Phim Trung Quốc mới"
                            href="/movies/chinese"
                            movies={chineseMovies}
                            titleGradient={TITLE_GRADIENTS[4]}
                        />
                    )}

                    {/* Divider */}
                    {(koreanMovies.length > 0 || chineseMovies.length > 0) && usukMovies.length > 0 && (
                        <div className="border-t border-white/10" />
                    )}

                    {/* US UK Movies Row */}
                    {usukMovies.length > 0 && (
                        <CountryMovieRow
                            title="Phim US-UK mới"
                            href="/movies/us-uk"
                            movies={usukMovies}
                            titleGradient={TITLE_GRADIENTS[3]}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}

export default CountryMoviesSection;
