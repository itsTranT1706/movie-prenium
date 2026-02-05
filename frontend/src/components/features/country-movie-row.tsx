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
    quality?: string;
    lang?: string;
    isNew?: boolean;
    episodeCurrent?: string;
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
    'from-indigo-400 via-violet-400 to-indigo-400',
];

/**
 * Format language badges from lang string
 */
function formatLanguageBadges(lang?: string): string[] {
    if (!lang) return [];
    const badges: string[] = [];
    const langLower = lang.toLowerCase();
    if (langLower.includes('vietsub')) badges.push('VS');
    if (langLower.includes('thuyết minh') || langLower.includes('thuyet minh')) badges.push('TM');
    if (langLower.includes('lồng tiếng') || langLower.includes('long tieng')) badges.push('LT');
    if (langLower.includes('phụ đề') || langLower.includes('phu de')) badges.push('PĐ');
    return badges;
}

/**
 * Get badge color based on type
 */
function getBadgeColor(type: string): string {
    switch (type) {
        case 'TM': return 'bg-[#E50914]';
        case 'LT': return 'bg-[#2563eb]';
        case 'VS':
        case 'PĐ':
        default: return 'bg-[#1f1f1f]';
    }
}

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
                                                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                                    {movie.isNew && (
                                                        <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded shadow-md w-fit">
                                                            NEW
                                                        </span>
                                                    )}
                                                    {movie.quality && (
                                                        <span className="px-1.5 py-[2px] border border-white/30 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold tracking-wider rounded-[3px] shadow-sm uppercase w-fit">
                                                            {movie.quality}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Rating Badge - Top Right */}
                                                {movie.rating && (
                                                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-yellow-500 text-[10px] font-bold shadow-md z-10">
                                                        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span>{movie.rating.toFixed(1)}</span>
                                                    </div>
                                                )}

                                                {/* Language Badges - Bottom Center */}
                                                {formatLanguageBadges(movie.lang).length > 0 && (
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex shadow-lg text-[10px] font-bold z-20 leading-none">
                                                        <div className="flex rounded-t-lg overflow-hidden ring-1 ring-black/20">
                                                            {formatLanguageBadges(movie.lang).map((badge) => (
                                                                <div
                                                                    key={badge}
                                                                    className={`px-2 py-1.5 ${getBadgeColor(badge)} text-white flex items-center gap-1 font-extrabold shadow-sm`}
                                                                >
                                                                    <span>{badge}</span>
                                                                    {movie.episodeCurrent && (
                                                                        <>
                                                                            <span className="opacity-80 text-[10px] mx-0.5 font-bold">-</span>
                                                                            <span>{movie.episodeCurrent.replace(/\D/g, '') || 'Full'}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
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
