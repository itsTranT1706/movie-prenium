'use client';

import { useState, useRef, useMemo } from 'react';
import { Play, Plus, Star, Info } from 'lucide-react';
import { NavigationLink } from '@/shared/components/ui';
import { getRandomImage } from '@/shared/lib/utils/image-utils';

interface FeaturedMovie {
    id: string;
    externalId?: string;
    title: string;
    description: string;
    backdropUrl: string;
    posterUrl: string;
    backdrops?: string[];
    posters?: string[];
    logoUrl?: string;
    rating: number;
    year: number;
    quality: string;
    genre: string;
    duration?: string;
    ageRating?: string;
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
    // Generate stable random images for this session/render cycle
    // This prevents images from changing on every interaction/re-render
    const featuredMovies = useMemo(() => {
        if (!movies) return [];
        return movies.map(movie => ({
            ...movie,
            displayBackdrop: getRandomImage(movie.backdrops, movie.backdropUrl),
            displayPoster: getRandomImage(movie.posters, movie.posterUrl)
        }));
    }, [movies]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Swipe/drag state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const containerRef = useRef<HTMLElement>(null);

    const activeMovie = featuredMovies[activeIndex];

    const handleThumbnailClick = (index: number) => {
        if (index === activeIndex || isTransitioning) return;

        setIsTransitioning(true);
        setActiveIndex(index);
        setDragOffset(0);

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

        // Don't set isTransitioning if we are simply completing a drag, 
        // as the blending is already happening/happened via dragOffset
        // But if we click buttons (not implemented here but good practice), we need it.
        // For drag completion, we might want a smooth finish.
        setIsTransitioning(true);
        setActiveIndex(newIndex);
        setDragOffset(0);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    // Mouse drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStartX(e.clientX);
        setDragOffset(0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        // Update CSS variables for lighting effect
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            containerRef.current.style.setProperty('--mouse-x', `${x}px`);
            containerRef.current.style.setProperty('--mouse-y', `${y}px`);
        }

        if (!isDragging) return;
        e.preventDefault();
        const offset = e.clientX - dragStartX;
        setDragOffset(offset);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const dragDistance = e.clientX - dragStartX;
        const swipeThreshold = 50; // pixels
        const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;

        if (Math.abs(dragDistance) > swipeThreshold) {
            if (dragDistance > 0) {
                navigateMovie('prev'); // Swiped right -> go to previous
            } else {
                navigateMovie('next'); // Swiped left -> go to next
            }
        } else {
            // Revert if threshold not met
            setDragOffset(0);
        }

        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setDragOffset(0);
            setIsDragging(false);
        }
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setDragStartX(e.touches[0].clientX);
        setDragOffset(0);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const offset = e.touches[0].clientX - dragStartX;
        setDragOffset(offset);
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isDragging) return;

        // Use dragOffset instead of recalculating from event because changedTouches detail might vary
        // and we are already tracking offset.
        const dragDistance = dragOffset;
        const swipeThreshold = 50;

