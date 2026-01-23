'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HoverPreviewCard, MoviePreviewData } from '@/components/ui';

interface Top10Movie {
    id: string;
    rank: number;
    title: string;
    subtitle?: string;
    posterUrl: string;
    ageRating?: string; // T13, T16, T18
    year: number;
    duration?: string;
    hasPDE?: boolean;
    hasTMinh?: boolean;
    quality?: string; // CAM, HD, etc.
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
        hasPDE: true,
        hasTMinh: true,
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
        hasPDE: true,
        hasTMinh: true,
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
        hasPDE: true,
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
        hasPDE: true,
        hasTMinh: true,
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
        hasPDE: true,
        hasTMinh: true,
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
        hasPDE: true,
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
        hasPDE: true,
        hasTMinh: true,
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
        hasPDE: true,
        hasTMinh: true,
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
        hasPDE: true,
        hasTMinh: true,
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
        hasPDE: true,
        hasTMinh: true,
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
 * Top 10 Movies Section Component
 * Ranked horizontal carousel with glowing hover effect
 */
export default function Top10MoviesSection({
    title = 'Top 10 phim lẻ hôm nay',
    movies = defaultTop10Movies,
}: Top10MoviesSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 400;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section className="py-4 lg:py-6">
            <div className="container">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base lg:text-lg font-bold text-white">{title}</h2>
                    <Link 
                        href="/movies/top-rated" 
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        Xem toàn bộ
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Scrollable Cards Container */}
                <div className="relative group/container">
                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover/container:opacity-100 transition-opacity backdrop-blur-sm"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/3 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover/container:opacity-100 transition-opacity backdrop-blur-sm"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Cards */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 lg:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                    >
                        {movies.map((movie) => (
                            <div
                                key={movie.id}
                                className="flex-shrink-0 flex items-end gap-1"
                            >
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
                                        className="top10-card group/card flex-shrink-0 relative block"
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
                                            className="relative w-44 lg:w-52 aspect-[2/3] overflow-hidden border-2 border-transparent group-hover/card:border-white/80 transition-all duration-300 shadow-lg group-hover/card:shadow-cyan-400/30 group-hover/card:shadow-xl"
                                            style={{ borderRadius: '32px 32px 16px 16px' }}
                                        >
                                            {/* Poster Image */}
                                            <img
                                                src={movie.posterUrl}
                                                alt={movie.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                                loading="lazy"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                            {/* Badges - Bottom */}
                                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2">
                                                {movie.hasPDE && (
                                                    <span className="px-2 py-0.5 bg-gray-700/90 backdrop-blur-sm rounded-lg text-[10px] font-medium text-gray-300">
                                                        PĐ. {movie.rank * 5 + 15}
                                                    </span>
                                                )}
                                                {movie.hasTMinh && (
                                                    <span className="px-2 py-0.5 bg-emerald-600/90 backdrop-blur-sm rounded-lg text-[10px] font-medium text-white">
                                                        TM. {movie.rank * 5 + 15}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quality Badge - Top right */}
                                            {movie.quality && (
                                                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-red-600/90 backdrop-blur-sm rounded text-[9px] font-bold text-white">
                                                    {movie.quality}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title Section */}
                                    <div className="mt-2 w-44 lg:w-52">
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
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
