'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { HoverPreviewCard, MoviePreviewData } from '@/components/ui';

export interface Movie {
    id: string;
    title: string;
    posterUrl?: string;
    backdropUrl?: string;
    trailerUrl?: string;
    rating?: number;
    year?: number;
    quality?: string;
    isNew?: boolean;
    genres?: string[];
    duration?: string;
    ageRating?: string;
}

interface MovieCardProps {
    movie: Movie;
    /** Enable hover preview (default: true) */
    enablePreview?: boolean;
}

/**
 * Movie Card Component
 * - Compact, tight sizing
 * - Premium streaming platform style
 * - Smooth hover animations
 * - Netflix-style hover preview
 */
export default function MovieCard({ movie, enablePreview = true }: MovieCardProps) {
    // Convert Movie to MoviePreviewData
    const previewData: MoviePreviewData = {
        id: movie.id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        trailerUrl: movie.trailerUrl,
        year: movie.year,
        genres: movie.genres,
        duration: movie.duration,
        ageRating: movie.ageRating,
        quality: movie.quality,
    };

    const cardContent = (
        <Link
            href={`/movies/${movie.id}`}
            className="group relative flex-shrink-0 w-[120px] sm:w-[140px] lg:w-[160px] xl:w-[170px] block"
        >
            {/* Poster Container */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-gray-800 ring-1 ring-white/5">
                {/* Poster Image */}
                {movie.posterUrl ? (
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <Play className="w-10 h-10 text-white/30" />
                    </div>
                )}

                {/* Badges - Compact */}
                <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                    {movie.isNew && (
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                            NEW
                        </span>
                    )}
                    {movie.quality && (
                        <span className="px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-semibold rounded">
                            {movie.quality}
                        </span>
                    )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-200">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                </div>

                {/* Rating Badge */}
                {movie.rating && (
                    <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 bg-black/80 rounded text-yellow-400 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{movie.rating.toFixed(1)}</span>
                    </div>
                )}
            </div>

            {/* Title - Compact */}
            <h3 className="mt-1.5 text-xs font-medium text-gray-300 truncate group-hover:text-white transition-colors">
                {movie.title}
            </h3>
            {movie.year && (
                <p className="text-[10px] text-gray-500">{movie.year}</p>
            )}
        </Link>
    );

    // Wrap with HoverPreviewCard if enabled
    if (enablePreview) {
        return (
            <HoverPreviewCard movie={previewData} delay={600}>
                {cardContent}
            </HoverPreviewCard>
        );
    }

    return cardContent;
}
