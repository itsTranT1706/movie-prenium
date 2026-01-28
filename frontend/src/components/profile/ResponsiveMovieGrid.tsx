'use client';

import React from 'react';
import { Movie } from '@/types';
import { MovieCard, MovieCardMetadata } from './MovieCard';

/**
 * ResponsiveMovieGrid Component
 * Requirements: 4.1, 4.6
 * 
 * Responsive grid layout for movie cards
 */

export interface ResponsiveMovieGridProps {
  movies: Movie[];
  aspectRatio?: '16:9' | '2:3';
  emptyState?: React.ReactNode;
  onRemove?: (movieId: string) => void;
  showProgress?: boolean;
  getProgress?: (movieId: string) => number;
  getMetadata?: (movieId: string) => MovieCardMetadata | undefined;
}

export const ResponsiveMovieGrid: React.FC<ResponsiveMovieGridProps> = ({
  movies,
  aspectRatio = '2:3',
  emptyState,
  onRemove,
  showProgress = false,
  getProgress,
  getMetadata,
}) => {
  if (movies.length === 0 && emptyState) {
    return <div className="py-12">{emptyState}</div>;
  }

  if (movies.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-secondary text-lg">
          Không có phim nào
        </p>
      </div>
    );
  }

  return (
    <div className="movie-grid-responsive">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          aspectRatio={aspectRatio}
          showProgress={showProgress}
          progress={getProgress ? getProgress(movie.id) : 0}
          onRemove={onRemove ? () => onRemove(movie.id) : undefined}
          metadata={getMetadata ? getMetadata(movie.id) : undefined}
        />
      ))}
    </div>
  );
};
