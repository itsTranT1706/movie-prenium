'use client';

import { useState, useRef, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';

interface CurvedVideoPlayerProps {
    videoUrl: string;
    title: string;
    posterUrl?: string; // For ambient glow effect
}

export function CurvedVideoPlayer({ videoUrl, title, posterUrl }: CurvedVideoPlayerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        try {
            if (!document.fullscreenElement) {
                // Try different fullscreen methods for browser compatibility
                if (containerRef.current.requestFullscreen) {
                    await containerRef.current.requestFullscreen();
                } else if ((containerRef.current as any).webkitRequestFullscreen) {
                    await (containerRef.current as any).webkitRequestFullscreen();
                } else if ((containerRef.current as any).mozRequestFullScreen) {
                    await (containerRef.current as any).mozRequestFullScreen();
                } else if ((containerRef.current as any).msRequestFullscreen) {
                    await (containerRef.current as any).msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if ((document as any).webkitExitFullscreen) {
                    await (document as any).webkitExitFullscreen();
                } else if ((document as any).mozCancelFullScreen) {
                    await (document as any).mozCancelFullScreen();
                } else if ((document as any).msExitFullscreen) {
                    await (document as any).msExitFullscreen();
                }
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    };
    return (
        <div ref={containerRef} className="relative w-full group flex justify-center">
            {/* SVG Clip Path Definition - Curved bottom (lõm từ trên xuống) */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <clipPath id="curved-video-clip" clipPathUnits="objectBoundingBox">
                        <path d="M 0.03,0 
                                 L 0.97,0 
                                 Q 1,0 1,0.03 
                                 L 1,0.92
                                 Q 1,0.95 0.97,0.95
                                 Q 0.5,0.88 0.03,0.95
                                 Q 0,0.95 0,0.92
                                 L 0,0.03 
                                 Q 0,0 0.03,0 Z"
                        />
                    </clipPath>
                </defs>
            </svg>

            {/* Main Wrapper - Cinematic Container (2.1:1 Aspect Ratio) */}
            <div
                className="relative overflow-hidden flex items-center justify-center bg-black/40"
                style={{
                    width: isFullscreen ? '100vw' : '100%',
                    maxWidth: 'none',
                    aspectRatio: isFullscreen ? 'auto' : '2.1/1',
                    height: isFullscreen ? '100vh' : 'auto',
                }}
            >
                {/* LAYER 1: Cinematic Ambient Backdrop (Blur) */}
                {!isFullscreen && posterUrl && (
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center opacity-60 blur-3xl scale-110 pointer-events-none transition-opacity duration-700"
                        style={{
                            backgroundImage: `url(${posterUrl})`,
                        }}
                    >
                        {/* Overlay to darken slightly so video pops */}
                        <div className="absolute inset-0 bg-black/20" />
                    </div>
                )}

                {/* Outer glow effect - Apple style */}
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent rounded-[24px] sm:rounded-[32px] blur-xl sm:blur-2xl z-0" />

                {/* LAYER 2: Video Player (16:9) - Centered & Uncropped */}
                <div
                    className="relative z-10 w-full rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl"
                    style={{
                        aspectRatio: '16/9',
                        height: isFullscreen ? '100%' : '100%',
                        maxHeight: '100%', // Ensure it fits within the 2.1:1 container
                        width: 'auto', // Allow width to adjust based on height standard
                        margin: '0 auto',
                        clipPath: isFullscreen ? 'none' : 'url(#curved-video-clip)',
                    }}
                >
                    <div className="relative w-full h-full bg-black">
                        <iframe
                            ref={iframeRef}
                            src={videoUrl}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={title}
                        />

                        {/* LAYER 3: Controls Overlay */}
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <button
                                onClick={toggleFullscreen}
                                className="relative p-2 sm:p-3 rounded-xl sm:rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 active:bg-white/25 transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                                style={{
                                    boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.3), 0 4px 16px rgba(0, 0, 0, 0.3)',
                                }}
                                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                            >
                                {isFullscreen ? (
                                    <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                ) : (
                                    <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Inner glass frame - subtle highlight for video */}
                    {!isFullscreen && (
                        <div
                            className="absolute inset-[1.5px] sm:inset-[2px] pointer-events-none rounded-[22px] sm:rounded-[30px] z-20"
                            style={{
                                clipPath: 'url(#curved-video-clip)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
