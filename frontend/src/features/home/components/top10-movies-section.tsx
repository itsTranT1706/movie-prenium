'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { HoverPreviewCard, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/components/ui';

interface Top10Movie {
    id: string;
    rank: number;
    title: string;
    subtitle?: string;
    posterUrl: string;
    ageRating?: string; // T13, T16, T18
    year: number;
    duration?: string;
    quality?: string; // CAM, HD, etc.
    lang?: string;
    isNew?: boolean;
    episodeCurrent?: string;
}

interface Top10MoviesSectionProps {
    title?: string;
    movies?: Top10Movie[];
}

// Default top 10 movies
const defaultTop10Movies: Top10Movie[] = [
    {
        id: 'top1',
        rank: 1,
        title: 'Avatar: Lửa và Tro Tàn',
        subtitle: 'Avatar: Fire and Ash',
        posterUrl: 'https://image.tmdb.org/t/p/w342/3WPf7DnKqbGxPLhoBr0Bl1R8rsn.jpg',
        ageRating: 'T13',
        year: 2025,
        duration: '3h 12m',
        lang: 'Vietsub + Thuyết Minh',
        quality: 'CAM',
    },
    {
        id: 'top2',
        rank: 2,
        title: 'Phi Vụ Động Trời 2',
        subtitle: 'Zootopia 2',
        posterUrl: 'https://image.tmdb.org/t/p/w342/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        ageRating: 'K',
        year: 2025,
        duration: '1h 50m',
        lang: 'Vietsub + Thuyết Minh',
        quality: 'CAM',
    },
    {
        id: 'top3',
        rank: 3,
        title: 'Ngọn Đồi Câm Lặng',
        subtitle: 'Silent Hill',
        posterUrl: 'https://image.tmdb.org/t/p/w342/74xTEgt7R36Fvez8tKL8rLj5Bjs.jpg',
        ageRating: 'T18',
        year: 2006,
        duration: '2h 05m',
        lang: 'Vietsub',
        quality: 'HD',
    },
    {
        id: 'top4',
        rank: 4,
        title: 'Avatar 2: Dòng Chảy Của Nước',
        subtitle: 'Avatar: The Way of Water',
        posterUrl: 'https://image.tmdb.org/t/p/w342/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        ageRating: 'T16',
        year: 2022,
        duration: '3h 12m',
        lang: 'Vietsub + Thuyết Minh',
        quality: 'HD',
    },
    {
        id: 'top5',
        rank: 5,
        title: 'Avatar',
        subtitle: 'Avatar',
        posterUrl: 'https://image.tmdb.org/t/p/w342/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
        ageRating: 'T16',
        year: 2009,
        duration: '2h 42m',
        lang: 'Vietsub + Thuyết Minh',
        quality: 'HD',
    },
    {
        id: 'top6',
        rank: 6,
        title: 'Ranh Giới Tội Ác',
        subtitle: 'The Rip',
        posterUrl: 'https://image.tmdb.org/t/p/w342/vZloFAK7NmvMGKE7LsyBnq43j2k.jpg',
        ageRating: 'T18',
        year: 2026,
        duration: '1h 52m',
        lang: 'Vietsub',
        quality: 'CAM',
    },
    {
        id: 'top7',
        rank: 7,
        title: 'Deadpool & Wolverine',
        subtitle: 'Deadpool & Wolverine',
        posterUrl: 'https://image.tmdb.org/t/p/w342/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        ageRating: 'T18',
        year: 2024,
        duration: '2h 08m',
        lang: 'Vietsub + Thuyết Minh',
        quality: 'HD',
    },
    {
        id: 'top8',
        rank: 8,
        title: 'Venom: Kèo Cuối',
        subtitle: 'Venom: The Last Dance',
        posterUrl: 'https://image.tmdb.org/t/p/w342/k42Owka8v91Iy0JpBRpXVYQJGhO.jpg',
        ageRating: 'T13',
        year: 2024,
        duration: '1h 49m',
        lang: 'Vietsub + Thuyết Minh',
        quality: 'HD',
    },
    {
        id: 'top9',
        rank: 9,
        title: 'Thunderbolts*',
        subtitle: 'Thunderbolts*',
        posterUrl: 'https://image.tmdb.org/t/p/w342/oSxPbO5CbCuJXvLcLR8eqUCaj9M.jpg',
        ageRating: 'T13',
        year: 2025,
        duration: '2h 07m',
        lang: 'Vietsub + Thuyết Minh',
        quality: 'CAM',
    },
    {
        id: 'top10',
        rank: 10,
        title: 'Dune: Part Two',
        subtitle: 'Dune: Part Two',
        posterUrl: 'https://image.tmdb.org/t/p/w342/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        ageRating: 'T13',
        year: 2024,
        duration: '2h 46m',
        lang: 'Vietsub + Thuyết Minh',
        quality: 'HD',
    },
];

