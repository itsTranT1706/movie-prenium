'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface EpisodeTabsProps {
    movieId: string;
    externalId?: string;
    seasons: Season[];
    currentSeasonId?: string;
    currentEpisodeId?: string;
}

export function EpisodeTabs({
    movieId,
    externalId,
    seasons,
    currentSeasonId,
    currentEpisodeId,
}: EpisodeTabsProps) {
    const [selectedSeasonId, setSelectedSeasonId] = useState(
        currentSeasonId || seasons[0]?.id
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedSeason = seasons.find((s) => s.id === selectedSeasonId);
    const watchId = externalId || movieId;

    // Check scroll position
    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    };

    useEffect(() => {
        checkScroll();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
            return () => {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [selectedSeasonId]);

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

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 300;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (!seasons.length) return null;

    return (
        <div className="relative mt-0.5 z-10">

            <div
                className="w-full mx-auto relative z-10"
                style={{ maxWidth: '75%' }}
            >
                {/* Curved container that overlaps video */}
                <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-t-[2rem] border-t-2 border-x-2 border-white/10 shadow-2xl">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-t-[2rem] pointer-events-none" />

                    <div className="relative px-6 py-5">
                        {/* Header with Season Selector */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* Season Dropdown */}
                                {seasons.length > 1 ? (
                                    <div ref={dropdownRef} className="relative">
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-semibold hover:bg-white/15 transition-all"
                                        >
                                            <span>{selectedSeason?.name || 'Server 1'}</span>
                                            <svg
                                                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
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
                                            <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/98 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden">
                                                {seasons.map((season) => (
                                                    <button
                                                        key={season.id}
                                                        onClick={() => {
                                                            setSelectedSeasonId(season.id);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`
                                                            w-full text-left px-4 py-3 text-sm transition-all
                                                            ${selectedSeasonId === season.id
                                                                ? 'bg-white/15 text-white font-semibold'
                                                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
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
                                    <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-semibold">
                                        {selectedSeason?.name || 'Server 1'}
                                    </div>
                                )}

                                <span className="text-gray-400 text-sm">
                                    {selectedSeason?.episodes.length || 0} tập
                                </span>
                            </div>

                            {/* Scroll buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => scroll('left')}
                                    disabled={!canScrollLeft}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${canScrollLeft
                                        ? 'bg-white/10 text-white hover:bg-white/20'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    disabled={!canScrollRight}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${canScrollRight
                                        ? 'bg-white/10 text-white hover:bg-white/20'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Episode Tabs - Horizontal Scroll */}
                        <div className="relative">
                            {/* Left fade */}
                            {canScrollLeft && (
                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
                            )}

                            {/* Right fade */}
                            {canScrollRight && (
                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
                            )}

                            <div
                                ref={scrollContainerRef}
                                className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {selectedSeason?.episodes.map((episode) => {
                                    const isActive = episode.id === currentEpisodeId;
                                    const href = `/watch/${watchId}?server=${selectedSeasonId}&episode=${episode.id}`;

                                    return (
                                        <Link
                                            key={episode.id}
                                            href={href}
                                            className={`
                                                flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
                                                ${isActive
                                                    ? 'bg-white text-black shadow-lg shadow-white/20'
                                                    : 'bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white border border-white/10'
                                                }
                                            `}
                                        >
                                            {!isActive && <Play className="w-3 h-3 fill-current" />}
                                            <span>Tập {episode.number}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
