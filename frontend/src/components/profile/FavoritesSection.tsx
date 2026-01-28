'use client';

import React from 'react';
import { Movie } from '@/types';
import { ResponsiveMovieGrid } from './ResponsiveMovieGrid';
import { MovieGridSkeleton } from './MovieCardSkeleton';
import { NavigationLink } from '@/components/ui';
import { Heart } from 'lucide-react';

/**
 * FavoritesSection Component
 * Requirements: 4.1, 4.2, 4.4, 4.5, 4.6
 * 
 * Grid layout for favorite movies with remove functionality
 */

export interface FavoritesSectionProps {
  movies: Movie[];
  onRemove: (movieId: string) => void;
  isLoading?: boolean;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  movies,
  onRemove,
  isLoading = false,
}) => {
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Icon with gradient background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-600/10 to-pink-600/10 border border-red-500/20">
          <Heart className="w-12 h-12 text-red-500" />
        </div>
      </div>

      {/* Text content */}
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
        Danh sách của bạn đang trống
      </h3>
      <p className="text-gray-400 text-base md:text-lg mb-8 max-w-md text-center leading-relaxed">
        Thêm phim và series yêu thích để dễ dàng tìm lại và xem bất cứ lúc nào
      </p>

      {/* CTA Button - Netflix style */}
      <NavigationLink
        href="/movies"
        loadingType="fade"
        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold text-lg rounded-md transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100"
      >
        <svg 
          className="w-6 h-6 transition-transform group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <span>Khám phá phim ngay</span>
        <svg 
          className="w-5 h-5 transition-transform group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </NavigationLink>

      {/* Secondary action */}
      <NavigationLink
        href="/series"
        loadingType="fade"
        className="mt-4 text-gray-400 hover:text-white text-sm font-medium transition-colors underline decoration-gray-600 hover:decoration-white underline-offset-4"
      >
        Hoặc xem phim bộ
      </NavigationLink>
    </div>
  );

  return (
    <div className="py-6">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
        Phim yêu thích
      </h2>

      {isLoading ? (
        <MovieGridSkeleton count={12} aspectRatio="2:3" />
      ) : (
        <ResponsiveMovieGrid
          movies={movies}
          aspectRatio="2:3"
          emptyState={emptyState}
          onRemove={onRemove}
        />
      )}
    </div>
  );
};
