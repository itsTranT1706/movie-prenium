'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, MessageSquare } from 'lucide-react';

interface Episode {
    id: string;
    number: number;
    title?: string;
}

interface Season {
    id: string;
    number: number;
    name: string;
    episodes: Episode[];
}

interface EpisodeSelectorProps {
    movieId: string;
    seasons: Season[];
    currentSeasonId?: string;
    currentEpisodeId?: string;
    showSubtitleToggle?: boolean;
    showAutoPlay?: boolean;
    basePath?: 'watch' | 'movies';
}

export function EpisodeSelector({
    movieId,
    seasons,
    currentSeasonId,
    currentEpisodeId,
    showSubtitleToggle = false,
    showAutoPlay = false,
    basePath = 'movies',
}: EpisodeSelectorProps) {
    const [selectedSeasonId, setSelectedSeasonId] = useState(
        currentSeasonId || seasons[0]?.id
    );
    const [isSubtitleEnabled, setIsSubtitleEnabled] = useState(false);
    const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);

    const selectedSeason = seasons.find((s) => s.id === selectedSeasonId);

    if (!seasons.length) return null;

    return (
        <div>
            {/* Header with Season Selector and Subtitle Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Left: Season Dropdown + Subtitle Toggle */}
                <div className="flex items-center gap-3">
                    {/* Season Dropdown */}
                    <div className="relative">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded text-white text-sm hover:bg-white/10 transition-colors">
                            <span className="font-semibold">
                                {selectedSeason?.name || 'Phần 1'}
                            </span>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Subtitle Toggle */}
                    {showSubtitleToggle && (
                        <button
                            onClick={() => setIsSubtitleEnabled(!isSubtitleEnabled)}
                            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Phụ đề</span>
                        </button>
                    )}
                </div>

                {/* Right: Auto Play Toggle (if needed) */}
                {showAutoPlay && (
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <span>Rút gọn</span>
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={isAutoPlayEnabled}
                                onChange={(e) => setIsAutoPlayEnabled(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-yellow-500 transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                        </div>
                    </label>
                )}
            </div>

            {/* Episode Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {selectedSeason?.episodes.map((episode) => {
                    const isActive = episode.id === currentEpisodeId;
                    const href =
                        basePath === 'watch'
                            ? `/watch/${movieId}?episode=${episode.id}`
                            : `/movies/${movieId}?episode=${episode.id}`;

                    return (
                        <Link
                            key={episode.id}
                            href={href}
                            className={`
                                flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-medium transition-colors
                                ${
                                    isActive
                                        ? 'bg-white text-black'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                }
                            `}
                        >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Tập {episode.number}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
