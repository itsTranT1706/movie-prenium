'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Play, Info, Plus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { NavigationLink } from '@/shared/components/ui';

interface FeaturedMovie {
    id: string;
    externalId?: string;
    title: string;
    posterUrl: string;
    backdropUrl: string; // Used for background blur
    rating: number;
    year: number;
    quality: string;
    duration?: string;
    genre: string;
    description: string;
}

interface MobileHeroCarouselProps {
    movies: FeaturedMovie[];
}

export function MobileHeroCarousel({ movies }: MobileHeroCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Filter to top 10 max for the carousel
    const displayMovies = movies.slice(0, 10);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % displayMovies.length);
        setIsAutoPlaying(false);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + displayMovies.length) % displayMovies.length);
        setIsAutoPlaying(false);
    };

    // Auto-advance logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isAutoPlaying) {
            interval = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % displayMovies.length);
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [isAutoPlaying, displayMovies.length]);


    // Touch handling
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const minSwipeDistance = 40;

    const onTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
        setIsAutoPlaying(false); // Pause on interaction
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) {
            setIsAutoPlaying(true); // Resume even if no swipe was detected (just a tap)
            return;
        }

        const distance = touchStartX.current - touchEndX.current;
        if (distance > minSwipeDistance) handleNext();
        else if (distance < -minSwipeDistance) handlePrev();

        // Resume autoplay after interaction
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    // Calculate visible items for 3D effect
    const getVisibleItems = () => {
        const total = displayMovies.length;
        if (total === 0) return [];

        const center = activeIndex;
        // Map items with relative offset
        const itemsWithOffset = displayMovies.map((movie, index) => {
            let offset = index - center;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            return { ...movie, offset, originalIndex: index };
        });

        // Sort by depth (painters algo)
        return itemsWithOffset
            .filter(item => Math.abs(item.offset) <= 2) // Show center + 2 neighbors
            .sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset));
    };

    const activeMovie = displayMovies[activeIndex];

    if (!activeMovie) return null;

    return (
        <div className="relative w-full h-[75vh] overflow-hidden bg-black flex flex-col">
            {/* Background Blur */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 blur-2xl opacity-50 scale-110"
                    style={{ backgroundImage: `url(${activeMovie.posterUrl || activeMovie.backdropUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
            </div>

            {/* Carousel Container */}
            <div
                className="relative z-10 flex-1 flex items-center justify-center pt-20 pb-0"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="relative w-full h-full perspective-1000 flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                        {getVisibleItems().map((item) => {
                            const isCenter = item.offset === 0;
                            const isNear = Math.abs(item.offset) === 1;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={false}
                                    animate={{
                                        x: `${item.offset * 75}%`,
                                        scale: isCenter ? 1 : isNear ? 0.8 : 0.6,
                                        rotateY: -item.offset * 20,
                                        zIndex: isCenter ? 50 : 50 - Math.abs(item.offset),
                                        opacity: isCenter ? 1 : isNear ? 0.5 : 0.2,
                                        filter: isCenter ? 'blur(0px)' : 'blur(2px)',
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className={cn(
                                        "absolute w-[65%] sm:w-[55%] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] origin-center will-change-transform bg-black border border-white/10",
                                        isCenter ? "ring-1 ring-white/20" : "pointer-events-none"
                                    )}
                                    onClick={() => {
                                        if (item.offset < 0) handlePrev();
                                        if (item.offset > 0) handleNext();
                                    }}
                                >
                                    <img
                                        src={item.posterUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Dots Indicator - Bottom */}
            <div className="relative z-30 flex justify-center gap-2 pb-4">
                {displayMovies.map((_, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => {
                            setActiveIndex(idx);
                            setIsAutoPlaying(false);
                        }}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            idx === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                        )}
                        whileTap={{ scale: 0.8 }}
                    />
                ))}
            </div>

            {/* Active Movie Info */}
            <div className="relative z-20 px-4 pb-8 text-center space-y-3">
                <motion.div
                    key={activeMovie.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-2xl font-bold text-white mb-1.5 line-clamp-2 leading-tight drop-shadow-lg">
                        {activeMovie.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-xs font-medium text-gray-200">
                        <span className="px-1.5 py-0.5 bg-[#f3d677] text-black font-extrabold rounded-sm text-[10px]">
                            {activeMovie.quality}
                        </span>
                        <span>{activeMovie.year}</span>
                        <span className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
                        <span className="line-clamp-1 max-w-[120px]">{activeMovie.genre.split(',')[0]}</span>
                        <span className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
                        <span className="flex items-center gap-1 text-green-400 font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            {activeMovie.rating}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto">
                        <NavigationLink
                            href={`/watch/${activeMovie.externalId || activeMovie.id}`}
                            className="flex-1 h-10 flex items-center justify-center gap-2 bg-white text-black rounded-lg font-bold text-sm shadow-xl active:scale-95 transition-transform"
                        >
                            <Play className="w-4 h-4 fill-black" />
                            <span>Play</span>
                        </NavigationLink>

                        <NavigationLink
                            href={`/movies/${activeMovie.externalId || activeMovie.id}`}
                            className="flex-1 h-10 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-lg font-semibold text-sm active:scale-95 transition-transform"
                        >
                            <Info className="w-4 h-4" />
                            <span>Details</span>
                        </NavigationLink>

                        <button className="h-10 w-10 flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-lg active:scale-95 transition-transform">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
