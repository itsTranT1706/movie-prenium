'use client';

import Link from 'next/link';
import {
    Flame,
    Laugh,
    Ghost,
    Heart,
    Rocket,
    Film,
    Skull,
    Theater,
    ChevronRight
} from 'lucide-react';

interface Genre {
    id: string;
    name: string;
    count: number;
    gradient: string;
    icon: React.ReactNode;
}

interface GenreCardGridProps {
    genres?: Genre[];
}

/**
 * Genre Card Grid Component
 * - Compact, tight layout
 * - Cinema-style immersive design
 */
export default function GenreCardGrid({ genres }: GenreCardGridProps) {
    const defaultGenres: Genre[] = [
        { id: 'action', name: 'Action', count: 423, gradient: 'from-red-600 to-orange-600', icon: <Flame className="w-6 h-6" /> },
        { id: 'comedy', name: 'Comedy', count: 312, gradient: 'from-yellow-500 to-orange-400', icon: <Laugh className="w-6 h-6" /> },
        { id: 'horror', name: 'Horror', count: 198, gradient: 'from-gray-800 to-red-900', icon: <Ghost className="w-6 h-6" /> },
        { id: 'romance', name: 'Romance', count: 267, gradient: 'from-pink-500 to-rose-500', icon: <Heart className="w-6 h-6" /> },
        { id: 'scifi', name: 'Sci-Fi', count: 156, gradient: 'from-blue-600 to-cyan-500', icon: <Rocket className="w-6 h-6" /> },
        { id: 'anime', name: 'Anime', count: 534, gradient: 'from-purple-600 to-pink-500', icon: <Film className="w-6 h-6" /> },
        { id: 'thriller', name: 'Thriller', count: 245, gradient: 'from-slate-700 to-slate-600', icon: <Skull className="w-6 h-6" /> },
        { id: 'drama', name: 'Drama', count: 389, gradient: 'from-indigo-600 to-purple-600', icon: <Theater className="w-6 h-6" /> },
    ];

    const displayGenres = genres || defaultGenres;

    return (
        <section className="relative pt-6 lg:pt-8 pb-4 lg:pb-5">
            <div className="container">
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg lg:text-xl font-bold text-white">
                        Browse by Genre
                    </h2>
                    <Link
                        href="/genres"
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center"
                    >
                        <span>All genres</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="lg:hidden -mx-4 sm:-mx-6">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-2">
                        {displayGenres.map((genre) => (
                            <GenreCard key={genre.id} genre={genre} />
                        ))}
                    </div>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden lg:grid grid-cols-4 xl:grid-cols-8 gap-3">
                    {displayGenres.map((genre) => (
                        <GenreCard key={genre.id} genre={genre} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function GenreCard({ genre }: { genre: Genre }) {
    return (
        <Link
            href={`/genre/${genre.id}`}
            className="group flex-shrink-0 w-[130px] lg:w-auto"
        >
            <div className={`
                relative overflow-hidden rounded-lg p-4
                bg-gradient-to-br ${genre.gradient}
                transition-all duration-200
                group-hover:scale-[1.03] group-hover:shadow-lg
            `}>
                {/* Icon */}
                <div className="text-white/40 mb-2 group-hover:text-white/60 transition-colors">
                    {genre.icon}
                </div>

                {/* Content */}
                <h3 className="text-sm font-bold text-white">
                    {genre.name}
                </h3>
                <p className="text-[10px] text-white/60">
                    {genre.count} titles
                </p>
            </div>
        </Link>
    );
}
