'use client';

import React from 'react';
import { Movie } from '@/types';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';

/**
 * ContinueWatchingSection Component
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 * 
 * Responsive grid section for movies in progress
 */

export interface WatchingItem {
  movie: Movie;
  progress: number; // 0-100
  lastWatchedAt: Date;
  currentEpisode?: string;
  serverName?: string;
  remainingTime?: string;
}

export interface ContinueWatchingSectionProps {
  items: WatchingItem[];
  onRemove: (movieId: string) => void;
  onPlay?: (movieId: string) => void;
  isLoading?: boolean;
}

export const ContinueWatchingSection: React.FC<ContinueWatchingSectionProps> = ({
  items,
  onRemove,
  onPlay,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="py-6">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-0">
          Tiếp tục xem
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-0">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <MovieCardSkeleton aspectRatio="16:9" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-secondary text-lg mb-2">
          Chưa có phim đang xem
        </p>
        <p className="text-text-tertiary text-sm">
          Bắt đầu xem phim để tiếp tục từ đây
        </p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 px-4 md:px-0">
        Tiếp tục xem ({items.length})
      </h2>

      {/* Responsive grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-0">
        {items.map((item) => (
          <div key={item.movie.id}>
            <MovieCard
              movie={item.movie}
              aspectRatio="16:9"
              showProgress
              progress={item.progress}
              onRemove={() => onRemove(item.movie.id)}
              onPlay={onPlay ? () => onPlay(item.movie.id) : undefined}
              metadata={{
                episode: item.currentEpisode,
                serverName: item.serverName,
                remainingTime: item.remainingTime,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

