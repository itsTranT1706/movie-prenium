'use client';

import Link from 'next/link';
import MovieCard, { Movie } from './movie-card';
import { ChevronRight, Flame, Sparkles, Tv } from 'lucide-react';
import { HoverPreviewCard, MoviePreviewData } from '@/components/ui';
interface MovieRowProps {
    title: string;
    href?: string;
    movies: Movie[];
    isLoading?: boolean;
    icon?: 'trending' | 'new' | 'series';
}

/**
 * Movie Row Component (Reusable)
 * - Tight, immersive horizontal layout
 * - Cinema-style spacing
 * - Premium streaming platform feel
 */
export default function MovieRow({ title, href, movies, isLoading, icon }: MovieRowProps) {
    const getIcon = () => {
        switch (icon) {
            case 'trending':
                return <Flame className="w-5 h-5 text-orange-500" />;
            case 'new':
                return <Sparkles className="w-5 h-5 text-yellow-400" />;
            case 'series':
                return <Tv className="w-5 h-5 text-purple-400" />;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <section className="py-4 lg:py-5">
                <div className="container">
                    <div className="flex justify-between items-center mb-3">
                        <div className="h-6 w-40 bg-gray-800 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
                    </div>
                    <div className="flex gap-2 lg:gap-3 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-[130px] lg:w-[160px]">
                                <div className="aspect-[2/3] bg-gray-800 rounded-md animate-pulse" />
                                <div className="mt-1.5 h-3 bg-gray-800 rounded w-3/4 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-4 lg:py-5">
            <div className="container">
                {/* Header - Tight spacing */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                        {getIcon()}
                        <span>{title}</span>
                    </h2>
                    {href && (
                        <Link
                            href={href}
                            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center"
                        >
                            <span>View all</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {/* Scrollable Row - Tighter gaps */}
                <div className="relative -mx-4 sm:-mx-6 lg:-mx-12">
                    <div className="flex gap-2 lg:gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-12 pb-2">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
