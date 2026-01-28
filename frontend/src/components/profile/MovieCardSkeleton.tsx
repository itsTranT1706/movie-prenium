'use client';

import React from 'react';

/**
 * MovieCardSkeleton Component
 * Loading skeleton for MovieCard with configurable aspect ratio
 */

export interface MovieCardSkeletonProps {
  aspectRatio?: '16:9' | '2:3';
}

export const MovieCardSkeleton: React.FC<MovieCardSkeletonProps> = ({
  aspectRatio = '2:3',
}) => {
  const paddingBottom = aspectRatio === '16:9' ? '56.25%' : '150%';

  return (
    <div className="group relative animate-pulse">
      {/* Image skeleton */}
      <div 
        className="relative w-full overflow-hidden rounded bg-[#2a2a2a]" 
        style={{ paddingBottom }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a2a] via-[#333333] to-[#2a2a2a] animate-shimmer" />
      </div>

      {/* Title skeleton */}
      <div className="mt-2 px-1 space-y-2">
        <div className="h-4 bg-[#2a2a2a] rounded w-3/4" />
        <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
      </div>
    </div>
  );
};

/**
 * MovieGridSkeleton Component
 * Grid of loading skeletons matching the responsive grid layout
 */

export interface MovieGridSkeletonProps {
  count?: number;
  aspectRatio?: '16:9' | '2:3';
}

export const MovieGridSkeleton: React.FC<MovieGridSkeletonProps> = ({
  count = 12,
  aspectRatio = '2:3',
}) => {
  return (
    <div className="movie-grid-responsive">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} aspectRatio={aspectRatio} />
      ))}
    </div>
  );
};
