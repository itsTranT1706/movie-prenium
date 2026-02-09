'use client';

import { useState, useEffect, useRef } from 'react';
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
    externalId?: string;
    seasons: Season[];
    currentSeasonId?: string;
    currentEpisodeId?: string;
    showSubtitleToggle?: boolean;
    showAutoPlay?: boolean;
    basePath?: 'watch' | 'movies';
    mediaType?: 'movie' | 'tv';
    movieTitle?: string;
    backdropUrl?: string;
}

export function EpisodeSelector({
    movieId,
    externalId,
    seasons,
    currentSeasonId,
    currentEpisodeId,
    showSubtitleToggle = false,
    showAutoPlay = false,
    mediaType = 'tv',
    movieTitle,
    backdropUrl,
}: EpisodeSelectorProps) {
    const [selectedSeasonId, setSelectedSeasonId] = useState(
        currentSeasonId || seasons[0]?.id
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubtitleEnabled, setIsSubtitleEnabled] = useState(false);
    const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedSeason = seasons.find((s) => s.id === selectedSeasonId);
    const watchId = externalId || movieId;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isDropdownOpen]);

    if (!seasons.length) return null;

    // Special rendering for 'movie' type - Card Style
    if (mediaType === 'movie') {
        return (
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Các bản chiếu</h3>
                <div className="flex flex-wrap gap-4">
                    {seasons.map((season) => {
                        // Simplify: usually 1 episode per season/server for movies or 1 global season.
                        // If multiple episodes exist (weird for movie), we take the first one.
                        const firstEp = season.episodes[0];
                        if (!firstEp) return null;

                        const href = `/watch/${watchId}?server=${season.id}&episode=${firstEp.id}`;

                        return (
                            <Link
                                key={season.id}
                                href={href}
                                className="relative overflow-hidden rounded-xl bg-[#1e1e1e] border border-white/10 group hover:border-white/30 transition-all w-full max-w-[300px]"
                            >
                                <div className="aspect-[2.2/1] relative">
                                    {/* Background Image with Overlay */}
                                    <div className="absolute inset-0 z-0">
                                        {backdropUrl && (
                                            <img
                                                src={backdropUrl}
                                                alt=""
                                                className="w-full h-full object-cover opacity-50"
                                            />
                                        )}
                                        {/* Strong gradient from left to create the "card" look */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#202020] via-[#202020]/95 to-transparent" />
                                    </div>

                                    <div className="relative z-10 p-4 h-full flex flex-col justify-center items-start">
                                        {/* Badge */}
                                        <div className="flex items-center gap-1.5 mb-2 px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-[10px] font-semibold text-indigo-200">
                                            <MessageSquare className="w-3 h-3" />
                                            <span>
                                                {(() => {
                                                    const name = season.name.toLowerCase();
                                                    if (name.includes('lồng tiếng') || name.includes('long tieng')) return 'Lồng tiếng';
                                                    if (name.includes('thuyết minh') || name.includes('tm')) return 'Thuyết minh';
                                                    return 'Vietsub';
                                                })()}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h4 className="text-sm font-bold text-white mb-3 line-clamp-1 pr-8">
                                            {movieTitle || 'Movie'}
                                        </h4>

                                        {/* Fake Button */}
                                        <span className="px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded hover:bg-gray-200 transition-colors">
                                            Xem bản này
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Default renderings for TV/Series
    return (
        <div>
            {/* Header with Season Selector and Subtitle Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                {/* Left: Season Dropdown + Subtitle Toggle */}
                <div className="flex items-center gap-3">
                    {/* Season Dropdown */}
                    {seasons.length > 1 ? (
                        <div ref={dropdownRef} className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded text-white text-sm hover:bg-white/10 transition-colors"
                            >
                                <span className="font-semibold">
                                    {selectedSeason?.name || 'Server 1'}
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

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded shadow-xl z-50">
                                    {seasons.map((season) => (
                                        <button
                                            key={season.id}
                                            onClick={() => {
                                                setSelectedSeasonId(season.id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`
                                                w-full text-left px-4 py-2.5 text-sm transition-colors
                                                ${selectedSeasonId === season.id
                                                    ? 'bg-white/10 text-white font-semibold'
                                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                }
                                            `}
                                        >
                                            {season.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded text-white text-sm">
                            <span className="font-semibold">
                                {selectedSeason?.name || 'Server 1'}
                            </span>
                        </div>
                    )}

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
                    // From detail page -> go to watch page
                    // From watch page -> stay on watch page with different episode
                    const href = `/watch/${watchId}?server=${selectedSeasonId}&episode=${episode.id}`;

                    return (
                        <Link
                            key={episode.id}
                            href={href}
                            className={`
                                flex items-center justify-center gap-2 px-4 py-2.5 rounded text-sm font-medium transition-colors
                                ${isActive
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
