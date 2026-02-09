import { serverApi } from '@/shared/lib/api/server';
import { CountryMoviesSection } from './country-movie-row';

interface CountryMovie {
    id: string;
    externalId?: string;
    title: string;
    subtitle?: string;
    backdropUrl: string;
    episodeCount?: number;
    rating?: number;
    gradientColor?: string;
    quality?: string;
    lang?: string;
    isNew?: boolean;
    episodeCurrent?: string;
}

/**
 * Server Component wrapper for CountryMoviesSection
 * Fetches data on server and passes to client component
 */
export async function CountryMoviesWrapper() {
    let koreanData: any[] = [];
    let chineseData: any[] = [];
    let usukData: any[] = [];

    try {
        // Fetch all country movies in parallel
        [koreanData, chineseData, usukData] = await Promise.all([
            serverApi.getMoviesByCountry('han-quoc', 1),
            serverApi.getMoviesByCountry('trung-quoc', 1),
            serverApi.getMoviesByCountry('au-my', 1),
        ]);
    } catch (error) {
        console.error('Failed to fetch country movies:', error);
    }

    // Map Korean movies
    const koreanMovies: CountryMovie[] = (koreanData || []).slice(0, 10).map((movie) => ({
        id: movie.id,
        externalId: movie.externalId,
        title: movie.title,
        subtitle: movie.originalTitle,
        backdropUrl: movie.backdropUrl || movie.posterUrl || '',
        episodeCount: movie.episodeCurrent ? parseInt(movie.episodeCurrent) : undefined,
        rating: movie.rating,
        gradientColor: 'from-pink-500/60',
        quality: movie.quality,
        lang: movie.lang,
        isNew: true, // Assuming top new movies
        episodeCurrent: movie.episodeCurrent,
    }));

    // Map Chinese movies
    const chineseMovies: CountryMovie[] = (chineseData || []).slice(0, 10).map((movie) => ({
        id: movie.id,
        externalId: movie.externalId,
        title: movie.title,
        subtitle: movie.originalTitle,
        backdropUrl: movie.backdropUrl || movie.posterUrl || '',
        episodeCount: movie.episodeCurrent ? parseInt(movie.episodeCurrent) : undefined,
        rating: movie.rating,
        gradientColor: 'from-amber-500/60',
        quality: movie.quality,
        lang: movie.lang,
        isNew: true,
        episodeCurrent: movie.episodeCurrent,
    }));

    // Map US/UK movies
    const usukMovies: CountryMovie[] = (usukData || []).slice(0, 10).map((movie) => ({
        id: movie.id,
        externalId: movie.externalId,
        title: movie.title,
        subtitle: movie.originalTitle,
        backdropUrl: movie.backdropUrl || movie.posterUrl || '',
        episodeCount: movie.episodeCurrent ? parseInt(movie.episodeCurrent) : undefined,
        rating: movie.rating,
        gradientColor: 'from-red-600/60',
        quality: movie.quality,
        lang: movie.lang,
        isNew: true,
        episodeCurrent: movie.episodeCurrent,
    }));

    return (
        <CountryMoviesSection
            koreanMovies={koreanMovies}
            chineseMovies={chineseMovies}
            usukMovies={usukMovies}
        />
    );
}
