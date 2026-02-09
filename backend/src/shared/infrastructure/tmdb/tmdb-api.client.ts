import { Injectable, Logger } from '@nestjs/common';
import { TMDBConfigService } from './tmdb.config';

/**
 * Custom TMDB API Error Classes
 */
export class TMDBApiError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
    ) {
        super(message);
        this.name = 'TMDBApiError';
    }
}

export class TMDBNotFoundError extends TMDBApiError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'TMDBNotFoundError';
    }
}

export class TMDBRateLimitError extends TMDBApiError {
    constructor(
        message: string,
        public readonly retryAfter?: number,
    ) {
        super(message, 429);
        this.name = 'TMDBRateLimitError';
    }
}

/**
 * TMDB API Response interfaces
 */
export interface TMDBMovie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    runtime?: number;
    vote_average: number;
    vote_count: number;
    genre_ids?: number[];
    genres?: { id: number; name: string }[];
    popularity: number;
    adult: boolean;
    video: boolean;
}

export interface TMDBSearchResponse {
    page: number;
    results: TMDBMovie[];
    total_pages: number;
    total_results: number;
}

export interface TMDBGenre {
    id: number;
    name: string;
}

export interface TMDBGenresResponse {
    genres: TMDBGenre[];
}

/**
 * TMDB TV Show interface
 */
export interface TMDBTVShow {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    last_air_date?: string;
    number_of_seasons?: number;
    number_of_episodes?: number;
    episode_run_time?: number[];
    vote_average: number;
    vote_count: number;
    genre_ids?: number[];
    genres?: { id: number; name: string }[];
    popularity: number;
    origin_country: string[];
    status?: string;
}

export interface TMDBTVSearchResponse {
    page: number;
    results: TMDBTVShow[];
    total_pages: number;
    total_results: number;
}

export interface TMDBVideo {
    id: string;
    key: string;
    name: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
}

export interface TMDBVideosResponse {
    id: number;
    results: TMDBVideo[];
}

/**
 * TMDB Images Interface
 */
export interface TMDBImage {
    aspect_ratio: number;
    height: number;
    iso_639_1: string | null;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface TMDBImagesResponse {
    id: number;
    backdrops: TMDBImage[];
    logos: TMDBImage[];
    posters: TMDBImage[];
}

/**
 * TMDB Credits Interfaces
 */
export interface TMDBCast {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
}

export interface TMDBCrew {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    credit_id: string;
    department: string;
    job: string;
}

export interface TMDBCreditsResponse {
    id: number;
    cast: TMDBCast[];
    crew: TMDBCrew[];
}

export interface TMDBPersonCast {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character: string;
    credit_id: string;
    order: number;
    media_type: 'movie';
}

export interface TMDBPersonDateCast {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    first_air_date: string;
    name: string;
    vote_average: number;
    vote_count: number;
    character: string;
    credit_id: string;
    episode_count: number;
    media_type: 'tv';
}

export interface TMDBPersonDetails {
    adult: boolean;
    also_known_as: string[];
    biography: string;
    birthday: string | null;
    deathday: string | null;
    gender: number;
    homepage: string | null;
    id: number;
    imdb_id: string | null;
    known_for_department: string;
    name: string;
    place_of_birth: string | null;
    popularity: number;
    profile_path: string | null;
}

export interface TMDBPersonMovieCreditsResponse {
    cast: (TMDBPersonCast | TMDBPersonDateCast)[];
    crew: any[];
    id: number;
}

/**
 * TMDB API Client - HTTP wrapper for TMDB API calls
 */
@Injectable()
export class TMDBApiClient {
    private readonly logger = new Logger(TMDBApiClient.name);
    private genreMap: Map<number, string> = new Map();

    constructor(private readonly config: TMDBConfigService) {
        // Initialize genre map on startup
        this.initGenreMap();
    }

