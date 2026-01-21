import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { Movie, MovieProviderPort } from '../../domain';

/**
 * KKPhim response interfaces
 */
interface KKPhimMovie {
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    type: string;
    poster_url: string;
    thumb_url: string;
    year: number;
    quality: string;
    lang: string;
    time: string;
    episode_current: string;
    content?: string;
    category: { id: string; name: string; slug: string }[];
    country: { id: string; name: string; slug: string }[];
    tmdb: {
        type: 'tv' | 'movie' | null;
        id: string | null;
        vote_average: number;
    };
    modified: { time: string };
}

interface KKPhimListResponse {
    status: boolean;
    items: KKPhimMovie[];
    pagination?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    };
}

interface KKPhimDetailResponse {
    status: boolean;
    movie: KKPhimMovie & {
        trailer_url?: string;
        actor?: string[];
        director?: string[];
    };
    episodes: any[];
}

interface KKPhimSearchResponse {
    status: string;
    data: {
        items: KKPhimMovie[];
        params: { pagination: { totalPages: number; currentPage: number } };
        APP_DOMAIN_CDN_IMAGE?: string;
    };
}

interface KKPhimApiResponse {
    status: boolean | string;
    data?: {
        items: KKPhimMovie[];
        APP_DOMAIN_CDN_IMAGE?: string;
        params?: { pagination: { totalPages: number; currentPage: number } };
    };
    items?: KKPhimMovie[];
    APP_DOMAIN_CDN_IMAGE?: string;
}

/**
 * KKPhim Movie Provider
 * 
 * Implements MovieProviderPort using KKPhim API (phimapi.com)
 * This is the MASTER LIST provider - all movies have streaming available.
 */
@Injectable()
export class KKPhimMovieProvider implements MovieProviderPort {
    private readonly logger = new Logger(KKPhimMovieProvider.name);
    private readonly baseUrl = 'https://phimapi.com';
    private readonly cdnImageUrl = 'https://phimimg.com';

    constructor(private readonly httpService: HttpService) { }