        if (Math.abs(dragDistance) > swipeThreshold) {
            if (dragDistance > 0) {
                navigateMovie('prev');
            } else {
                navigateMovie('next');
            }
        } else {
            setDragOffset(0);
        }
        setIsDragging(false);
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
            className={`relative h-[85vh] md:h-[70vh] lg:h-screen overflow-hidden select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} hero-banner-container`}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                '--mouse-x': '50%',
                '--mouse-y': '50%'
            } as React.CSSProperties}
        >
            {/* Background Image with smooth transition - Desktop only */}
            <div className="absolute inset-0 hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" />
                {/* Base Layer: Active Image (Always visible at bottom when not transitioning, or masked when transitioning) */}
                {!isDragging && !isTransitioning && (
                    featuredMovies.map((movie, index) => (
                        <div
                            key={movie.id}
                            className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                src={movie.displayBackdrop}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                                loading={index === 0 ? 'eager' : 'lazy'}
                            />
                        </div>
                    ))
                )}

                {/* Transition Layer: Overlay / Interference Effect */}
                {(isDragging || isTransitioning) && (() => {
                    // Determine which is base and which is overlay
                    let baseIndex = activeIndex;
                    let overlayIndex = -1;
                    let progress = 0;

                    if (isDragging) {
                        const width = containerRef.current?.offsetWidth || window.innerWidth;
                        const rawProgress = Math.abs(dragOffset) / width;
                        progress = Math.min(rawProgress, 1);

                        // Dragging Left (< 0) -> Reveal Next
                        if (dragOffset < 0) {
                            overlayIndex = (activeIndex + 1) % featuredMovies.length;
                        }
                        // Dragging Right (> 0) -> Reveal Prev
                        else if (dragOffset > 0) {
                            overlayIndex = (activeIndex - 1 + featuredMovies.length) % featuredMovies.length;
                        }
                    } else if (isTransitioning) {
                        // Fallback for click transitions (not drag)
                        // This part is less critical for the specific "drag" request but good to keep consistent
                    }

                    // If we have an overlay to show (Dragging)
                    if (overlayIndex !== -1 && isDragging) {
                        const baseMovie = featuredMovies[baseIndex];
                        const overlayMovie = featuredMovies[overlayIndex];

                        return (
                            <>
                                {/* Base Image - Always visible/opaque at bottom */}
                                <img
                                    src={baseMovie.displayBackdrop}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt=""
                                    style={{ zIndex: 0 }}
                                />

                                {/* Overlay Image - Fades in on top */}
                                <img
                                    src={overlayMovie.displayBackdrop}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover"
                                    style={{
                                        zIndex: 10,
                                        opacity: progress,
                                        // Optional: Add a subtle scale effect for better "entrance" feel
                                        transform: `scale(${1.05 - (progress * 0.05)})`,
                                        mixBlendMode: 'normal' // Ensure standard blending (or 'screen'/'overlay' if they wanted artistic blend)
                                        // User said "giao thoa đè lên nhau" (interfere/overlap on top). 
                                        // Standard opacity fade of top layer achieves this visual of two images present.
                                    }}
                                />
                            </>
                        );
                    }

                    // Fallback for non-drag transition (simple fade)
                    return featuredMovies.map((movie, index) => (
                        <img
                            key={movie.id}
                            src={movie.displayBackdrop}
                            alt={movie.title}
                            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                    ));

                })()}
            </div>

            {/* Mobile Background - Blurred backdrop */}
            <div className="absolute inset-0 md:hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" />
                {featuredMovies.map((movie, index) => {
                    let opacity = 0;

                    // Logic for blending (reduced max opacity for mobile bg)
                    if (isDragging && dragOffset !== 0) {
                        const width = containerRef.current?.offsetWidth || 1;
                        const progress = Math.min(Math.abs(dragOffset) / width, 1);

                        if (index === activeIndex) opacity = (1 - progress) * 0.3; // Max 0.3

                        if (dragOffset > 0) {
                            const prevIndex = (activeIndex - 1 + featuredMovies.length) % featuredMovies.length;
                            if (index === prevIndex) opacity = progress * 0.3;
                        }

                        if (dragOffset < 0) {
                            const nextIndex = (activeIndex + 1) % featuredMovies.length;
                            if (index === nextIndex) opacity = progress * 0.3;
                        }
                    } else {
                        opacity = index === activeIndex ? 0.3 : 0;
                    }

                    return (
                        <img
                            key={`mobile-bg-${movie.id}`}
                            src={movie.displayBackdrop}
                            alt=""
                            className={`absolute inset-0 w-full h-full object-cover object-center blur-2xl scale-110 transition-opacity duration-700 ease-in-out ${isDragging ? 'transition-none duration-0' : ''
                                }`}
                            style={{ opacity }}
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                    );
                })}
            </div>

            {/* Gradient Overlays - Desktop */}
            <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black via-black/70 to-transparent" />

            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />

            {/* Top vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

            {/* Halftone Dot Shading Layer */}
            <div
                className="absolute inset-0 pointer-events-none z-[5]"
                style={{
                    // Pattern: Fine halftone dots (simulating print/texture)
                    backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.4) 1px, transparent 1px), radial-gradient(circle, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
                    backgroundSize: '4px 4px, 4px 4px',
                    backgroundPosition: '0 0, 2px 2px', // Offset for denser texture

                    // Blend: Hard-light or Overlay to interact with image colors/luminance
                    mixBlendMode: 'overlay',
                    opacity: 0.4, // Visible texture

                    // Mask: Depth mask (Background strong, Center/Subject lighter)
                    maskImage: `radial-gradient(circle at 60% 50%, transparent 0%, black 100%)`,
                    WebkitMaskImage: `radial-gradient(circle at 60% 50%, transparent 0%, black 100%)`,
                }}
            />



            {/* Content Container */}
            <div className="relative w-full h-full flex flex-col md:flex-row items-center md:items-end justify-center md:justify-start pt-20 md:pt-0 pb-16 md:pb-12 lg:pb-16 px-4 md:px-8 lg:px-12 2xl:px-16">
                {/* Mobile/Tablet: Centered Poster + Info Below */}
                <div className="md:hidden flex flex-col items-center text-center space-y-4 max-w-sm w-full">
                    {/* Poster Card - Mobile */}
                    <div
                        className={`relative w-52 h-80 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                            }`}
                    >
                        <img
                            src={activeMovie.displayPoster}
                            alt={activeMovie.title}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        <div className="absolute inset-0 ring-1 ring-white/10 rounded-xl" />
                    </div>

                    {/* Logo + Title - Mobile */}
                    <div
                        className={`flex flex-col items-center gap-2 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        {activeMovie.logoUrl ? (
                            <>
                                <NavigationLink
                                    href={`/movies/${activeMovie.externalId || activeMovie.id}`}
                                    className="block transition-all duration-300 hover:scale-105 hover:brightness-110"
                                >
                                    <img
                                        src={activeMovie.logoUrl}
                                        alt={activeMovie.title}
                                        className="max-h-16 sm:max-h-20 w-auto object-contain drop-shadow-lg cursor-pointer"
                                        loading="eager"
                                    />
                                </NavigationLink>
                                <h2 className="text-sm sm:text-base font-medium text-gray-400">
                                    {activeMovie.title}
                                </h2>
                            </>
                        ) : (
                            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                                {activeMovie.title}
                            </h1>
                        )}
                    </div>

                    {/* Description - Mobile (shorter) */}
                    <p
                        className={`text-gray-300 text-sm sm:text-base line-clamp-2 px-2 transition-all duration-500 delay-75 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        {activeMovie.description}
                    </p>

                    {/* Metadata Pills - Mobile */}
                    {/* Metadata Pills - Mobile */}
                    <div
                        className={`flex flex-col items-center gap-3 transition-all duration-500 delay-100 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                            }`}
                    >
                        {/* Row 1: Tech Specs */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {/* IMDb Badge */}
                            <span className="flex items-center gap-1.5 px-2 py-0.5 border border-yellow-500/60 rounded text-xs font-bold bg-black/40 text-white">
                                <span className="text-[#f5c518]">IMDb</span>
                                <span>{activeMovie.rating}</span>
                            </span>

                            {/* Quality Badge - 4K style */}
                            <span className="px-2 py-0.5 bg-[#f3d677] rounded text-black text-xs font-extrabold">
                                {activeMovie.quality}
                            </span>

                            {/* Age Rating */}
                            <span className="px-2 py-0.5 bg-white rounded text-black text-xs font-bold">
                                {activeMovie.ageRating || 'T16'}
                            </span>

                            {/* Year */}
                            <span className="px-2 py-0.5 border border-white/40 rounded text-gray-200 text-xs font-medium">
                                {activeMovie.year}
                            </span>
                            {/* Duration */}
                            <span className="px-2 py-0.5 border border-white/40 rounded text-gray-200 text-xs font-medium">
                                {activeMovie.duration || '2h 15m'}
                            </span>
                        </div>

                        {/* Row 2: Genres */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {activeMovie.genre.split(',').map((g) => (
                                <span key={g} className="px-3 py-1 bg-[#1f1f1f]/80 backdrop-blur-sm rounded-md text-gray-300 text-xs border border-white/5">
                                    {g.trim()}
                                </span>
                            ))}
                        </div>
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
                <div className="hidden md:flex w-full items-end justify-between gap-4 lg:gap-8 xl:gap-10">
                    {/* Left side - Movie info and CTA */}
                    <div className="max-w-xl md:max-w-lg lg:max-w-xl flex-shrink">
                        {/* Logo + Title Section */}
                        <div
                            className={`mb-3 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            {activeMovie.logoUrl ? (
                                <div className="flex flex-col items-start">
                                    <NavigationLink
                                        href={`/movies/${activeMovie.externalId || activeMovie.id}`}
                                        className="block transition-all duration-300 hover:scale-105 hover:brightness-110"
                                    >
                                        <img
                                            src={activeMovie.logoUrl}
                                            alt={activeMovie.title}
                                            className="max-h-16 lg:max-h-24 w-auto object-contain object-left drop-shadow-xl cursor-pointer"
                                            loading="eager"
                                        />
                                    </NavigationLink>
                                    <h2 className="text-sm lg:text-base font-medium text-gray-400 mt-2">
                                        {activeMovie.title}
                                    </h2>
                                </div>
                            ) : (
                                <h1 className="movie-title-logo">
                                    {activeMovie.title}
                                </h1>
                            )}
                        </div>

                        {/* Description with transition */}
                        <p
                            className={`text-gray-300 text-sm md:text-xs lg:text-sm mb-4 line-clamp-2 md:max-w-md lg:max-w-lg transition-all duration-500 delay-75 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            {activeMovie.description}
                        </p>

                        {/* Metadata Pills */}
                        <div
                            className={`flex flex-col items-start gap-3 mb-6 transition-all duration-500 delay-100 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            {/* Row 1: Tech Specs */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* IMDb Badge */}
                                <span className="flex items-center gap-1.5 px-2 py-0.5 border border-yellow-500/60 rounded text-sm font-bold bg-black/40 text-white shadow-sm">
                                    <span className="text-[#f5c518]">IMDb</span>
                                    <span>{activeMovie.rating}</span>
                                </span>

                                {/* Quality Badge - 4K style */}
                                <span className="px-2 py-0.5 bg-[#f3d677] rounded text-black text-sm font-extrabold shadow-sm">
                                    {activeMovie.quality}
                                </span>

                                {/* Age Rating */}
                                <span className="px-2 py-0.5 bg-white rounded text-black text-sm font-bold shadow-sm">
                                    {activeMovie.ageRating || 'T16'}
                                </span>

                                {/* Year */}
                                <span className="px-2 py-0.5 border border-white/40 rounded text-gray-200 text-sm font-medium shadow-sm">
                                    {activeMovie.year}
                                </span>

                                {/* Duration */}
                                <span className="px-2 py-0.5 border border-white/40 rounded text-gray-200 text-sm font-medium shadow-sm">
                                    {activeMovie.duration || '2h 15m'}
                                </span>
                            </div>

                            {/* Row 2: Genres */}
                            <div className="flex flex-wrap items-center gap-2">
                                {activeMovie.genre.split(',').map((g) => (
                                    <span key={g} className="px-3 py-1.5 bg-[#1f1f1f]/80 backdrop-blur-sm rounded-md text-gray-300 text-xs font-medium border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                                        {g.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div
                            className={`flex gap-3 transition-all duration-500 delay-150 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                                }`}
                        >
                            <NavigationLink
                                href={`/watch/${activeMovie.externalId || activeMovie.id}`}
                                className="inline-flex items-center gap-2 px-6 lg:px-8 py-2 md:py-2.5 bg-white text-black font-bold text-xs md:text-sm rounded hover:bg-gray-200 transition-all active:scale-95"
                            >
                                <Play className="w-5 h-5 fill-black" />
                                <span>Play</span>
                            </NavigationLink>
                            <NavigationLink
                                href={`/movies/${activeMovie.externalId || activeMovie.id}`}
                                className="inline-flex items-center gap-2 px-4 lg:px-5 py-2 md:py-2.5 bg-gray-500/40 hover:bg-gray-500/60 text-white font-semibold text-xs md:text-sm rounded backdrop-blur-sm transition-all active:scale-95"
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
                                className={`md:block ${index >= 3 ? 'hidden lg:block' : ''} ${index >= 4 ? 'hidden xl:block' : ''} flex-shrink-0 w-12 h-8 md:w-14 md:h-9 lg:w-16 lg:h-10 xl:w-20 xl:h-12 rounded-md lg:rounded-lg overflow-hidden transition-all duration-300 ${index === activeIndex
                                    ? 'ring-2 ring-white scale-105 lg:scale-110 shadow-lg shadow-black/50'
                                    : 'opacity-50 hover:opacity-80 hover:scale-105'
                                    }`}
                                aria-label={`View ${movie.title}`}
                            >
                                <img
                                    src={movie.displayBackdrop.replace('/original/', '/w500/')}
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
                                className={`hidden xl:block flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden transition-all duration-300 ${index + 4 === activeIndex
                                    ? 'ring-2 ring-white scale-110 shadow-lg shadow-black/50'
                                    : 'opacity-50 hover:opacity-80 hover:scale-105'
                                    }`}
                                aria-label={`View ${movie.title}`}
                            >
                                <img
                                    src={movie.displayBackdrop.replace('/original/', '/w500/')}
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
