'use client';

import Link from 'next/link';
import { Play, ChevronRight } from 'lucide-react';
import { Movie } from '@/types';

interface ContinueWatchingItem extends Movie {
    progress: number;
    episodeInfo?: string;
}

interface ContinueWatchingProps {
    items: ContinueWatchingItem[];
    isLoggedIn: boolean;
}


/**
 * Continue Watching Section
 * - Compact, tight layout
 * - Progress bars
 * - Only renders when logged in
 */
export default function ContinueWatching({ items, isLoggedIn }: ContinueWatchingProps) {
    if (!isLoggedIn || items.length === 0) {
        return null;
    }

    return (
        <section className="py-4 lg:py-5">
            <div className="w-full px-4 md:px-12 lg:px-16 2xl:px-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3 uppercase tracking-widest border-l-4 border-[#ff2020] pl-4 shadow-black drop-shadow-lg">
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-red-600 fill-red-600" />
                        <span>Continue Watching</span>
                    </h2>
                    <Link
                        href="/continue-watching"
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                        <span>View all</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Scrollable Row */}
                <div className="relative -mx-4 md:-mx-12 lg:-mx-16 2xl:-mx-12">
                    <div className="flex gap-3 lg:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 lg:px-16 2xl:px-12 pb-2">
                        {items.map((item) => (
                            <Link
                                key={item.id}
                                href={`/watch/${item.id}`}
                                className="group relative flex-shrink-0 w-[180px] sm:w-[220px] lg:w-[260px] 2xl:w-[320px]"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video overflow-hidden rounded-md bg-gray-800 ring-1 ring-white/5">
                                    {item.posterUrl ? (
                                        <img
                                            src={item.posterUrl}
                                            alt={item.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                            <Play className="w-10 h-10 text-white/30" />
                                        </div>
                                    )}

                                    {/* Play overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/80">
                                        <div
                                            className="h-full bg-red-600"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="mt-1.5">
                                    <h3 className="text-xs font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                                        {item.title}
                                    </h3>
                                    {item.episodeInfo && (
                                        <p className="text-[10px] text-gray-500">{item.episodeInfo}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
