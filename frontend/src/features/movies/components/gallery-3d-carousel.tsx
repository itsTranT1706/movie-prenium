'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock, Play, VolumeX, Volume2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import Image from 'next/image';

export interface GalleryItem {
    id: string;
    type: 'video' | 'image';
    url: string;
    title?: string;
    rating?: number;
    duration?: string;
    category?: string;
    year?: string;
}

interface Gallery3DCarouselProps {
    items: GalleryItem[];
}

export function Gallery3DCarousel({ items }: Gallery3DCarouselProps) {
    // Ensure we have enough items for the effect by cloning if needed
    const displayItems = items.length === 0 ? [] : items.length < 5
        ? [...items, ...items, ...items, ...items, ...items].slice(0, Math.max(5, items.length * 3)) // minimal cloning to get 5+
        : items;

    // Normalize IDs for cloning
    const normalizedItems = displayItems.map((item, idx) => ({
        ...item,
        uniqueId: `${item.id}-${idx}`
    }));

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    // Auto-cycle if video is not playing
    // useEffect(() => {
    //     if (isPlaying) return;
    //     const interval = setInterval(() => {
    //         handleNext();
    //     }, 5000);
    //     return () => clearInterval(interval);
    // }, [activeIndex, isPlaying]);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % normalizedItems.length);
        setIsPlaying(false);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + normalizedItems.length) % normalizedItems.length);
        setIsPlaying(false);
    };

    // Touch swipe support for mobile
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
    };

    const getVisibleItems = () => {
        const count = normalizedItems.length;
        if (count === 0) return [];

        const centerIndex = activeIndex;
        // Calculate offsets correctly for circular wrap
        const itemsWithOffset = normalizedItems.map((item, index) => {
            let offset = index - centerIndex;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;
            return { ...item, offset, index };
        });

        // Filter nearest 3 items and sort by z-index (painters algorithm)
        return itemsWithOffset
            .filter(item => Math.abs(item.offset) <= 1) // Only show center + 1 on each side
            .sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset)); // Render outer ones first
    };

    return (
        <div
            className="relative w-full h-[200px] lg:h-[280px] flex items-center justify-center py-2 perspective-500 overflow-visible mt-4 lg:mt-6 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Background blur effect for ambiance */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl transition-all duration-700 rounded-xl overflow-hidden"
                style={{ backgroundImage: `url(${normalizedItems[activeIndex]?.type === 'image' ? normalizedItems[activeIndex].url : normalizedItems[activeIndex].type === 'video' ? `https://img.youtube.com/vi/${getYouTubeId(normalizedItems[activeIndex].url)}/mqdefault.jpg` : ''})` }}
            />

            {/* Navigation Buttons */}
            <button
                onClick={handlePrev}
                className="absolute -left-6 z-40 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-all hover:scale-110"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={handleNext}
                className="absolute -right-6 z-40 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-all hover:scale-110"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Carousel Items */}
            <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {getVisibleItems().map((item) => {
                    const isCenter = item.offset === 0;
                    const offset = item.offset;

                    return (
                        <motion.div
                            key={item.uniqueId}
                            initial={false}
                            animate={{
                                scale: isCenter ? 1 : 0.65,
                                x: `${offset * 55}%`,
                                y: isCenter ? 0 : 8,
                                rotateY: -offset * 15,
                                zIndex: isCenter ? 50 : 30,
                                opacity: isCenter ? 1 : 0.55,
                            }}
                            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
                            className={cn(
                                "absolute w-[60%] sm:w-[55%] lg:w-[50%] aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black cursor-pointer origin-center will-change-transform",
                                isCenter ? "cursor-default ring-1 ring-white/20 brightness-100" : "cursor-pointer brightness-50"
                            )}
                            onClick={() => {
                                if (offset < 0) handlePrev();
                                if (offset > 0) handleNext();
                            }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Media Content */}
                            <div className="relative w-full h-full">
                                {item.type === 'video' ? (
                                    isCenter ? (
                                        <>
                                            <iframe
                                                src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${getYouTubeId(item.url)}`}
                                                title={item.title}
                                                className="w-full h-full pointer-events-none"
                                                allowFullScreen
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            />
                                            {/* Mute Toggle Button */}
                                            <button
                                                onClick={toggleMute}
                                                className="absolute top-2 left-2 z-40 p-1.5 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-all hover:scale-110"
                                            >
                                                {isMuted ? (
                                                    <VolumeX className="w-4 h-4" />
                                                ) : (
                                                    <Volume2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="relative w-full h-full group">
                                            <img
                                                src={`https://img.youtube.com/vi/${getYouTubeId(item.url)}/mqdefault.jpg`}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div className="w-full h-full select-none pointer-events-none">
                                        <img
                                            src={item.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover pointer-events-none"
                                            draggable={false}
                                            onContextMenu={(e) => e.preventDefault()}
                                        />
                                    </div>
                                )}

                                {/* Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

                                {/* Top Left - Duration/Time Tag */}
                                {item.duration && (
                                    <div className="absolute top-2 left-0 bg-[#22c55e] text-black text-[10px] font-bold px-2 py-0.5 rounded-r-full shadow-lg z-10">
                                        {item.duration}
                                    </div>
                                )}

                                {/* Top Right - Rating */}
                                {item.rating && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1 text-white text-shadow-sm font-bold z-10">
                                        <Star className="w-3 h-3 fill-[#22c55e] text-[#22c55e]" />
                                        <span className="text-xs">{item.rating.toFixed(1)}/10</span>
                                    </div>
                                )}

                                {/* Bottom Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                    <h3 className="text-sm font-bold text-white mb-0.5 line-clamp-1 text-shadow-md">
                                        {item.title || 'Movie Title'}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

// Helper to extract YouTube ID
function getYouTubeId(url: string) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
