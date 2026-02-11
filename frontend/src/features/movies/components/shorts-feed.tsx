'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { youtubeService, YoutubeShort } from '../api/youtube.service';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth';
import Image from 'next/image';

interface ShortsFeedProps {
    initialShorts?: YoutubeShort[];
}

export function ShortsFeed({ initialShorts = [] }: ShortsFeedProps) {
    const [shorts, setShorts] = useState<YoutubeShort[]>(initialShorts);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLoading, setIsLoading] = useState(!initialShorts.length);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const hasInitialFetch = useRef(false);

    // Fetch more shorts function
    const fetchMoreShorts = useCallback(async () => {
        if (isFetchingMore) return;
        
        try {
            setIsFetchingMore(true);
            console.log('Fetching more shorts...');
            const response = await youtubeService.getShorts('random');
            console.log('More Shorts Response:', response);
            if (Array.isArray(response)) {
                setShorts(prev => {
                    // Filter out duplicates based on id
                    const existingIds = new Set(prev.map(s => s.id));
                    const newShorts = (response as unknown as YoutubeShort[]).filter(
                        s => !existingIds.has(s.id)
                    );
                    console.log('Adding', newShorts.length, 'new shorts');
                    return [...prev, ...newShorts];
                });
            }
        } catch (error) {
            console.error('Failed to fetch more shorts:', error);
        } finally {
            setIsFetchingMore(false);
        }
    }, [isFetchingMore]);

    // Initial fetch
    useEffect(() => {
        if (initialShorts.length > 0) {
            setShorts(initialShorts);
            setIsLoading(false);
            return;
        }

        if (hasInitialFetch.current) return;
        hasInitialFetch.current = true;

        const fetchShorts = async () => {
            try {
                console.log('Fetching initial shorts feed...');
                setIsLoading(true);
                const response = await youtubeService.getShorts('random');
                console.log('Initial Shorts Feed Response:', response);
                if (Array.isArray(response)) {
                    console.log('Setting shorts state with', response.length, 'items');
                    setShorts(response as unknown as YoutubeShort[]);
                } else {
                    console.error('Shorts feed response is not an array:', response);
                }
            } catch (error) {
                console.error('Failed to fetch shorts feed:', error);
            } finally {
                console.log('Finished fetching initial shorts feed');
                setIsLoading(false);
            }
        };

        fetchShorts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Prefetch more shorts when approaching the end
    useEffect(() => {
        // When user is at index N, and there are less than 3 items ahead, fetch more
        const remainingItems = shorts.length - currentIndex;
        
        if (remainingItems <= 3 && !isFetchingMore && shorts.length > 0) {
            console.log(`Prefetching: currentIndex=${currentIndex}, total=${shorts.length}, remaining=${remainingItems}`);
            fetchMoreShorts();
        }
    }, [currentIndex, shorts.length, isFetchingMore, fetchMoreShorts]);

    // Handle scroll snap intersection
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        if (!isNaN(index) && index !== currentIndex) {
                            setCurrentIndex(index);
                            // Reset playing state when scrolling to new video
                            setIsPlaying(true);
                        }
                    }
                });
            },
            {
                root: container,
                threshold: 0.6, // 60% of video visible
            }
        );

        const items = container.querySelectorAll('[data-index]');
        items.forEach((item) => observer.observe(item));

        return () => {
            items.forEach((item) => observer.unobserve(item));
            observer.disconnect();
        };
    }, [shorts, currentIndex]);

    // Toggle Play/Pause
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Toggle Mute
    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Toggle mute clicked, current state:', isMuted);
        setIsMuted(prev => !prev);
    };

    // Navigate to previous short
    const goToPrevious = () => {
        if (currentIndex > 0) {
            const container = containerRef.current;
            if (container) {
                const items = container.querySelectorAll('[data-index]');
                items[currentIndex - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // Navigate to next short
    const goToNext = () => {
        if (currentIndex < shorts.length - 1) {
            const container = containerRef.current;
            if (container) {
                const items = container.querySelectorAll('[data-index]');
                items[currentIndex + 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-black">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="h-[calc(100vh-64px)] w-full overflow-y-scroll snap-y snap-mandatory bg-black no-scrollbar flex items-center justify-center"
        >
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Volume Control - Fixed at top right */}
                <button 
                    onClick={toggleMute}
                    className="fixed top-20 md:top-24 right-4 md:right-8 z-30 p-3 md:p-4 bg-black/60 rounded-full backdrop-blur-md hover:bg-black/80 transition-all shadow-lg hover:scale-110 border-2 border-white/10"
                >
                    {isMuted ? (
                        <VolumeX size={28} className="text-white" />
                    ) : (
                        <Volume2 size={28} className="text-white" />
                    )}
                </button>

                {/* Navigation Buttons - Fixed on the right side (center) */}
                <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
                    {/* Navigation Up */}
                    <button
                        onClick={goToPrevious}
                        disabled={currentIndex === 0}
                        className={cn(
                            "p-3 md:p-4 bg-black/60 rounded-full backdrop-blur-md transition-all shadow-lg",
                            currentIndex === 0 
                                ? "opacity-30 cursor-not-allowed" 
                                : "hover:bg-black/80 hover:scale-110"
                        )}
                    >
                        <ChevronUp size={28} className="text-white" />
                    </button>
                    
                    {/* Navigation Down */}
                    <button
                        onClick={goToNext}
                        disabled={currentIndex === shorts.length - 1 && !isFetchingMore}
                        className={cn(
                            "p-3 md:p-4 bg-black/60 rounded-full backdrop-blur-md transition-all shadow-lg",
                            (currentIndex === shorts.length - 1 && !isFetchingMore)
                                ? "opacity-30 cursor-not-allowed" 
                                : "hover:bg-black/80 hover:scale-110"
                        )}
                    >
                        <ChevronDown size={28} className="text-white" />
                    </button>
                </div>

                {/* Shorts Container */}
                <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
                    {shorts.map((short, index) => {
                const isActive = index === currentIndex;

                return (
                    <div
                        key={short.id}
                        data-index={index}
                        className="relative w-full h-full snap-center flex items-center justify-center bg-black"
                    >
                        {/* Video Container - Centered and fit to screen */}
                        <div className="relative w-full h-full max-w-[500px] flex items-center justify-center bg-zinc-900">
                            {/* YouTube Iframe - Simple approach without API */}
                            {(Math.abs(currentIndex - index) <= 1) && (
                                <iframe
                                    key={`${short.id}-${isMuted}`}
                                    src={`https://www.youtube.com/embed/${short.id}?autoplay=${isActive && isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${short.id}&rel=0&modestbranding=1&playsinline=1`}
                                    className={cn(
                                        "w-full h-full",
                                        !isActive && "opacity-0"
                                    )}
                                    allow="autoplay; encrypted-media; picture-in-picture"
                                    title={short.title}
                                    style={{ pointerEvents: 'none' }}
                                />
                            )}

                            {/* Overlay Controls & Info */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 bg-gradient-to-b from-black/20 via-transparent to-black/80">
                                {/* Top: Empty space for cleaner look */}
                                <div className="pt-14 md:pt-4"></div>

                                {/* Center: Play/Pause Click Area (Invisible) */}
                                <div
                                    className="flex-1 w-full flex items-center justify-center cursor-pointer"
                                    onClick={togglePlay}
                                >
                                    {!isPlaying && isActive && (
                                        <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm animate-in zoom-in fade-in duration-200">
                                            <Play size={40} className="text-white fill-white ml-2" />
                                        </div>
                                    )}
                                </div>

                                {/* Bottom: Info & Actions */}
                                <div className="flex items-end justify-between pb-4 md:pb-8">
                                    {/* Info */}
                                    <div className="flex-1 mr-4 space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold border border-white/20">
                                                {short.channelTitle.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-white font-bold text-sm md:text-base drop-shadow-md">
                                                {short.channelTitle}
                                            </span>
                                            <button className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors">
                                                Daftar
                                            </button>
                                        </div>
                                        <h3 className="text-white text-sm md:text-base font-medium line-clamp-2 drop-shadow-md leading-snug">
                                            {short.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-300">
                                            <span>♫ Original Sound</span>
                                        </div>
                                    </div>

                                    {/* Right Sidebar Actions */}
                                    <div className="flex flex-col items-center gap-4 pb-2">
                                        <ActionBtn icon={<Heart size={28} className="fill-transparent hover:fill-red-500 hover:text-red-500 transition-colors" />} label="Like" />
                                        <ActionBtn icon={<MessageCircle size={28} />} label="Comment" />
                                        <ActionBtn icon={<Share2 size={28} />} label="Share" />

                                        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 overflow-hidden animate-[spin_5s_linear_infinite]">
                                            <Image
                                                src={short.thumbnail}
                                                alt="Disc"
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            
            {/* Loading indicator at the bottom when fetching more */}
            {isFetchingMore && (
                <div className="relative w-full h-full snap-center flex items-center justify-center bg-black">
                    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
                </div>
            </div>
        </div>
    );
}

function ActionBtn({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 bg-zinc-800/60 rounded-full group-hover:bg-zinc-700/80 transition-all backdrop-blur-sm">
                <div className="text-white group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
            <span className="text-xs font-medium text-white drop-shadow-md">{label}</span>
        </button>
    );
}