    /**
     * Generic GET request to TMDB API
     */
    async get<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
        const url = new URL(`${this.config.baseUrl}${endpoint}`);
        url.searchParams.set('api_key', this.config.apiKey);
        url.searchParams.set('language', 'vi-VN'); // Vietnamese locale

        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, String(value));
        }

        this.logger.debug(`Fetching: ${endpoint}`);

        const response = await fetch(url.toString());

        if (!response.ok) {
            const error = await response.text();

            // Handle specific error codes
            if (response.status === 404) {
                this.logger.warn(`TMDB resource not found: ${endpoint}`);
                throw new TMDBNotFoundError(`Resource not found: ${endpoint}`);
            }

            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                this.logger.warn(`TMDB rate limit exceeded. Retry after: ${retryAfter || 'unknown'}`);
                throw new TMDBRateLimitError(
                    'Rate limit exceeded',
                    retryAfter ? parseInt(retryAfter, 10) : undefined
                );
            }

            this.logger.error(`TMDB API Error: ${response.status} - ${error}`);
            throw new TMDBApiError(`TMDB API Error: ${response.status}`, response.status);
        }

        return response.json() as Promise<T>;
    }

    /**
     * Search for movies by query
     */
    async searchMovies(query: string, page = 1): Promise<TMDBSearchResponse> {
        return this.get<TMDBSearchResponse>('/search/movie', { query, page });
    }

    /**
     * Get movie details by ID
     */
    async getMovieDetails(movieId: number | string): Promise<TMDBMovie> {
        return this.get<TMDBMovie>(`/movie/${movieId}`);
    }

    /**
     * Get popular movies
     */
    async getPopularMovies(page = 1): Promise<TMDBSearchResponse> {
        return this.get<TMDBSearchResponse>('/movie/popular', { page });
    }

    /**
     * Discover movies by genre
     */
    async discoverByGenre(genreId: number, page = 1): Promise<TMDBSearchResponse> {
        return this.get<TMDBSearchResponse>('/discover/movie', {
            with_genres: genreId,
            page,
        });
    }

    /**
     * Get trending movies
     */
    async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBSearchResponse> {
        return this.get<TMDBSearchResponse>(`/trending/movie/${timeWindow}`);
    }

    /**
     * Get upcoming movies
     */
    async getUpcomingMovies(page = 1): Promise<TMDBSearchResponse> {
        return this.get<TMDBSearchResponse>('/movie/upcoming', { page });
    }

    /**
     * Get top rated movies
     */
    async getTopRatedMovies(page = 1): Promise<TMDBSearchResponse> {
        return this.get<TMDBSearchResponse>('/movie/top_rated', { page });
    }

    /**
     * Get now playing movies
     */
    async getNowPlayingMovies(page = 1): Promise<TMDBSearchResponse> {
        return this.get<TMDBSearchResponse>('/movie/now_playing', { page });
    }

    // ============ TV SHOW METHODS ============

    /**
     * Search for TV shows by query
     */
    async searchTVShows(query: string, page = 1): Promise<TMDBTVSearchResponse> {
        return this.get<TMDBTVSearchResponse>('/search/tv', { query, page });
    }

    /**
     * Get TV show details by ID
     */
    async getTVShowDetails(tvId: number | string): Promise<TMDBTVShow> {
        return this.get<TMDBTVShow>(`/tv/${tvId}`);
    }

    /**
     * Get popular TV shows
     */
    async getPopularTVShows(page = 1): Promise<TMDBTVSearchResponse> {
        return this.get<TMDBTVSearchResponse>('/tv/popular', { page });
    }

    /**
     * Get trending TV shows
     */
    async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBTVSearchResponse> {
        return this.get<TMDBTVSearchResponse>(`/trending/tv/${timeWindow}`);
    }

    /**
     * Get top rated TV shows
     */
    async getTopRatedTVShows(page = 1): Promise<TMDBTVSearchResponse> {
        return this.get<TMDBTVSearchResponse>('/tv/top_rated', { page });
    }

    /**
     * Get TV shows airing today
     */
    async getTVShowsAiringToday(page = 1): Promise<TMDBTVSearchResponse> {
        return this.get<TMDBTVSearchResponse>('/tv/airing_today', { page });
    }

    /**
     * Get TV shows on the air (currently airing)
     */
    async getTVShowsOnTheAir(page = 1): Promise<TMDBTVSearchResponse> {
        return this.get<TMDBTVSearchResponse>('/tv/on_the_air', { page });
    }

    /**
     * Get TV show images
     */
    async getTVShowImages(tvId: number | string): Promise<TMDBImagesResponse> {
        return this.get<TMDBImagesResponse>(`/tv/${tvId}/images`, {
            include_image_language: 'vi,null'
        });
    }

    /**
     * Get TV show videos (trailers, teasers, etc.)
     */
    async getTVShowVideos(tvId: number | string): Promise<TMDBVideosResponse> {
        return this.get<TMDBVideosResponse>(`/tv/${tvId}/videos`);
    }

    /**
     * Get YouTube trailer URL for a TV show
     */
    async getTVTrailerUrl(tvId: number | string): Promise<string | undefined> {
        try {
            const response = await this.getTVShowVideos(tvId);
            const trailer = response.results.find(
                (video) => video.site === 'YouTube' &&
                    (video.type === 'Trailer' || video.type === 'Teaser') &&
                    video.official
            ) || response.results.find(
                (video) => video.site === 'YouTube' &&
                    (video.type === 'Trailer' || video.type === 'Teaser')
            );

            if (trailer) {
                return `https://www.youtube.com/watch?v=${trailer.key}`;
            }
            return undefined;
        } catch {
            return undefined;
        }
    }

    /**
     * Get all TV genres
     */
    async getTVGenres(): Promise<TMDBGenresResponse> {
        return this.get<TMDBGenresResponse>('/genre/tv/list');
    }

    // ============ END TV SHOW METHODS ============

    /**
     * Get all movie genres
     */
    async getGenres(): Promise<TMDBGenresResponse> {
        return this.get<TMDBGenresResponse>('/genre/movie/list');
    }

    /**
     * Get movie videos (trailers, teasers, etc.)
     * Note: Don't use language parameter for videos to get all available videos
     */
    async getMovieVideos(movieId: number | string): Promise<TMDBVideosResponse> {
        const url = new URL(`${this.config.baseUrl}/movie/${movieId}/videos`);
        url.searchParams.set('api_key', this.config.apiKey);
        // Don't set language parameter to get all videos regardless of language

        this.logger.debug(`Fetching videos for movie: ${movieId}`);

        const response = await fetch(url.toString());

        if (!response.ok) {
            const error = await response.text();
            this.logger.error(`TMDB API Error fetching videos: ${response.status} - ${error}`);
            throw new TMDBApiError(`TMDB API Error: ${response.status}`, response.status);
        }

        return response.json() as Promise<TMDBVideosResponse>;
    }

    /**
     * Get movie images (posters, backdrops, logos)
     * Include vi (Vietnamese), en (English), and null (no language) for better logo coverage
     */
    async getMovieImages(movieId: number | string): Promise<TMDBImagesResponse> {
        return this.get<TMDBImagesResponse>(`/movie/${movieId}/images`, {
            include_image_language: 'en,vi,null'
        });
    }

    /**
     * Get movie credits (cast & crew)
     */
    async getMovieCredits(movieId: number | string): Promise<TMDBCreditsResponse> {
        return this.get<TMDBCreditsResponse>(`/movie/${movieId}/credits`);
    }

    /**
     * Get person movie credits
     */
    async getPersonMovieCredits(personId: number | string): Promise<TMDBPersonMovieCreditsResponse> {
        return this.get<TMDBPersonMovieCreditsResponse>(`/person/${personId}/combined_credits`);
    }

    /**
     * Get person details
     */
    async getPersonDetails(personId: number | string): Promise<TMDBPersonDetails> {
        return this.get<TMDBPersonDetails>(`/person/${personId}`);
    }

    /**
     * Get YouTube trailer URL for a movie
     */
    async getTrailerUrl(movieId: number | string): Promise<string | undefined> {
        try {
            this.logger.debug(`Fetching trailer for movie ${movieId}`);
            const response = await this.getMovieVideos(movieId);
            this.logger.debug(`Found ${response.results.length} videos for movie ${movieId}`);

            // Find official YouTube trailer
            const trailer = response.results.find(
                (video) => video.site === 'YouTube' &&
                    (video.type === 'Trailer' || video.type === 'Teaser') &&
                    video.official
            ) || response.results.find(
                (video) => video.site === 'YouTube' &&
                    (video.type === 'Trailer' || video.type === 'Teaser')
            );

            if (trailer) {
                const url = `https://www.youtube.com/watch?v=${trailer.key}`;
                this.logger.debug(`Found trailer for movie ${movieId}: ${url}`);
                return url;
            }
            this.logger.debug(`No trailer found for movie ${movieId}`);
            return undefined;
        } catch (error) {
            this.logger.warn(`Failed to fetch trailer for movie ${movieId}: ${error.message}`);
            return undefined;
        }
    }

    /**
     * Initialize genre map for ID to name conversion
     */
    private async initGenreMap(): Promise<void> {
        try {
            const response = await this.getGenres();
            for (const genre of response.genres) {
                this.genreMap.set(genre.id, genre.name);
            }
            this.logger.log(`Loaded ${this.genreMap.size} genres from TMDB`);
        } catch (error) {
            this.logger.warn('Failed to load genres from TMDB, will retry on demand');
        }
    }

    /**
     * Convert genre IDs to names
     */
    getGenreNames(genreIds: number[]): string[] {
        return genreIds
            .map((id) => this.genreMap.get(id))
            .filter((name): name is string => !!name);
    }

    /**
     * Get genre ID by name
     */
    async getGenreIdByName(genreName: string): Promise<number | undefined> {
        if (this.genreMap.size === 0) {
            await this.initGenreMap();
        }
        for (const [id, name] of this.genreMap.entries()) {
            if (name.toLowerCase() === genreName.toLowerCase()) {
                return id;
            }
        }
        return undefined;
    }
}
