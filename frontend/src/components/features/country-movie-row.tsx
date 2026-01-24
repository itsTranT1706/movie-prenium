'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HoverPreviewCard } from '@/components/ui';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

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
 * Country Movie Card with Skeleton Loading
 */
function CountryMovieCardImage({
    src,
    alt,
    priority = false
}: {
    src: string;
    alt: string;
    priority?: boolean;
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <>
            {/* Skeleton Loading Placeholder */}
            {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
                </div>
            )}

            {!imageError ? (
                <img
                    src={src}
                    alt={alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover/card:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <div className="w-0 h-0 border-l-[10px] border-l-white/30 border-y-[6px] border-y-transparent ml-1" />
                    </div>
                </div>
            )}
        </>
    );
}

/**
 * Country Movie Row Component (Inner)
 * Used inside CountryMoviesSection with shadcn/ui carousel
 */
function CountryMovieRow({
    title,
    href = '/movies',
    movies,
    gradientFrom = 'from-pink-500/30',
    titleGradient = TITLE_GRADIENTS[0],
}: CountryMovieRowProps) {
    if (!movies.length) return null;

    return (
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 lg:gap-6 items-start md:items-center">
            {/* Left: Title Section */}
            <div className="flex-shrink-0 w-full md:w-36 lg:w-44 xl:w-48 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start">
                <h2 className={`text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold leading-tight md:mb-2 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>
                    {title}
                </h2>
                <Link
                    href={href}
                    className="text-xs lg:text-sm text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-0.5"
                >
                    <span className="hidden md:inline">Xem toàn bộ</span>
                    <span className="md:hidden">Xem thêm</span>
                    <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                </Link>
            </div>

            {/* Right: Carousel Cards */}
            <div className="flex-1 w-full min-w-0 relative overflow-hidden">
                <Carousel
                    opts={{
                        align: 'start',
                        loop: false,
                        slidesToScroll: 1,
                        containScroll: 'trimSnaps',
                    }}
                    className="w-full"
                >
                    <div className="relative">
                        {/* Fade mask on right edge - Hidden on mobile */}
                        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-[5] pointer-events-none" />

                        <CarouselContent className="-ml-3 md:-ml-4">
                            {movies.map((movie, index) => (
                                <CarouselItem key={movie.id} className="pl-3 md:pl-4 basis-auto">
                                    <HoverPreviewCard
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
                                            className="country-movie-card group/card block"
                                        >
                                            <div className="relative w-44 md:w-52 lg:w-64 xl:w-72 aspect-[16/10] rounded-lg overflow-hidden">
                                                <CountryMovieCardImage
                                                    src={movie.backdropUrl}
                                                    alt={movie.title}
                                                    priority={index < 4}
                                                />
                                                <div className={`absolute inset-0 bg-gradient-to-t ${movie.gradientColor || gradientFrom} via-transparent to-black/40 opacity-60 group-hover/card:opacity-40 transition-opacity`} />
                                                <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                                                    {movie.episodeCount && (
                                                        <span className="px-1.5 py-0.5 md:py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] lg:text-xs font-medium text-white">
                                                            EP.{movie.episodeCount}
                                                        </span>
                                                    )}
                                                    {movie.rating && (
                                                        <span className="px-1.5 py-0.5 md:py-1 bg-emerald-500/80 backdrop-blur-sm rounded text-[10px] lg:text-xs font-bold text-white">
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
                                            <div className="mt-1.5 w-44 md:w-52 lg:w-64 xl:w-72">
                                                <h3 className="text-xs md:text-sm lg:text-base font-medium text-white line-clamp-1 group-hover/card:text-gray-200 transition-colors">
                                                    {movie.title}
                                                </h3>
                                                {movie.subtitle && (
                                                    <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 line-clamp-1">
                                                        {movie.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    </HoverPreviewCard>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Navigation Arrows - Hidden on mobile */}
                        <CarouselPrevious className="hidden md:flex absolute left-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full text-white border-0 disabled:opacity-0" />
                        <CarouselNext className="hidden md:flex absolute right-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 bg-black/70 hover:bg-black/90 rounded-full text-white border-0 disabled:opacity-0" />
                    </div>
                </Carousel>
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
        <section className="py-3 md:py-4 lg:py-5">
            <div className="container px-4 md:px-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 space-y-4 md:space-y-5">
                    {/* Korean Movies Row */}
                    {koreanMovies.length > 0 && (
                        <CountryMovieRow
                            title="Phim Hàn Quốc mới"
                            href="/country/han-quoc"
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
                            href="/country/trung-quoc"
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
                            href="/country/au-my"
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
