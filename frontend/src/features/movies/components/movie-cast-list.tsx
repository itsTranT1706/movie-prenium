'use client';

import { useEffect, useState } from 'react';
import { MovieCast } from '@/types';
import { movieService } from '../api/movie.service';
import { NavigationLink } from '@/shared/components/ui';

interface MovieCastListProps {
    movieId: string;
    externalId?: string;
}

export function MovieCastList({ movieId, externalId }: MovieCastListProps) {
    const [cast, setCast] = useState<MovieCast[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCast = async () => {
            if (!externalId && !movieId) return;

            // Prefer externalId (TMDB ID) if available, otherwise fallback to movieId
            // But our backend API expects TMDB ID for fetching cast?
            // If movieId is a slug/uuid, getMovieCast might fail if it expects TMDB ID.
            // However, the backend controller's getMovieCast takes :id.
            // If the backend provider is TMDBMovieProvider, it expects TMDB ID.
            // If we are strictly using TMDB, we should use externalId.
            // If externalId is missing (e.g. KKPhim only), we might not support cast unless we have a mapping.

            const idToUse = externalId || movieId;

            try {
                // Check if idToUse looks like a TMDB ID (numeric)
                if (!/^\d+$/.test(idToUse)) {
                    // If it's a slug or UUID, we might skip or try anyway if generic provider supports it
                    // For now, let's assume we need a numeric ID for TMDB cast
                    setIsLoading(false);
                    return;
                }

                const response = await movieService.getMovieCast(idToUse);
                const castData = response?.data || response || [];

                // Take top 5 actors
                setCast(Array.isArray(castData) ? castData.slice(0, 7) : []);
            } catch (error) {
                console.error('Failed to fetch movie cast:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCast();
    }, [movieId, externalId]);

    if (!isLoading && cast.length === 0) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex gap-4 mt-6 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-20">
                        <div className="w-20 h-20 rounded-full bg-white/10" />
                        <div className="h-3 w-16 bg-white/10 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="mt-4 border-t border-white/5 pt-4">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-widest text-opacity-70">Diễn viên chính</h3>
            <div className="flex flex-wrap gap-3">
                {cast.map((actor) => (
                    <NavigationLink
                        key={actor.id}
                        href={`/actors/${actor.id}`}
                        className="flex flex-col items-center gap-1.5 w-16 group cursor-pointer"
                    >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 group-hover:border-white/50 transition-all bg-zinc-800">
                            {actor.profileUrl ? (
                                <img
                                    src={actor.profileUrl}
                                    alt={actor.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-sm">
                                    {actor.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="text-center w-full">
                            <p className="text-[10px] font-semibold text-white truncate w-full group-hover:text-primary transition-colors">
                                {actor.name}
                            </p>
                            <p className="text-[9px] text-gray-500 truncate w-full">
                                {actor.character}
                            </p>
                        </div>
                    </NavigationLink>
                ))}
            </div>
        </div>
    );
}
