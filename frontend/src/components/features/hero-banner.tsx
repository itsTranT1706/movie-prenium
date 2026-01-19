'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Play, Plus, Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedMovie {
    id: string;
    title: string;
    description: string;
    backdropUrl: string;
    posterUrl: string;
    rating: number;
    year: number;
    quality: string;
    genre: string;
}

interface HeroBannerProps {
    movies?: FeaturedMovie[];
    isLoading?: boolean;
}

// Default featured movies for the thumbnail strip
const defaultFeaturedMovies: FeaturedMovie[] = [
    {
        id: '1',
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        rating: 8.8,
        year: 2024,
        quality: '4K',
        genre: 'Sci-Fi',
    },
    {
        id: '2',
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        rating: 8.9,
        year: 2023,
        quality: '4K',
        genre: 'Drama',
    },
    {
        id: '3',
        title: 'The Batman',
        description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/5P8SmMzSNYikXpxil6BYzJ16611.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvez8tKL8rLj5Bjs.jpg',
        rating: 8.0,
        year: 2022,
        quality: 'HD',
        genre: 'Action',
    },
    {
        id: '4',
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        rating: 7.8,
        year: 2022,
        quality: '4K',
        genre: 'Fantasy',
    },
    {
        id: '5',
        title: 'Top Gun: Maverick',
        description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/x93QzAgtHeRGgfK51Jh6URClBG8.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/original/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg',
        rating: 8.4,
        year: 2022,
        quality: 'HD',
        genre: 'Action',
    },
    {
        id: '6',
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the multiverse, where he encounters a team of Spider-People charged with protecting its existence.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        rating: 8.7,
        year: 2023,
        quality: '4K',
        genre: 'Animation',
    },
    {
        id: '7',
        title: 'John Wick: Chapter 4',
        description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, he must face off against a new enemy.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/7I6VUdPj6tQECNHdviJkUHD2u89.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7LsyBnq43j2k.jpg',
        rating: 8.1,
        year: 2023,
        quality: '4K',
        genre: 'Action',
    },
    {
        id: '8',
        title: 'Guardians of the Galaxy Vol. 3',
        description: 'Still reeling from the loss of Gamora, Peter Quill must rally his team to defend the universe and protect one of their own.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/bQXAqRx3RkK5sRuHn24wNUl3s8G.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
        rating: 8.0,
        year: 2023,
        quality: '4K',
        genre: 'Sci-Fi',
    },
];

/**
 * Hero Banner Component
 * - Full-width immersive experience
 * - Cinema-style layout with thumbnail preview strip
 * - Premium streaming platform feel
 */
