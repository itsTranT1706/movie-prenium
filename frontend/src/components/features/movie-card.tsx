'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { HoverPreviewCard, MoviePreviewData } from '@/components/ui';

export interface Movie {
    id: string;
    externalId?: string;
    title: string;
    originalTitle?: string;
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
    mediaType?: 'movie' | 'tv';
    episodeCurrent?: string;
    lang?: string;
}

interface MovieCardProps {
    movie: Movie;
    /** Enable hover preview (default: true) */
    enablePreview?: boolean;
    /** Priority loading for first few cards (default: false) */
    priority?: boolean;
}

/**
 * Format language badges from lang string
 * KKPhim returns lang like "Vietsub", "Thuyết Minh", etc.
 */
function formatLanguageBadges(lang?: string): string[] {
    if (!lang) return [];

    const badges: string[] = [];
    const langLower = lang.toLowerCase();

    if (langLower.includes('vietsub')) badges.push('VS');
    if (langLower.includes('thuyết minh') || langLower.includes('thuyet minh')) badges.push('TM');
    if (langLower.includes('lồng tiếng') || langLower.includes('long tieng')) badges.push('LT');
    if (langLower.includes('phụ đề') || langLower.includes('phu de')) badges.push('PĐ');

    return badges;
}



/**
 * Get badge color based on type
 * VS -> Dark Gray/Black (#1f1f1f)
 * TM -> Netflix Red (#E50914)
 * LT -> Royal Blue (#2563eb) - Distinct from TM
 */
function getBadgeColor(type: string): string {
    switch (type) {
        case 'TM':
            return 'bg-[#E50914]'; // Netflix Red
        case 'LT':
            return 'bg-[#2563eb]'; // Royal Blue
        case 'VS':
        case 'PĐ':
        default:
            return 'bg-[#1f1f1f]'; // Neutral Dark/Black
    }
}

/**
 * Movie Card Component
 * - Compact, tight sizing
 * - Premium streaming platform style
 * - Smooth hover animations
 * - Netflix-style hover preview
 * - Skeleton loading state
 */
export default function MovieCard({ movie, enablePreview = true, priority = false }: MovieCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Use externalId (TMDB ID) for links, fallback to internal ID
    const movieLink = movie.externalId || movie.id;

    // Convert Movie to MoviePreviewData
    const previewData: MoviePreviewData = {
        id: movie.id,
        externalId: movie.externalId,
        title: movie.title,
        originalTitle: movie.originalTitle,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl,
        trailerUrl: movie.trailerUrl,
        year: movie.year,
        genres: movie.genres,
        duration: movie.duration,
        ageRating: movie.ageRating,
        quality: movie.quality,
        rating: movie.rating,
        mediaType: movie.mediaType,
        episodeCurrent: movie.episodeCurrent,
    };

    // Get language badges
    const langBadges = formatLanguageBadges(movie.lang);

    const cardContent = (
        <div className="group relative w-full">
            <Link
                href={`/movies/${movieLink}`}
                className="block"
            >
                {/* Poster Container - Fixed aspect ratio */}
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/10 shadow-lg">
                    {/* Skeleton Loading Placeholder */}
                    {!imageLoaded && !imageError && movie.posterUrl && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
                        </div>
                    )}

                    {/* Poster Image */}
                    {movie.posterUrl && !imageError ? (
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            loading="lazy"
                            decoding="async"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <Play className="w-10 h-10 text-white/30" />
                        </div>
                    )}

                    {/* Badges - Compact */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {movie.isNew && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded shadow-md">
                                NEW
                            </span>
                        )}
                        {movie.quality && (
                            <span className="px-1.5 py-[2px] border border-white/30 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold tracking-wider rounded-[3px] shadow-sm uppercase">
                                {movie.quality}
                            </span>
                        )}
                    </div>

                    {/* Language Badges - Split Style - Bottom Center (Flush with edge) */}
                    {langBadges.length > 0 && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex shadow-lg text-[10px] font-bold z-20 leading-none">
                            <div className="flex rounded-t-lg overflow-hidden ring-1 ring-black/20">
                                {langBadges.map((badge) => (
                                    <div
                                        key={badge}
                                        className={`px-2 py-1.5 ${getBadgeColor(badge)} text-white flex items-center gap-1 font-extrabold shadow-sm`}
                                    >
                                        <span>{badge}</span>
                                        {previewData.episodeCurrent && (
                                            <>
                                                <span className="opacity-80 text-[10px] mx-0.5 font-bold">-</span>
                                                <span>{previewData.episodeCurrent.replace(/\D/g, '') || 1}</span>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center z-10">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-200">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                    </div>

                    {/* Rating Badge - moved to top right to avoid collision with bottom center badges */}
                    {movie.rating && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-yellow-500 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10">
                            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{movie.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Title - Compact */}
                <div className="mt-2 w-full">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-300 line-clamp-2 group-hover:text-white transition-colors leading-tight">
                        {movie.title}
                    </h3>
                    {movie.year && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{movie.year}</p>
                    )}
                </div>
            </Link>
        </div>
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
