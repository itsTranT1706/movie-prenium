'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { MovieCard } from '@/components/features';
import { useAuth } from '@/hooks';
import { StageSpotlight } from '@/components/ui/stage-spotlight';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export default function FavoritesPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login?redirect=/favorites');
        }
    }, [isAuthenticated, isLoading, router]);

    // Fetch favorites
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isAuthenticated) return;
            
            try {
                setLoading(true);
                const response = await apiClient.getFavorites();
                const favoriteData = response.success ? response.data : response;
                setFavorites(favoriteData || []);
            } catch (error) {
                console.error('Failed to fetch favorites:', error);
                toast.error('Không thể tải danh sách yêu thích');
                setFavorites([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [isAuthenticated]);

    // Show loading state
    if (isLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    const isEmpty = favorites.length === 0;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-8 relative overflow-hidden">
            {/* Stage Spotlight Effect */}
            <StageSpotlight color="red" intensity="low" />
            
            <div className="container relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                    <h1 className="text-2xl font-bold text-white">Danh sách của tôi</h1>
                </div>

                {isEmpty ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Heart className="w-16 h-16 text-gray-700 mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Danh sách trống</h2>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm">
                            Thêm phim và series vào danh sách để xem sau
                        </p>
                        <Link
                            href="/movies"
                            className="px-5 py-2 bg-white text-black font-semibold text-sm rounded hover:bg-gray-200 transition-colors"
                        >
                            Khám phá phim
                        </Link>
                    </div>
                ) : (
                    /* Favorites Grid */
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                        {favorites.map((favorite) => (
                            <MovieCard key={favorite.id} movie={{ id: favorite.movieId }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
