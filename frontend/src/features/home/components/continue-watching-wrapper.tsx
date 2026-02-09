'use client';

import { useState, useEffect } from 'react';
import { Play, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/features/auth';
import { apiClient } from '@/shared/lib/api';

/**
 * Format server name to friendly Vietnamese label
 * Example: "#Hà Nội (Vietsub)" -> "Vietsub"
 */
function formatServerName(serverName?: string): string | undefined {
    if (!serverName) return undefined;

    const name = serverName.toLowerCase();

    // Check for subtitle types in the server name
    if (name.includes('vietsub') || name.includes('viet sub')) return 'Vietsub';
    if (name.includes('thuyết minh') || name.includes('thuyet minh')) return 'Thuyết minh';
    if (name.includes('lồng tiếng') || name.includes('long tieng')) return 'Lồng tiếng';
    if (name.includes('engsub') || name.includes('eng sub')) return 'Engsub';
    if (name.includes('raw')) return 'Raw';

    // If contains server + number only (like "server1"), hide it
    if (/^server\s*\d+$/i.test(name.trim())) {
        return undefined;
    }

    // Try to extract text in parentheses like "(Vietsub)" or "(Thuyết minh)"
    const parenMatch = serverName.match(/\(([^)]+)\)/);
    if (parenMatch) {
        return parenMatch[1]; // Return content inside parentheses
    }

    // Return original with first letter capitalized
    return serverName.charAt(0).toUpperCase() + serverName.slice(1);
}

/**
 * ContinueWatchingWrapper - Client Component
 * Fetches continue watching data and renders the section
 */
export function ContinueWatchingWrapper() {
    const { isAuthenticated } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) {
                setItems([]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await apiClient.getContinueWatching(10);
                console.log('🎬 [ContinueWatching] Raw data:', data);
                data?.forEach((item: any) => {
                    console.log(`Item: ${item.movie?.title}`, {
                        serverName: item.serverName,
                        serverDisplayName: item.serverDisplayName,
                        formatted: formatServerName(item.serverName)
                    });
                });
                setItems(data || []);
            } catch (error) {
                console.error('[ContinueWatchingWrapper] Failed to fetch:', error);
                setItems([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    const handleRemove = async (movieId: string) => {
        try {
            await apiClient.removeWatchHistory(movieId);
            setItems(prev => prev.filter(i => i.movie?.id !== movieId));
        } catch (error) {
            console.error('[ContinueWatchingWrapper] Failed to remove:', error);
        }
    };

    // Don't render if not logged in or no items
    if (!isAuthenticated || (!isLoading && items.length === 0)) {
        return null;
    }

    // Loading skeleton
    if (isLoading) {
        return (
            <section className="py-4 lg:py-5">
                <div className="w-full px-4 md:px-12 lg:px-16 2xl:px-12">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                            <Play className="w-5 h-5 text-red-500 fill-red-500" />
                            <span>Tiếp tục xem</span>
                        </h2>
                    </div>
                    <div className="flex gap-3 lg:gap-4 overflow-x-auto scrollbar-hide pb-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex-shrink-0 w-[180px] sm:w-[220px] lg:w-[260px] 2xl:w-[320px]">
                                <div className="aspect-video rounded-md bg-gray-800 animate-pulse" />
                                <div className="mt-2 h-4 bg-gray-800 rounded animate-pulse w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-4 lg:py-5">
            <div className="w-full px-4 md:px-12 lg:px-16 2xl:px-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                        <Play className="w-5 h-5 text-red-500 fill-red-500" />
                        <span>Tiếp tục xem</span>
                    </h2>
                    <Link
                        href="/profile?tab=continue-watching"
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                        <span>Xem tất cả</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Scrollable Row */}
                <div className="relative -mx-4 md:-mx-12 lg:-mx-16 2xl:-mx-12">
                    <div className="flex gap-3 lg:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 lg:px-16 2xl:px-12 pb-2">
                        {items.map((item) => {
                            // VISIBLE DEBUG INDICATOR
                            // if (process.env.NODE_ENV === 'development') {
                            //    console.error('🐛 [DEBUG ITEM]', item);
                            // }

                            const movie = item.movie;
                            if (!movie) return null;

                            const movieLink = movie.externalId || movie.id;
                            const episodeInfo = item.episodeNumber ? `Tập ${item.episodeNumber}` : undefined;
                            const friendlyServerName = item.serverDisplayName || formatServerName(item.serverName);

                            // Debug log for this specific item
                            // console.log(`render item ${movie.title}:`, { friendlyServerName, serverDisplayName: item.serverDisplayName, serverName: item.serverName });

                            const showServerName = friendlyServerName && friendlyServerName.trim().length > 0;

                            return (
                                <div
                                    key={item.id || movie.id}
                                    className="group relative flex-shrink-0 w-[180px] sm:w-[220px] lg:w-[260px] 2xl:w-[320px]"
                                >
                                    <Link href={`/watch/${movieLink}${item.serverName ? `?server=${item.serverName}` : ''}${item.episodeNumber ? `${item.serverName ? '&' : '?'}episode=e${item.episodeNumber}` : ''}`}>
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video overflow-hidden rounded-md bg-gray-800 ring-1 ring-white/5">
                                            {/* Fallback background - always present */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                                <Play className="w-10 h-10 text-white/30" />
                                            </div>
                                            {/* Image overlay */}
                                            {(movie.backdropUrl || movie.posterUrl) && (
                                                <Image
                                                    src={movie.backdropUrl || movie.posterUrl}
                                                    alt={movie.title}
                                                    fill
                                                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 260px"
                                                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        // Hide broken image to show fallback
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            )}

                                            {/* Play overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                                                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                                </div>
                                            </div>

                                        </div>
                                    </Link>

                                    {/* Remove button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemove(movie.id);
                                        }}
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-white" />
                                    </button>

                                    {/* Info */}
                                    <div className="mt-1.5">
                                        <h3 className="text-xs font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                                            {movie.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                            {episodeInfo && <span>{episodeInfo}</span>}
                                            {episodeInfo && showServerName && <span>•</span>}
                                            {showServerName && <span>{friendlyServerName}</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
