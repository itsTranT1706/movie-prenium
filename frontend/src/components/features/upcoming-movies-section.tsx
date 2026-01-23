'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HoverPreviewCard, MoviePreviewData } from '@/components/ui';

interface UpcomingMovie {
    id: string;
    externalId?: string;
    title: string;
    subtitle?: string;
    backdropUrl: string;
    releaseDate?: string;
    hasComingSoonBadge?: boolean;
}

interface UpcomingMoviesSectionProps {
    title?: string;
    movies?: UpcomingMovie[];
}

// Default upcoming movies
const defaultUpcomingMovies: UpcomingMovie[] = [
    {
        id: 'up1',
        title: 'Tiểu Yêu Quái Núi Lảng Lặng',
        subtitle: 'Nobody',
        backdropUrl: 'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        hasComingSoonBadge: true,
    },
    {
        id: 'up2',
        title: 'Đại Ca',
        subtitle: 'Boss',
        backdropUrl: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        hasComingSoonBadge: true,
    },
    {
        id: 'up3',
        title: 'Anaconda: Đụng Độ Siêu Trăn',
        subtitle: 'Anaconda',
        backdropUrl: 'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fvez8tKL8rLj5Bjs.jpg',
        hasComingSoonBadge: true,
    },
    {
        id: 'up4',
        title: 'Không Bông Tuyết Nào Trong Sạch',
        subtitle: 'The Woman in the White Car',
        backdropUrl: 'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        hasComingSoonBadge: true,
    },
    {
        id: 'up5',
        title: '96 Phút Sinh Tử',
        subtitle: '96 Minutes',
        backdropUrl: 'https://image.tmdb.org/t/p/w780/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        hasComingSoonBadge: true,
    },
    {
        id: 'up6',
        title: 'Thunderbolts*',
        subtitle: 'Thunderbolts*',
        backdropUrl: 'https://image.tmdb.org/t/p/w780/oSxPbO5CbCuJXvLcLR8eqUCaj9M.jpg',
        hasComingSoonBadge: true,
    },
    {
        id: 'up7',
        title: 'Mickey 17',
        subtitle: 'Mickey 17',
        backdropUrl: 'https://image.tmdb.org/t/p/w780/1SdMNGLLvmf3gBqKKKZzqEBnzCW.jpg',
        hasComingSoonBadge: true,
    },
    {
        id: 'up8',
        title: 'Captain America: Brave New World',
        subtitle: 'Captain America 4',
        backdropUrl: 'https://image.tmdb.org/t/p/w780/pWHf4khOloNVfCxscsXFj3jj6gP.jpg',
        hasComingSoonBadge: true,
    },
];

/**
 * Upcoming Movies Carousel Section
 * "Phim Sắp Tới Trên Rổ" style horizontal carousel
 * with styled navigation arrows
 */
export default function UpcomingMoviesSection({
    title = 'Coming Soon',
    movies = defaultUpcomingMovies,
}: UpcomingMoviesSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Check scroll position for arrow visibility
    const checkScrollPosition = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;

        scrollEl.addEventListener('scroll', checkScrollPosition);
        checkScrollPosition();

        return () => scrollEl.removeEventListener('scroll', checkScrollPosition);
    }, []);

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
                    <h2 className="text-base lg:text-lg font-bold text-white">
                        {title}
                    </h2>
                    <Link
                        href="/movies/upcoming"
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                    >
                        Xem toàn bộ
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Carousel Container with styled arrows */}
                <div className="relative flex items-center gap-3">
                    {/* Left Arrow - Styled circular button */}
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200
                            ${canScrollLeft
                                ? 'border-white/30 hover:border-white/60 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer'
                                : 'border-white/10 text-white/20 cursor-not-allowed'
                            }`}
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>

                    {/* Cards Container */}
                    <div
                        ref={scrollRef}
                        className="flex-1 flex gap-3 lg:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
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
                                    className="upcoming-movie-card group/card flex-shrink-0 block"
                                >
                                    {/* Card Container - Landscape aspect ratio */}
                                    <div className="relative w-48 lg:w-56 aspect-[16/10] rounded-xl overflow-hidden">
                                        {/* Background Image */}
                                        <img
                                            src={movie.backdropUrl}
                                            alt={movie.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                            loading="lazy"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                        {/* Coming Soon Badge */}
                                        {movie.hasComingSoonBadge && (
                                            <div className="absolute bottom-2 left-2">
                                                <span className="px-2 py-0.5 bg-gray-800/90 backdrop-blur-sm rounded text-[10px] font-medium text-gray-300 border border-gray-600/50">
                                                    Sắp chiếu
                                                </span>
                                            </div>
                                        )}

                                        {/* Hover overlay - subtle play indicator */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-black/20">
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <div className="w-0 h-0 border-l-[14px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title Section */}
                                    <div className="mt-2 px-0.5 w-48 lg:w-56">
                                        <h3 className="text-xs lg:text-sm font-medium text-white line-clamp-1 group-hover/card:text-gray-200 transition-colors">
                                            {movie.title}
                                        </h3>
                                        {movie.subtitle && (
                                            <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                                {movie.subtitle}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </HoverPreviewCard>
                        ))}
                    </div>

                    {/* Right Arrow - Styled circular button */}
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200
                            ${canScrollRight
                                ? 'border-white/30 hover:border-white/60 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer'
                                : 'border-white/10 text-white/20 cursor-not-allowed'
                            }`}
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
}
