'use client';

import { useState, useRef } from 'react';
import { Play, Plus, Star, Info } from 'lucide-react';
import { NavigationLink } from '@/components/ui';

interface FeaturedMovie {
    id: string;
    externalId?: string;
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
    movies: FeaturedMovie[];
    isLoading?: boolean;
}

/**
 * Hero Banner Component
 * - Full-width immersive experience
 * - Cinema-style layout with thumbnail preview strip
 * - Premium streaming platform feel
 */
export default function HeroBanner({ movies, isLoading }: HeroBannerProps) {
    const featuredMovies = movies || [];
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



    if (isLoading || !featuredMovies.length) {
        return (
            <section className="relative h-[85vh] md:h-[70vh] lg:h-screen bg-gray-900 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                <div className="container h-full flex items-center md:items-end justify-center md:justify-start pb-8 md:pb-28">
                    <div className="max-w-xl space-y-3 text-center md:text-left">
                        <div className="h-10 bg-gray-800 rounded w-3/4 mx-auto md:mx-0" />
                        <div className="h-3 bg-gray-800 rounded w-full" />
                        <div className="h-3 bg-gray-800 rounded w-2/3 mx-auto md:mx-0" />
                        <div className="flex gap-2 pt-2 justify-center md:justify-start">
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
            className={`relative h-[85vh] md:h-[70vh] lg:h-screen overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background Image with smooth transition - Desktop only */}
            <div className="absolute inset-0 hidden md:block">
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

            {/* Mobile Background - Blurred backdrop */}
            <div className="absolute inset-0 md:hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" />
                {featuredMovies.map((movie, index) => (
                    <img
                        key={`mobile-bg-${movie.id}`}
                        src={movie.backdropUrl}
                        alt=""
                        className={`absolute inset-0 w-full h-full object-cover object-center blur-2xl scale-110 transition-opacity duration-700 ease-in-out ${index === activeIndex ? 'opacity-30' : 'opacity-0'
                            }`}
                        loading={index === 0 ? 'eager' : 'lazy'}
                    />
                ))}
            </div>

            {/* Gradient Overlays - Desktop */}
            <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black via-black/70 to-transparent" />

            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />

            {/* Top vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

            {/* Film Grain Overlay */}
            <div className="film-grain" aria-hidden="true" />

            {/* Content Container */}
            <div className="relative container h-full flex flex-col md:flex-row items-center md:items-end justify-center md:justify-start pt-20 md:pt-0 pb-16 md:pb-16 lg:pb-20 px-4">
                {/* Mobile/Tablet: Centered Poster + Info Below */}
                <div className="md:hidden flex flex-col items-center text-center space-y-4 max-w-sm w-full">
                    {/* Poster Card - Mobile */}
                    <div
                        className={`relative w-52 h-80 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                            }`}
                    >
                        <img
                            src={activeMovie.posterUrl}
                            alt={activeMovie.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        <div className="absolute inset-0 ring-1 ring-white/10 rounded-xl" />
                    </div>

                    {/* Title - Mobile */}
                    <h1
                        className={`text-2xl sm:text-3xl font-bold text-white transition-all duration-500 leading-tight ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        {activeMovie.title}
                    </h1>

                    {/* Description - Mobile (shorter) */}
                    <p
                        className={`text-gray-300 text-sm sm:text-base line-clamp-2 px-2 transition-all duration-500 delay-75 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        {activeMovie.description}
                    </p>

                    {/* Metadata Pills - Mobile */}
                    <div
                        className={`flex flex-wrap items-center justify-center gap-2 transition-all duration-500 delay-100 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-500/20 rounded text-yellow-400 text-xs font-semibold">
                            <Star className="w-3.5 h-3.5 fill-yellow-400" />
                            <span>{activeMovie.rating}</span>
                        </span>
                        <span className="px-2.5 py-1 bg-white/10 rounded text-white text-xs font-medium">
                            {activeMovie.quality}
                        </span>
                        <span className="px-2.5 py-1 bg-white/10 rounded text-gray-300 text-xs">
                            {activeMovie.year}
                        </span>
                    </div>

                    {/* CTA Buttons - Mobile (Full width) */}
                    <div
                        className={`flex flex-col w-full gap-3 transition-all duration-500 delay-150 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        <NavigationLink
                            href={`/watch/${activeMovie.externalId || activeMovie.id}`}
                            className="flex items-center justify-center gap-2 w-full px-8 py-3.5 bg-white hover:bg-gray-200 text-black font-bold text-base rounded-lg transition-all active:scale-95 shadow-lg"
                        >
                            <Play className="w-5 h-5 fill-black" />
                            <span>Xem Phim</span>
                        </NavigationLink>
                        <NavigationLink
                            href={`/movies/${activeMovie.externalId || activeMovie.id}`}
                            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-base rounded-lg backdrop-blur-sm transition-all active:scale-95"
                        >
                            <Info className="w-5 h-5" />
                            <span>Thông Tin</span>
                        </NavigationLink>
                    </div>

                    {/* Dots Indicator - Mobile */}
                    <div className="flex gap-2 pt-2">
                        {featuredMovies.slice(0, 8).map((movie, index) => (
                            <button
                                key={movie.id}
                                onClick={() => handleThumbnailClick(index)}
                                className={`transition-all duration-300 rounded-full ${index === activeIndex
                                    ? 'w-6 h-2 bg-white'
                                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`View ${movie.title}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop: Original Layout */}
                <div className="hidden md:flex w-full items-end justify-between gap-6 lg:gap-8 xl:gap-10">
                    {/* Left side - Movie info and CTA */}
                    <div className="max-w-xl flex-shrink">
                        {/* Title with transition - Cinematic fake logo style */}
                        <h1
                            className={`movie-title-logo mb-3 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
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
                        <NavigationLink
                            href={`/watch/${activeMovie.externalId || activeMovie.id}`}
                            className="inline-flex items-center gap-2 px-8 py-2.5 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition-all active:scale-95"
                        >
                            <Play className="w-5 h-5 fill-black" />
                            <span>Play</span>
                        </NavigationLink>
                            <NavigationLink
                                href={`/movies/${activeMovie.externalId || activeMovie.id}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-500/40 hover:bg-gray-500/60 text-white font-semibold text-sm rounded backdrop-blur-sm transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Chi tiết</span>
                            </NavigationLink>
                        </div>
                    </div>

                    {/* Right side - Thumbnail Preview Strip (Desktop/Tablet) */}
                    <div className="hidden md:flex gap-2 lg:gap-3 xl:gap-4 items-center flex-shrink-0">
                        {/* Show fewer thumbnails on smaller screens */}
                        {featuredMovies.slice(0, 4).map((movie, index) => (
                            <button
                                key={movie.id}
                                onClick={() => handleThumbnailClick(index)}
                                className={`md:block ${index >= 3 ? 'hidden lg:block' : ''} ${index >= 4 ? 'hidden xl:block' : ''} flex-shrink-0 w-14 h-9 md:w-16 md:h-10 lg:w-20 lg:h-12 xl:w-24 xl:h-14 rounded-md lg:rounded-lg overflow-hidden transition-all duration-300 ${index === activeIndex
                                    ? 'ring-2 ring-white scale-105 lg:scale-110 shadow-lg shadow-black/50'
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
                        {/* Additional thumbnails for larger screens */}
                        {featuredMovies.slice(4, 6).map((movie, index) => (
                            <button
                                key={movie.id}
                                onClick={() => handleThumbnailClick(index + 4)}
                                className={`hidden xl:block flex-shrink-0 w-24 h-14 rounded-lg overflow-hidden transition-all duration-300 ${index + 4 === activeIndex
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
