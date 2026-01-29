'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Movie } from '@/types';
import { NavigationLink } from '@/components/ui';
import { Play, Trash2, Info } from 'lucide-react';

/**
 * MovieCard Component
 * Requirements: 3.2, 3.3, 3.4, 4.3, 5.4, 6.4
 * 
 * Reusable movie card with flexible aspect ratios and hover effects
 */

export interface MovieCardMetadata {
  episode?: string;
  serverName?: string;
  watchedAt?: Date;
  remainingTime?: string;
}

export interface MovieCardProps {
  movie: Movie;
  aspectRatio?: '16:9' | '2:3';
  showProgress?: boolean;
  progress?: number;
  onRemove?: () => void;
  onPlay?: () => void;
  metadata?: MovieCardMetadata;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  aspectRatio = '2:3',
  showProgress = false,
  progress = 0,
  onRemove,
  onPlay,
  metadata,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = aspectRatio === '16:9' 
    ? (movie.backdropUrl || movie.posterUrl)
    : (movie.posterUrl || movie.backdropUrl);

  const paddingBottom = aspectRatio === '16:9' ? '56.25%' : '150%';
  
  // Use externalId for links if available, fallback to internal id
  const movieLink = movie.externalId || movie.id;

  return (
    <div
      className="group relative profile-card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative w-full overflow-hidden rounded bg-netflix-secondary" style={{ paddingBottom }}>
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-netflix-elevated">
            <span className="text-text-tertiary text-sm text-center px-4">
              {movie.title}
            </span>
          </div>
        )}

        {/* Progress bar */}
        {showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}

        {/* Hover overlay with actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-3 profile-transition-fast">
            {/* Quick actions */}
            <div className="flex gap-2 mb-2">
              {onPlay ? (
                <NavigationLink
                  href={`/watch/${movieLink}${metadata?.serverName || metadata?.episode ? '?' : ''}${metadata?.serverName ? `server=${metadata.serverName}` : ''}${metadata?.serverName && metadata?.episode ? '&' : ''}${metadata?.episode ? `episode=e${metadata.episode.match(/\d+/)?.[0] || '1'}` : ''}`}
                  loadingType="fade"
                  className="w-9 h-9 rounded-full bg-white hover:bg-white/90 flex items-center justify-center profile-transition-fast"
                  title="Xem phim"
                >
                  <Play className="w-4 h-4 text-black fill-black" />
                </NavigationLink>
              ) : (
                <NavigationLink
                  href={`/movies/${movieLink}`}
                  loadingType="fade"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center profile-transition-fast"
                  title="Chi tiết"
                >
                  <Info className="w-4 h-4 text-white" />
                </NavigationLink>
              )}
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove();
                  }}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-600/80 flex items-center justify-center profile-transition-fast ml-auto"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Movie info */}
      <div className="mt-2 px-1">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        
        {/* Metadata */}
        {metadata && (
          <div className="mt-1 flex flex-col gap-0.5">
            {metadata.episode && (
              <p className="text-xs text-text-secondary">
                {metadata.episode}
              </p>
            )}
            {metadata.remainingTime && (
              <p className="text-xs text-text-tertiary">
                Còn {metadata.remainingTime}
              </p>
            )}
            {metadata.watchedAt && (
              <p className="text-xs text-text-tertiary">
                {new Date(metadata.watchedAt).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>
        )}

        {/* Genres (if no metadata) */}
        {!metadata && movie.genres && movie.genres.length > 0 && (
          <p className="text-xs text-text-secondary mt-1 line-clamp-1">
            {movie.genres.slice(0, 2).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};
