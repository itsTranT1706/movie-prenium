'use client';

import React from 'react';
import { Movie } from '@/types';
import { ResponsiveMovieGrid } from './ResponsiveMovieGrid';
import { MovieGridSkeleton } from './MovieCardSkeleton';
import { Clock } from 'lucide-react';

/**
 * WatchHistorySection Component
 * Requirements: 4.2
 * 
 * Display watch history with dates and completion status
 */

export interface HistoryItem {
  movie: Movie;
  watchedAt: Date;
  completed: boolean;
}

export interface WatchHistorySectionProps {
  items: HistoryItem[];
  isLoading?: boolean;
}

export const WatchHistorySection: React.FC<WatchHistorySectionProps> = ({
  items,
  isLoading = false,
}) => {
  const emptyState = (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-netflix-elevated mb-4">
        <Clock className="w-8 h-8 text-text-tertiary" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        Chưa có lịch sử xem
      </h3>
      <p className="text-text-secondary">
        Lịch sử xem phim của bạn sẽ hiển thị ở đây
      </p>
    </div>
  );

  // Create a map for metadata
  const getMetadata = (movieId: string) => {
    const item = items.find((i) => i.movie.id === movieId);
    if (!item) return undefined;

    return {
      watchedAt: item.watchedAt,
    };
  };

  // Get progress for completed movies
  const getProgress = (movieId: string) => {
    const item = items.find((i) => i.movie.id === movieId);
    return item?.completed ? 100 : 0;
  };

  return (
    <div className="py-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
        Lịch sử xem
      </h2>

      {isLoading ? (
        <MovieGridSkeleton count={12} aspectRatio="2:3" />
      ) : (
        <ResponsiveMovieGrid
          movies={items.map((item) => item.movie)}
          aspectRatio="2:3"
          emptyState={emptyState}
          showProgress
          getProgress={getProgress}
          getMetadata={getMetadata}
        />
      )}
    </div>
  );
};