    /**
     * Search movies by query
     * GET /v1/api/tim-kiem?keyword={query}&page={page}
     */
    async searchMovies(query: string, page = 1): Promise<Movie[]> {
        try {
            const url = `${this.baseUrl}/v1/api/tim-kiem?keyword=${encodeURIComponent(query)}&page=${page}`;
            this.logger.debug(`Searching: ${url}`);

            const response = await this.httpService.axiosRef.get<KKPhimSearchResponse>(url);

            if (response.data?.status !== 'success' || !response.data?.data?.items) {
                return [];
            }

            const cdnUrl = response.data.data.APP_DOMAIN_CDN_IMAGE || this.cdnImageUrl;
            return response.data.data.items.map(movie => this.mapToMovie(movie, undefined, cdnUrl));
        } catch (error) {
            this.logger.error(`Search failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Get movie details by slug
     * GET /phim/{slug}
     */
    async getMovieDetails(slug: string): Promise<Movie | null> {
        try {
            const url = `${this.baseUrl}/phim/${slug}`;
            this.logger.debug(`Getting details: ${url}`);

            const response = await this.httpService.axiosRef.get<KKPhimDetailResponse>(url);

            if (!response.data?.status || !response.data?.movie) {
                return null;
            }

            // Detail endpoint returns full URLs already
            return this.mapToMovie(response.data.movie, response.data.movie.trailer_url, this.cdnImageUrl);
        } catch (error) {
            this.logger.error(`Get details failed: ${error.message}`);
            return null;
        }
    }

    /**
     * Get popular/latest movies
     * GET /danh-sach/phim-moi-cap-nhat-v3?page={page}
     */
    async getPopularMovies(page = 1): Promise<Movie[]> {
        try {
            const url = `${this.baseUrl}/danh-sach/phim-moi-cap-nhat-v3?page=${page}`;
            this.logger.debug(`Getting popular: ${url}`);

            const response = await this.httpService.axiosRef.get<KKPhimListResponse>(url);

            if (!response.data?.status || !response.data?.items) {
                return [];
            }

            return response.data.items.map(movie => this.mapToMovie(movie, undefined, this.cdnImageUrl));
        } catch (error) {
            this.logger.error(`Get popular failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Get movies by genre
     * GET /v1/api/danh-sach/phim-bo?category={genre}&page={page}
     */
    async getMoviesByGenre(genre: string, page = 1): Promise<Movie[]> {
        try {
            const url = `${this.baseUrl}/v1/api/danh-sach/phim-bo?category=${encodeURIComponent(genre)}&page=${page}`;
            this.logger.debug(`Getting by genre: ${url}`);

            const response = await this.httpService.axiosRef.get<KKPhimApiResponse>(url);

            if (!response.data?.status || !response.data?.data?.items) {
                return [];
            }

            const cdnUrl = response.data.data.APP_DOMAIN_CDN_IMAGE || this.cdnImageUrl;
            return response.data.data.items.map((movie: KKPhimMovie) => this.mapToMovie(movie, undefined, cdnUrl));
        } catch (error) {
            this.logger.error(`Get by genre failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Get trending movies (using latest updates sorted by modified time)
     */
    async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
        // KKPhim doesn't have trending endpoint, use latest as fallback
        return this.getPopularMovies(1);
    }

    /**
     * Get upcoming movies
     * KKPhim doesn't have upcoming endpoint
     */
    async getUpcomingMovies(page = 1): Promise<Movie[]> {
        this.logger.debug('KKPhim does not have upcoming movies endpoint');
        return [];
    }

    /**
     * Get movies by type (phim-bo, phim-le, hoat-hinh, tv-shows)
     */
    async getMoviesByType(type: string, page = 1): Promise<Movie[]> {
        try {
            const url = `${this.baseUrl}/v1/api/danh-sach/${type}?page=${page}`;
            this.logger.debug(`Getting by type: ${url}`);

            const response = await this.httpService.axiosRef.get<KKPhimApiResponse>(url);

            if (!response.data?.status || !response.data?.data?.items) {
                return [];
            }

            const cdnUrl = response.data.data.APP_DOMAIN_CDN_IMAGE || this.cdnImageUrl;
            return response.data.data.items.map((movie: KKPhimMovie) => this.mapToMovie(movie, undefined, cdnUrl));
        } catch (error) {
            this.logger.error(`Get by type failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Get cinema movies (phim chiếu rạp)
     * GET /v1/api/danh-sach/phim-chieu-rap?page={page}&limit={limit}
     */
    async getCinemaMovies(page = 1, limit = 24): Promise<Movie[]> {
        try {
            const url = `${this.baseUrl}/v1/api/danh-sach/phim-chieu-rap?page=${page}&limit=${limit}`;
            this.logger.debug(`Getting cinema movies: ${url}`);

            const response = await this.httpService.axiosRef.get<KKPhimApiResponse>(url);

            if (!response.data?.status || !response.data?.data?.items) {
                return [];
            }

            const cdnUrl = response.data.data.APP_DOMAIN_CDN_IMAGE || this.cdnImageUrl;
            return response.data.data.items.map((movie: KKPhimMovie) => this.mapToMovie(movie, undefined, cdnUrl));
        } catch (error) {
            this.logger.error(`Get cinema movies failed: ${error.message}`);
            return [];
        }
    }

    /**
     * Map KKPhim movie to domain Movie entity
     */
    private mapToMovie(kkphimMovie: KKPhimMovie, trailerUrl?: string, cdnUrl?: string): Movie {
        const now = new Date();
        const imageCdn = cdnUrl || this.cdnImageUrl;

        // Determine mediaType from KKPhim type or tmdb.type
        let mediaType: 'movie' | 'tv' = 'movie';
        if (kkphimMovie.tmdb?.type) {
            mediaType = kkphimMovie.tmdb.type;
        } else if (['series', 'hoathinh', 'tvshows'].includes(kkphimMovie.type)) {
            mediaType = 'tv';
        }

        // Extract genres from category array
        const genres = kkphimMovie.category?.map(cat => cat.name) || [];

        // Build full image URLs
        const posterUrl = this.buildImageUrl(kkphimMovie.poster_url, imageCdn);
        const backdropUrl = this.buildImageUrl(kkphimMovie.thumb_url, imageCdn);

        return Movie.create(uuidv4(), {
            externalId: kkphimMovie.tmdb?.id || kkphimMovie.slug,
            title: kkphimMovie.name,
            mediaType,
            description: kkphimMovie.content || undefined,
            posterUrl,
            backdropUrl,
            trailerUrl,
            releaseDate: kkphimMovie.year ? new Date(kkphimMovie.year, 0, 1) : undefined,
            duration: this.parseDuration(kkphimMovie.time),
            rating: kkphimMovie.tmdb?.vote_average || undefined,
            genres,
            provider: 'kkphim',
            streamUrl: undefined, // Will be fetched separately via streaming adapter
            createdAt: now,
            updatedAt: kkphimMovie.modified?.time ? new Date(kkphimMovie.modified.time) : now,
        });
    }

    /**
     * Build full image URL from path
     * If path already starts with http/https, return as is
     * Otherwise prepend CDN URL
     */
    private buildImageUrl(path: string | undefined, cdnUrl: string): string | undefined {
        if (!path) return undefined;
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        // Remove leading slash if present
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        return `${cdnUrl}/${cleanPath}`;
    }

    /**
     * Parse duration from string like "60 phút/tập" or "120 phút"
     */
    private parseDuration(timeStr?: string): number | undefined {
        if (!timeStr) return undefined;
        const match = timeStr.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : undefined;
    }
}
