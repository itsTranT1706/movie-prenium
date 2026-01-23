'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { MovieCard } from '@/components/features';
import { useAuth } from '@/hooks';
import { StageSpotlight } from '@/components/ui/stage-spotlight';

export default function FavoritesPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login?redirect=/favorites');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Sample favorites - would come from user's saved list
    const favorites = [
        { id: '1', title: 'Dune: Part Two', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', rating: 8.8, year: 2024, quality: '4K' },
        { id: '2', title: 'Oppenheimer', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', rating: 8.9, year: 2023, quality: '4K' },
        { id: '3', title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.7, year: 2014, quality: '4K' },
    ];

    const isEmpty = favorites.length === 0;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-8 relative overflow-hidden">
            {/* Stage Spotlight Effect */}
            <StageSpotlight color="red" intensity="low" />
            
            <div className="container relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                    <h1 className="text-2xl font-bold text-white">My List</h1>
                </div>

                {isEmpty ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Heart className="w-16 h-16 text-gray-700 mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Your list is empty</h2>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm">
                            Add movies and series to your list to watch them later
                        </p>
                        <Link
                            href="/movies"
                            className="px-5 py-2 bg-white text-black font-semibold text-sm rounded hover:bg-gray-200 transition-colors"
                        >
                            Browse Movies
                        </Link>
                    </div>
                ) : (
                    /* Favorites Grid */
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                        {favorites.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
