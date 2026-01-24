import { MoviesUnifiedPage } from '@/components/features';
import { serverApi } from '@/lib/api/server';

export default async function MoviesPage() {
    // Fetch popular movies on server
    const popularMovies = await serverApi.getPopularMovies(1);

    // Map to the format expected by MoviesUnifiedPage
    const movies = popularMovies.map((movie) => ({
        id: movie.id,
        externalId: movie.externalId,
        title: movie.title,
        posterUrl: movie.posterUrl || '',
        backdropUrl: movie.backdropUrl,
        trailerUrl: movie.trailerUrl,
        rating: movie.rating || 0,
        year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : new Date().getFullYear(),
        quality: movie.quality || 'HD',
        genres: movie.genres || [],
        duration: movie.duration,
        mediaType: movie.mediaType || 'movie',
    }));

    return (
        <MoviesUnifiedPage 
            initialMovies={movies} 
            pageTitle="Phim Phổ Biến"
            apiEndpoint="/movies/popular"
        />
    );
}
