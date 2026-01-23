import { serverApi } from '@/lib/api/server';
import Top10MoviesSection from './top10-movies-section';

/**
 * Top 10 Movies Wrapper
 * Fetches trending movies from API and displays as Top 10
 */
export default async function Top10MoviesWrapper() {
    let trendingMovies: any[] = [];

    try {
        // Fetch trending movies from API
        console.log('[Top10MoviesWrapper] Fetching trending movies...');
        const data = await serverApi.getTrendingMovies('day');
        trendingMovies = data || [];
        console.log('[Top10MoviesWrapper] Fetched movies:', trendingMovies.length);
    } catch (error) {
        console.error('[Top10MoviesWrapper] Failed to fetch trending movies:', error);
        // Return null to hide section on error
        return null;
    }

    // If no movies, don't render
    if (!trendingMovies || trendingMovies.length === 0) {
        console.log('[Top10MoviesWrapper] No trending movies found');
        return null;
    }

    // Map API data to Top10Movie format
    const top10Movies = trendingMovies.slice(0, 10).map((movie, index) => {
        console.log(`[Top10MoviesWrapper] Mapping movie ${index + 1}:`, {
            id: movie.id,
            externalId: movie.externalId,
            title: movie.title,
            posterUrl: movie.posterUrl,
        });

        return {
            id: movie.externalId || movie.id,
            rank: index + 1,
            title: movie.title,
            subtitle: movie.originalTitle || movie.title,
            posterUrl: movie.posterUrl || 'https://via.placeholder.com/342x513?text=No+Image',
            ageRating: movie.rating ? (movie.rating >= 8 ? 'T18' : movie.rating >= 6 ? 'T16' : 'T13') : 'T13',
            year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : new Date().getFullYear(),
            duration: movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : undefined,
            hasPDE: true, // Phụ đề
            hasTMinh: Math.random() > 0.5, // Random thuyết minh
            quality: movie.quality || 'HD',
        };
    });

    console.log('[Top10MoviesWrapper] Rendering with movies:', top10Movies.length);

    return <Top10MoviesSection movies={top10Movies} />;
}
