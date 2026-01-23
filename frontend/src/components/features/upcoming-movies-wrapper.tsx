import { serverApi } from '@/lib/api/server';
import UpcomingMoviesSection from './upcoming-movies-section';

interface UpcomingMovie {
    id: string;
    externalId?: string;
    title: string;
    subtitle?: string;
    backdropUrl: string;
    releaseDate?: string;
    hasComingSoonBadge?: boolean;
}

/**
 * Server Component wrapper for UpcomingMoviesSection
 * Fetches data on server and passes to client component
 */
export async function UpcomingMoviesWrapper() {
    let upcomingData: any[] = [];

    try {
        // Fetch upcoming movies on server
        upcomingData = await serverApi.getUpcomingMovies(1);
    } catch (error) {
        console.error('Failed to fetch upcoming movies:', error);
    }

    // Map to component format
    const upcomingMovies: UpcomingMovie[] = (upcomingData || []).slice(0, 8).map((movie) => ({
        id: movie.id,
        externalId: movie.externalId,
        title: movie.title,
        subtitle: movie.originalTitle,
        backdropUrl: movie.backdropUrl || movie.posterUrl || 'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        releaseDate: movie.releaseDate,
        hasComingSoonBadge: true,
    }));

    return <UpcomingMoviesSection movies={upcomingMovies} />;
}
