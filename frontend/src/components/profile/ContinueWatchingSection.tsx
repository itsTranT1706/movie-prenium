'use client';

import React from 'react';
import { Movie } from '@/types';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';

/**
 * ContinueWatchingSection Component
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 * 
 * Horizontal scrolling section for movies in progress
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
        <div className="horizontal-scroll-snap gap-4 px-4 md:px-0 pb-8 -mx-4 md:mx-0 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`
                w-[70vw] sm:w-[300px] md:w-[320px] flex-shrink-0 
                ${index === 0 ? 'ml-4 md:ml-0' : ''} 
                ${index === 5 ? 'mr-4 md:mr-0' : ''}
              `}
            >
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
        Tiếp tục xem
      </h2>

      {/* Horizontal scroll container */}
      <div className="horizontal-scroll-snap gap-4 px-4 md:px-0 pb-8 -mx-4 md:mx-0 overflow-x-auto scrollbar-hide">
        {items.map((item, index) => (
          <div
            key={item.movie.id}
            className={`
              w-[70vw] sm:w-[300px] md:w-[320px] flex-shrink-0 
              ${index === 0 ? 'ml-4 md:ml-0' : ''} 
              ${index === items.length - 1 ? 'mr-4 md:mr-0' : ''}
            `}
          >
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
