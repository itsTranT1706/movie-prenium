'use client';

import React from 'react';
import Image from 'next/image';
import { User, Movie } from '@/types';

/**
 * ProfileHeroSection Component - Premium Netflix Design
 * Features a subtle gradient background and prominent user info
 */

export interface ViewingStats {
  moviesWatched: number;
  totalHours: number;
  favoriteGenres: string[];
}

export interface ProfileHeroSectionProps {
  user: User;
  stats: ViewingStats;
  recentMovies: Movie[];
}

export const ProfileHeroSection: React.FC<ProfileHeroSectionProps> = ({
  user,
}) => {
  return (
    <div className="relative w-full bg-[#141414] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 to-[#0a0a0a] z-10" />
      <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-3/4 h-[200%] bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 pt-28 pb-10 relative z-20">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          {/* Avatar with Ring */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-red-600 to-red-900 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden bg-[#1a1a1a] ring-4 ring-[#0a0a0a] shadow-2xl">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name || 'User'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                  key={user.avatar}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl font-bold text-gray-400 bg-[#2a2a2a]">
                  {(user.name || user.email)?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left flex-1 min-w-0 pb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              {user.name || user.email}
            </h1>
            <p className="text-gray-400 text-lg font-medium">
              Thành viên
            </p>
            <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
              <div className="px-3 py-1 rounded bg-white/10 text-xs font-semibold text-white tracking-wider uppercase border border-white/5">
                Gói Cao Cấp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
