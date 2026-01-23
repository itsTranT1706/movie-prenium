'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { MovieCard } from '@/components/features';
import { Loader2 } from 'lucide-react';

interface Movie {
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

interface MoviesGridProps {
    initialMovies?: Movie[];
    onLoadMore?: (page: number) => Promise<Movie[]>;
}

/**
 * Movies Grid with Infinite Scroll
 * Automatically loads more movies when user scrolls to bottom
 * Uses Intersection Observer API (same pattern as LazySection)
 */
export function MoviesGrid({ initialMovies = [], onLoadMore }: MoviesGridProps) {
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const loadMoreMovies = async () => {
        if (isLoading || !hasMore || !onLoadMore) return;

        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const newMovies = await onLoadMore(nextPage);

            if (newMovies.length === 0) {
                setHasMore(false);
            } else {
                setMovies((prev) => [...prev, ...newMovies]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error('Failed to load more movies:', error);
            toast.error('Không thể tải thêm phim. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    // Intersection Observer - same pattern as LazySection
    useEffect(() => {
        if (!hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMoreMovies();
                }
            },
            {
                rootMargin: '500px',
                threshold: 0,
            }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, isLoading, page]);

    return (
        <div>
            {/* Movie Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {movies.map((movie, index) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        enablePreview={true}
                        priority={index < 6}
                    />
                ))}
            </div>

            {/* Loading Trigger & Indicator */}
            <div ref={loadMoreRef} className="flex justify-center py-8">
                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Đang tải thêm phim...</span>
                    </div>
                )}
                {!hasMore && movies.length > 0 && (
                    <p className="text-sm text-gray-500">Đã hiển thị tất cả phim</p>
                )}
            </div>
        </div>
    );
}

export default MoviesGrid;
