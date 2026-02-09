'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Maximize, Minimize, ChevronLeft, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NavigationLink } from '@/shared/components/ui/navigation-link';

interface MobileWatchPlayerProps {
    videoUrl: string;
    title: string;
    posterUrl?: string;
    movieId: string;
}

export function MobileWatchPlayer({ videoUrl, title, posterUrl, movieId }: MobileWatchPlayerProps) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { scrollY } = useScroll();

    // Parallax & Scale effects
    const y = useTransform(scrollY, [0, 200], [0, 100]);
    const scale = useTransform(scrollY, [0, 200], [1, 0.95]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);
    const borderRadius = useTransform(scrollY, [0, 200], [0, 16]);

    // Header overlay opacity (show when scrolled down)
    const headerOpacity = useTransform(scrollY, [100, 200], [0, 1]);

    const springScale = useSpring(scale, { stiffness: 300, damping: 30 });
    const springY = useSpring(y, { stiffness: 300, damping: 30 });

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className="relative w-full z-50">
            {/* Sticky Header Overlay */}
            <motion.div
                style={{ opacity: headerOpacity }}
                className="fixed top-0 left-0 right-0 h-14 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-between px-4 border-b border-white/5"
            >
                <NavigationLink href={`/movies/${movieId}`} className="p-2 -ml-2 text-white flex items-center">
                    <ChevronLeft className="w-6 h-6" />
                </NavigationLink>
                <div className="flex-1 text-center truncate px-2">
                    <span className="text-white text-sm font-medium truncate">{title}</span>
                </div>
                <button className="p-2 -mr-2 text-white">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </motion.div>

            {/* Video Container */}
            <div className="sticky top-0 w-full bg-black z-40" ref={containerRef}>
                <motion.div
                    style={{
                        scale: isFullscreen ? 1 : springScale,
                        y: isFullscreen ? 0 : 0,
                        borderRadius: isFullscreen ? 0 : 0,
                    }}
                    className="relative w-full aspect-video overflow-hidden shadow-2xl origin-top"
                >
                    <iframe
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={title}
                    />

                    {/* Gradient Overlay for controls visibility */}
                    {!isFullscreen && (
                        <>
                            <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                            <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        </>
                    )}

                    {/* Controls */}
                    <div className="absolute top-2 left-2 z-50">
                        <NavigationLink
                            href={`/movies/${movieId}`}
                            className="p-2 text-white/90 hover:text-white drop-shadow-md bg-black/20 rounded-full backdrop-blur-sm flex items-center justify-center"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </NavigationLink>
                    </div>

                    <div className="absolute bottom-2 right-2 z-50">
                        <button
                            onClick={toggleFullscreen}
                            className="p-2 text-white/90 hover:text-white drop-shadow-md bg-black/20 rounded-full backdrop-blur-sm"
                        >
                            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