/**
 * Get rank number color based on position
 */
function getRankGradient(rank: number): string {
    switch (rank) {
        case 1:
            return 'from-amber-400 via-yellow-300 to-amber-500'; // Gold
        case 2:
            return 'from-gray-300 via-slate-200 to-gray-400'; // Silver  
        case 3:
            return 'from-amber-600 via-orange-500 to-amber-700'; // Bronze
        default:
            return 'from-gray-500 via-gray-400 to-gray-600'; // Default
    }
}

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
 * Top 10 Movies Section Component
 * Ranked horizontal carousel with glowing hover effect using shadcn/ui carousel
 */
export default function Top10MoviesSection({
    title = 'Top 10 phim lẻ hôm nay',
    movies = defaultTop10Movies,
}: Top10MoviesSectionProps) {

    return (
        <section className="py-4 lg:py-6">
            <div className="w-full px-4 md:px-12 lg:px-16 2xl:px-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-widest border-l-4 border-[#ff2020] pl-4 shadow-black drop-shadow-lg">{title}</h2>
                    {/* <Link 
                        href="/movies/top-rated" 
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        Xem toàn bộ
                        <ChevronRight className="w-3 h-3" />
                    </Link> */}
                </div>

                {/* Carousel with Cards */}
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
                        <CarouselContent className="-ml-4 lg:-ml-5">
                            {movies.map((movie) => (
                                <CarouselItem key={movie.id} className="pl-4 lg:pl-5 basis-auto">
                                    <div className="flex items-end gap-1">
                                        {/* Large Rank Number */}
                                        <span
                                            className={`text-7xl lg:text-8xl font-black leading-none bg-gradient-to-b ${getRankGradient(movie.rank)} bg-clip-text text-transparent drop-shadow-lg`}
                                            style={{
                                                WebkitTextStroke: '2px rgba(255,255,255,0.1)',
                                                marginRight: '4px',
                                                zIndex: 1,
                                            }}
                                        >
                                            {movie.rank}
                                        </span>

                                        {/* Movie Card */}
                                        <HoverPreviewCard
                                            movie={{
                                                id: movie.id,
                                                title: movie.title,
                                                subtitle: movie.subtitle,
                                                posterUrl: movie.posterUrl,
                                                year: movie.year,
                                                duration: movie.duration,
                                                ageRating: movie.ageRating,
                                                quality: movie.quality,
                                            }}
                                            delay={600}
                                        >
                                            <Link
                                                href={`/movie/${movie.id}`}
                                                className="top10-card group/card block"
                                            >
                                                {/* Glow Effect Container */}
                                                <div className="relative">
                                                    {/* Glow Layer - Hidden by default, shows on hover */}
                                                    <div
                                                        className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-white to-cyan-400 opacity-0 group-hover/card:opacity-70 blur-md transition-opacity duration-300"
                                                        style={{ borderRadius: '36px 36px 20px 20px' }}
                                                    />

                                                    {/* Card Container - Asymmetric rounded corners (top larger than bottom) */}
                                                    <div
                                                        className="relative w-48 lg:w-56 xl:w-64 2xl:w-80 aspect-[2/3] overflow-hidden border-2 border-transparent group-hover/card:border-white/80 transition-all duration-300 shadow-lg group-hover/card:shadow-cyan-400/30 group-hover/card:shadow-xl"
                                                        style={{ borderRadius: '32px 32px 16px 16px' }}
                                                    >
                                                        {/* Poster Image */}
                                                        <img
                                                            src={movie.posterUrl}
                                                            alt={movie.title}
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                                            loading="lazy"
                                                        />

                                                        {/* Badges - Top Left */}
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

                                                        {/* Rating/Language Badges - Bottom Center */}
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
                                                    </div>
                                                </div>

                                                {/* Title Section */}
                                                <div className="mt-2">
                                                    <h3 className="text-xs lg:text-sm font-semibold text-white line-clamp-1 group-hover/card:text-cyan-300 transition-colors">
                                                        {movie.title}
                                                    </h3>
                                                    {movie.subtitle && movie.subtitle !== movie.title && (
                                                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                                            {movie.subtitle}
                                                        </p>
                                                    )}
                                                    {/* Metadata row */}
                                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500 flex-wrap">
                                                        {movie.ageRating && (
                                                            <span className="px-1 py-0.5 border border-gray-600 rounded text-gray-400 font-medium">
                                                                {movie.ageRating}
                                                            </span>
                                                        )}
                                                        <span>{movie.year}</span>
                                                        {movie.duration && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{movie.duration}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </HoverPreviewCard>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Navigation Arrows */}
                        <CarouselPrevious className="absolute -left-5 top-[47%] -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/20 hover:border-white/40 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-0" />
                        <CarouselNext className="absolute -right-5 top-[47%] -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-white/20 hover:border-white/40 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-0" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
