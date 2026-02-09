'use client';

import { useState } from 'react';
import { Plus, Share2, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { MobileWatchPlayer } from './mobile-watch-player';
import { MobileWatchTabs } from './mobile-watch-tabs';
import { MobileWatchContent } from './mobile-watch-content';

interface MobileWatchLayoutProps {
    movie: any;
    seasons: any[];
    comments: any[];
    currentServerId?: string;
    currentEpisodeId?: string;
    videoUrl: string;
}

export function MobileWatchLayout({
    movie,
    seasons,
    comments,
    currentServerId,
    currentEpisodeId,
    videoUrl,
}: MobileWatchLayoutProps) {
    const [activeTab, setActiveTab] = useState('episodes');

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a] pb-20">
            {/* Player Section */}
            {/* Player Section */}
            <MobileWatchPlayer
                videoUrl={videoUrl}
                title={movie.title}
                posterUrl={movie.backdropUrl || movie.posterUrl}
                movieId={movie.externalId || movie.id}
            />

            {/* Info Section (Title & Metadata) */}
            <div className="px-4 py-4">
                <h1 className="text-2xl font-black text-white mb-3 leading-tight">{movie.title}</h1>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-6 mb-5">
                    <button className="flex flex-col items-center gap-1 min-w-[48px] text-gray-300 hover:text-white transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center group-active:scale-95 transition-transform">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium">Lưu</span>
                    </button>

                    <button
                        onClick={() => toast.info('Tính năng đang phát triển')}
                        className="flex flex-col items-center gap-1 min-w-[48px] text-gray-300 hover:text-white transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center group-active:scale-95 transition-transform">
                            <Share2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium">Chia sẻ</span>
                    </button>

                    <button
                        onClick={() => toast.info('Tính năng đang phát triển')}
                        className="flex flex-col items-center gap-1 min-w-[48px] text-gray-300 hover:text-white transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center group-active:scale-95 transition-transform">
                            <Flag className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium">Báo lỗi</span>
                    </button>
                </div>

                {/* Metadata Hierarchy */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mb-4">
                    {movie.rating && (
                        <span className="flex items-center gap-1 text-[#f5c518] font-black">
                            ★ {movie.rating.toFixed(1)} IMDb
                        </span>
                    )}
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    <span>{movie.duration} phút</span>
                    <span className="px-1.5 py-0.5 border border-gray-600 rounded text-[10px] text-gray-300 font-medium">
                        {movie.quality || 'FHD'}
                    </span>
                </div>

                {/* Genre Chips - Primary Highlight */}
                <div className="flex flex-wrap gap-2">
                    {movie.genres?.map((genre: string, index: number) => (
                        <span
                            key={genre}
                            className={`
                                px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm transition-all
                                ${index === 0
                                    ? 'bg-white/10 border border-white/40 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                                    : 'bg-zinc-800/50 border border-white/5 text-gray-400'
                                }
                            `}
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tabs Section */}
            <MobileWatchTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content Section */}
            <div className="flex-1">
                <MobileWatchContent
                    activeTab={activeTab}
                    movie={movie}
                    seasons={seasons}
                    currentSeasonId={currentServerId}
                    currentEpisodeId={currentEpisodeId}
                    comments={comments}
                />
            </div>
        </div>
    );
}
