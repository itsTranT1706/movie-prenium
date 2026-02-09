import BaseApiClient from '@/shared/lib/api/base-client';
import { Movie, MovieWithSources, StreamSource, MovieCast, ActorProfile } from '@/types';

class MovieService extends BaseApiClient {
    async searchMovies(query: string, page = 1) {
        return this.request<Movie[]>(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
    }

    async getPopularMovies(page = 1) {
        return this.request<Movie[]>(`/movies/popular?page=${page}`);
    }

    async getCinemaMovies(page = 1, limit = 24) {
        return this.request<Movie[]>(`/movies/cinema?page=${page}&limit=${limit}`);
    }

    async getMovieStreams(
        tmdbId: string,
        mediaType: 'movie' | 'tv' = 'movie',
        originalName?: string
    ) {
        const params = new URLSearchParams({ mediaType });
        if (originalName) params.append('originalName', originalName);
        return this.request<StreamSource[]>(`/movies/${tmdbId}/streams?${params.toString()}`);
    }

    async getMoviesByGenre(genre: string, page = 1) {
        return this.request<Movie[]>(`/movies/genre/${genre}?page=${page}`);
    }

    async getMoviesByCountry(country: string, page = 1) {
        return this.request<Movie[]>(`/movies/country/${country}?page=${page}`);
    }

    async getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
        return this.request<Movie[]>(`/movies/trending?timeWindow=${timeWindow}`);
    }

    async getUpcomingMovies(page = 1) {
        return this.request<Movie[]>(`/movies/upcoming?page=${page}`);
    }

    async getMovieDetails(slug: string, preview?: boolean) {
        const query = preview ? '?preview=true' : '';
        return this.request<MovieWithSources>(`/movies/${slug}${query}`);
    }

    async getMovieCast(id: string) {
        return this.request<MovieCast[]>(`/movies/${id}/cast`);
    }

    async getMoviesByActor(actorId: string) {
        return this.request<Movie[]>(`/movies/actor/${actorId}`);
    }

    async getActorProfile(actorId: string) {
        return this.request<ActorProfile>(`/movies/actor/${actorId}/profile`);
    }

    async filterMovies(filters: {
        search?: string;
        genres?: string[];
        countries?: string[];
        yearFrom?: number;
        yearTo?: number;
        qualities?: string[];
        languages?: string[];
        status?: string[];
        type?: string;
        page?: number;
        limit?: number;
    }) {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.genres?.length) params.append('genres', filters.genres.join(','));
        if (filters.countries?.length) params.append('countries', filters.countries.join(','));
        if (filters.yearFrom) params.append('yearFrom', filters.yearFrom.toString());
        if (filters.yearTo) params.append('yearTo', filters.yearTo.toString());
        if (filters.qualities?.length) params.append('qualities', filters.qualities.join(','));
        if (filters.languages?.length) params.append('languages', filters.languages.join(','));
        if (filters.status?.length) params.append('status', filters.status.join(','));
        if (filters.type) params.append('type', filters.type);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        return this.request<Movie[]>(`/movies/filter?${params.toString()}`);
    }

    async reactToMovie(id: string, reaction: string, score: number, review?: string) {
        return this.request(`/movies/reactions/${id}`, {
            method: 'POST',
            body: JSON.stringify({ reaction, score, review }),
        });
    }

    async getReactionStats(id: string) {
        return this.request<{
            totalVotes: number;
            averageScore: number;
            distribution: { positive: number; mixed: number };
            counts: Record<string, number>;
            reviews: {
                id: string;
                userId: string;
                userName: string;
                userAvatar?: string;
                reaction: string;
                score: number;
                review: string;
                createdAt: string;
            }[];
        }>(`/movies/reactions/${id}/stats`);
    }

    async getMyReaction(id: string) {
        return this.request<{ reaction: string; score: number } | null>(`/movies/reactions/${id}/my-reaction`);
    }
}


export const movieService = new MovieService();
export default MovieService;