export default function HeroBanner({ movies, isLoading }: HeroBannerProps) {
    const featuredMovies = movies || defaultFeaturedMovies;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Swipe/drag state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);

    const activeMovie = featuredMovies[activeIndex];

    const handleThumbnailClick = (index: number) => {
        if (index === activeIndex || isTransitioning) return;

        setIsTransitioning(true);
        setActiveIndex(index);

        // Reset transition state after animation
        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Navigate to next/previous movie
    const navigateMovie = (direction: 'next' | 'prev') => {
        if (isTransitioning) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (activeIndex + 1) % featuredMovies.length;
        } else {
            newIndex = (activeIndex - 1 + featuredMovies.length) % featuredMovies.length;
        }
        handleThumbnailClick(newIndex);
    };

    // Mouse drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        // Prevent text selection while dragging
        e.preventDefault();
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const dragDistance = e.clientX - dragStartX;
        const swipeThreshold = 50; // pixels

        if (Math.abs(dragDistance) > swipeThreshold) {
            if (dragDistance > 0) {
                navigateMovie('prev'); // Swiped right -> go to previous
            } else {
                navigateMovie('next'); // Swiped left -> go to next
            }
        }

        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setDragStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dragDistance = e.changedTouches[0].clientX - dragStartX;
        const swipeThreshold = 50;

        if (Math.abs(dragDistance) > swipeThreshold) {
            if (dragDistance > 0) {
                navigateMovie('prev');
            } else {
                navigateMovie('next');
            }
        }
    };

    const scrollThumbnails = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = 200;
        scrollContainerRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (isLoading) {
        return (
            <section className="relative h-[60vh] lg:h-[75vh] bg-gray-900 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                <div className="container h-full flex items-end pb-28">
                    <div className="max-w-xl space-y-3">
                        <div className="h-10 bg-gray-800 rounded w-3/4" />
                        <div className="h-3 bg-gray-800 rounded w-full" />
                        <div className="h-3 bg-gray-800 rounded w-2/3" />
                        <div className="flex gap-2 pt-2">
                            <div className="h-5 w-14 bg-gray-800 rounded-full" />
                            <div className="h-5 w-14 bg-gray-800 rounded-full" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className={`relative h-[60vh] lg:h-[75vh] overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background Image with smooth transition */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" />
                {featuredMovies.map((movie, index) => (
                    <img
                        key={movie.id}
                        src={movie.backdropUrl}
                        alt={movie.title}
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                    />
                ))}
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

            {/* Bottom fade - matches movies/[id] page for seamless transition */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />

            {/* Top vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

            {/* Film Grain Overlay */}
            <div className="film-grain" aria-hidden="true" />

            {/* Content - Bottom aligned */}
            <div className="relative container h-full flex items-end pb-8 lg:pb-12">
                {/* Full-width row: Left content + Right thumbnails */}
                <div className="w-full flex items-end justify-between gap-8">
                    {/* Left side - Movie info and CTA */}
                    <div className="max-w-xl">
                        {/* Title with transition */}
                        <h1
                            className={`text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            {activeMovie.title}
                        </h1>

                        {/* Description with transition */}
                        <p
                            className={`text-gray-300 text-sm lg:text-base mb-4 line-clamp-2 transition-all duration-500 delay-75 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            {activeMovie.description}
                        </p>

                        {/* Metadata Pills */}
                        <div
                            className={`flex flex-wrap items-center gap-2 mb-5 transition-all duration-500 delay-100 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 rounded text-yellow-400 text-xs font-semibold">
                                <Star className="w-3 h-3 fill-yellow-400" />
                                <span>{activeMovie.rating}</span>
                            </span>
                            <span className="px-2 py-0.5 bg-white/10 rounded text-white text-xs font-medium">
                                {activeMovie.quality}
                            </span>
                            <span className="px-2 py-0.5 bg-white/10 rounded text-gray-300 text-xs">
                                {activeMovie.year}
                            </span>
                            <span className="px-2 py-0.5 bg-white/10 rounded text-gray-300 text-xs">
                                {activeMovie.genre}
                            </span>
                        </div>

                        {/* CTA Buttons */}
                        <div
                            className={`flex gap-3 transition-all duration-500 delay-150 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            <Link
                                href={`/watch/${activeMovie.id}`}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition-all active:scale-95"
                            >
                                <Play className="w-5 h-5 fill-black" />
                                <span>Play</span>
                            </Link>
                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-500/40 hover:bg-gray-500/60 text-white font-semibold text-sm rounded backdrop-blur-sm transition-all active:scale-95">
                                <Plus className="w-5 h-5" />
                                <span>My List</span>
                            </button>
                        </div>
                    </div>

                    {/* Right side - Thumbnail Preview Strip */}
                    <div className="hidden sm:flex gap-2 lg:gap-3 items-center flex-shrink-0">
                        {featuredMovies.slice(0, 6).map((movie, index) => (
                            <button
                                key={movie.id}
                                onClick={() => handleThumbnailClick(index)}
                                className={`flex-shrink-0 w-16 h-10 lg:w-24 lg:h-14 rounded-lg overflow-hidden transition-all duration-300 ${index === activeIndex
                                    ? 'ring-2 ring-white scale-110 shadow-lg shadow-black/50'
                                    : 'opacity-50 hover:opacity-80 hover:scale-105'
                                    }`}
                                aria-label={`View ${movie.title}`}
                            >
                                <img
                                    src={movie.backdropUrl.replace('/original/', '/w500/')}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
