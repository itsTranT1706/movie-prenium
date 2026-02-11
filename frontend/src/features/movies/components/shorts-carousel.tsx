'use client';

import { useState, useEffect } from 'react';
import { youtubeService, YoutubeShort } from '../api/youtube.service';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/components/ui/carousel';
import { Play, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShortsCarouselProps {
    mode?: 'random' | 'related';
    title: string;
    query?: string;
    className?: string;
}

export function ShortsCarousel({ mode = 'random', title, query, className }: ShortsCarouselProps) {
    const [shorts, setShorts] = useState<YoutubeShort[]>([]);
    const [selectedShort, setSelectedShort] = useState<YoutubeShort | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchShorts = async () => {
            try {
                setIsLoading(true);
                const response = await youtubeService.getShorts(mode, query);
                // console.log('Shorts API Response:', response); // Debug log
                if (mounted && Array.isArray(response)) {
                    // console.log('Setting shorts:', response.length); // Debug log
                    setShorts(response as unknown as YoutubeShort[]);
                }
            } catch (error) {
                console.error('Failed to fetch shorts:', error);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        fetchShorts();

        return () => {
            mounted = false;
        };
    }, [mode, query]);

    if (!isLoading && !shorts?.length) return null;

    return (
        <section className={cn("py-6", className)}>
            <div className="container px-0 relative">
                {/* Header - Sleek & Minimal */}
                <div className="flex items-center justify-between mb-4 px-4 md:px-0">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                        <span className="w-1 h-6 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
                        <span className="text-shadow-sm">{title}</span>
                    </h2>
                </div>

                <div className="relative group/carousel px-4 md:px-0">
                    <Carousel
                        opts={{
                            align: 'start',
                            dragFree: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-3 pb-4">
                            {isLoading
                                ? Array.from({ length: 4 }).map((_, i) => (
                                    <CarouselItem key={i} className="pl-3 basis-[120px] sm:basis-[140px]">
                                        <div className="aspect-[9/16] rounded-xl bg-zinc-900/50 animate-pulse border border-white/5" />
                                    </CarouselItem>
                                ))
                                : shorts.map((short) => (
                                    <CarouselItem key={short.id} className="pl-3 basis-[125px] sm:basis-[140px] md:basis-[160px]">
                                        <div
                                            className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group/card bg-zinc-950 border border-white/5 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,0,0,0.15)] hover:scale-[1.02]"
                                            onClick={() => setSelectedShort(short)}
                                        >
                                            <img
                                                src={short.thumbnail}
                                                alt={short.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                            />

                                            {/* Cinematic Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity" />

                                            {/* Play Icon - Refined Glassmorphism */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 scale-90 group-hover/card:scale-100">
                                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg group-hover/card:bg-red-600/90 group-hover/card:border-red-500 transition-colors">
                                                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                                                </div>
                                            </div>

                                            {/* Content - Compact & Clean */}
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <h3 className="text-white text-[13px] font-medium leading-snug line-clamp-2 drop-shadow-md mb-1 min-h-[2.5em]">
                                                    {short.title}
                                                </h3>
                                                {/* Views/Channel - Optional if needed, kept minimal */}
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                        </CarouselContent>
                        {/* Navigation - Hidden on mobile, visible on hover desktop */}
                        <CarouselPrevious className="hidden md:flex left-[-10px] w-8 h-8 opacity-0 group-hover/carousel:opacity-100 transition-all bg-black/50 border-white/10 hover:bg-red-600 hover:border-red-600" />
                        <CarouselNext className="hidden md:flex right-[-10px] w-8 h-8 opacity-0 group-hover/carousel:opacity-100 transition-all bg-black/50 border-white/10 hover:bg-red-600 hover:border-red-600" />
                    </Carousel>
                </div>
            </div>

            {/* Video Modal - Unchanged */}
            {selectedShort && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedShort(null)}
                >
                    <div
                        className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedShort(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-colors border border-white/5"
                        >
                            <X size={20} />
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedShort.id}?autoplay=1&rel=0&modestbranding=1&loop=1&playlist=${selectedShort.id}`}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            title={selectedShort.title}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
