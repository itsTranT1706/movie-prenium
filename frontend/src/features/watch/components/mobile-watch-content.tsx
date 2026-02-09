'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Play, ChevronDown, Lock } from 'lucide-react';
import { CommentSection } from '@/features/comments';
import { MovieReactionSelector } from '@/features/movies/components/movie-reaction-selector';
import { ExpandableText } from '@/shared/components/ui';
import { SeasonSelector } from './season-selector';

interface MobileWatchContentProps {
    activeTab: string;
    movie: any;
    seasons: any[];
    currentSeasonId?: string;
    currentEpisodeId?: string;
    comments: any[];
}

export function MobileWatchContent({
    activeTab,
    movie,
    seasons,
    currentSeasonId,
    currentEpisodeId,
    comments
}: MobileWatchContentProps) {
    // State for season selector could be here if we want to manage it internally
    // For now defaulting to currentSeason or first
    const [selectedSeasonId, setSelectedSeasonId] = useState(currentSeasonId || seasons[0]?.id);
    const selectedSeason = seasons.find((s) => s.id === selectedSeasonId) || seasons[0];
    const watchId = movie.externalId || movie.id;

    return (
        <div className="bg-[#0a0a0a] min-h-screen">
            <AnimatePresence mode="wait">
                {activeTab === 'episodes' && (
                    <motion.div
                        key="episodes"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="p-4"
                    >
                        <div className="mb-6">
                            <h2 className="text-white text-lg font-bold mb-2">Nội dung</h2>
                            {movie.description && (
                                <ExpandableText
                                    content={movie.description}
                                    className="text-gray-400 text-sm leading-relaxed"
                                    maxLines={3}
                                />
                            )}
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-white text-lg font-bold">Danh sách tập</h2>
                                {seasons.length > 1 && (
                                    <SeasonSelector
                                        seasons={seasons}
                                        selectedSeasonId={selectedSeasonId}
                                        onSelect={setSelectedSeasonId}
                                    />
                                )}
                            </div>

                            <div className="space-y-3">
                                {selectedSeason?.episodes.map((episode: any) => {
                                    const isActive = episode.id === currentEpisodeId;
                                    const href = `/watch/${watchId}?server=${selectedSeasonId}&episode=${episode.id}`;

                                    return (
                                        <Link
                                            key={episode.id}
                                            href={href}
                                            className={`
                                                flex justify-between items-center p-4 rounded-xl border transition-all active:scale-[0.98]
                                                ${isActive
                                                    ? 'bg-zinc-800 border-red-600/50 shadow-sm relative overflow-hidden'
                                                    : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-800'
                                                }
                                            `}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
                                            )}

                                            <div className="flex items-center gap-4">
                                                <div className={`
                                                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                                                    ${isActive ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400'}
                                                 `}>
                                                    {episode.number}
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                                        Tập {episode.number}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {episode.title || 'Full HD • Vietsub'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-gray-500">
                                                {isActive ? (
                                                    <div className="w-8 h-8 flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                                    </div>
                                                ) : (
                                                    <Play className="w-5 h-5 opacity-50" />
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'actors' && (
                    <motion.div
                        key="actors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="p-4"
                    >
                        {/* Placeholder for Actors */}
                        <div className="text-center py-10 text-gray-500">
                            Actors list coming soon...
                        </div>
                    </motion.div>
                )}

                {activeTab === 'gallery' && (
                    <motion.div
                        key="gallery"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="p-4"
                    >
                        {/* Placeholder for Gallery */}
                        <div className="text-center py-10 text-gray-500">
                            Gallery coming soon...
                        </div>
                    </motion.div>
                )}

                {activeTab === 'reviews' && (
                    <motion.div
                        key="reviews"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="p-4"
                    >
                        <div className="mb-6">
                            <MovieReactionSelector
                                movieId={movie.externalId || movie.id}
                                movieTitle={movie.title}
                                moviePoster={movie.backdropUrl || movie.posterUrl}
                            />
                        </div>
                        <CommentSection movieId={movie.externalId || movie.id} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
