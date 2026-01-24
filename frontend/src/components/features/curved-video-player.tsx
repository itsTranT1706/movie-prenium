'use client';

import { useState, useRef, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';

interface CurvedVideoPlayerProps {
    videoUrl: string;
    title: string;
}

export function CurvedVideoPlayer({ videoUrl, title }: CurvedVideoPlayerProps) {
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
        <div ref={containerRef} className="relative w-full group">
            {/* SVG Clip Path Definition - Curved bottom (lõm từ trên xuống) */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <clipPath id="curved-video-clip" clipPathUnits="objectBoundingBox">
                        <path d="M 0.024,0 
                                 L 0.976,0 
                                 Q 1,0 1,0.024 
                                 L 1,0.95
                                 Q 0.5,0.88 0,0.95
                                 L 0,0.024 
                                 Q 0,0 0.024,0 Z" 
                        />
                    </clipPath>
                </defs>
            </svg>

            {/* Video Container with Apple Glass Effect */}
            <div className="relative">
                {/* Outer glow effect - Apple style */}
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent rounded-[24px] sm:rounded-[32px] blur-xl sm:blur-2xl" />
                
                {/* Glass morphism container */}
                <div 
                    className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-black"
                    style={{
                        clipPath: isFullscreen ? 'none' : 'url(#curved-video-clip)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    }}
                >
                    {/* Video iframe - Extended height to show controls */}
                    <div 
                        className="relative bg-black" 
                        style={{ 
                            paddingBottom: isFullscreen ? '0' : '62%',
                            height: isFullscreen ? '100vh' : 'auto'
                        }}
                    >
                        {/* Scale wrapper - scale horizontally to remove side gaps */}
                        <div 
                            className="absolute inset-0 origin-center"
                            style={{
                                transform: isFullscreen ? 'none' : 'scaleX(1.2)'
                            }}
                        >
                            <iframe 
                                ref={iframeRef}
                                src={videoUrl}
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={title}
                            />
                        </div>

                        {/* Glass Control Button - Show on hover (desktop) or always show (mobile) */}
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10">
                            {/* Fullscreen Button */}
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
                </div>

                {/* Glass border frame overlay - ONLY on edges */}
                <div 
                    className="absolute inset-0 pointer-events-none rounded-[24px] sm:rounded-[32px]"
                    style={{
                        clipPath: isFullscreen ? 'none' : 'url(#curved-video-clip)',
                        background: isFullscreen ? 'none' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 20%, transparent 80%, rgba(255, 255, 255, 0.08) 100%)',
                        border: isFullscreen ? 'none' : '1px sm:1.5px solid rgba(255, 255, 255, 0.25)',
                        boxShadow: isFullscreen ? 'none' : 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3)',
                    }}
                />
                
                {/* Inner glass frame - subtle highlight */}
                {!isFullscreen && (
                    <div 
                        className="absolute inset-[1.5px] sm:inset-[2px] pointer-events-none rounded-[22px] sm:rounded-[30px]"
                        style={{
                            clipPath: 'url(#curved-video-clip)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    />
                )}
            </div>
        </div>
    );
}
