import { MoviesPageClient } from '@/components/features/movies-page-client';
import { serverApi } from '@/lib/api/server';

export default async function MoviesPage() {
    let initialMovies: any[] = [];

    try {
        // Fetch initial movies on server
        initialMovies = await serverApi.getPopularMovies(1);
    } catch (error) {
        console.error('Failed to fetch movies:', error);
    }

    return <MoviesPageClient initialMovies={initialMovies} />;
}
