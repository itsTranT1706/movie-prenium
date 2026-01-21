import { Injectable } from '@nestjs/common';

export interface TMDBConfig {
    apiKey: string;
    baseUrl: string;
    imageBaseUrl: string;
}

@Injectable()
export class TMDBConfigService {
    private readonly config: TMDBConfig;

    constructor() {
        const apiKey = process.env.TMDB_API_KEY;
        if (!apiKey) {
            throw new Error('TMDB_API_KEY is not defined in environment variables');
        }

        this.config = {
            apiKey,
            baseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
            imageBaseUrl: process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500',
        };
    }

    get apiKey(): string {
        return this.config.apiKey;
    }

    get baseUrl(): string {
        return this.config.baseUrl;
    }

    get imageBaseUrl(): string {
        return this.config.imageBaseUrl;
    }

    /**
     * Get full image URL from TMDB path
     */
    getImageUrl(path: string | null | undefined, size = 'w500'): string | undefined {
        if (!path) return undefined;
        return `https://image.tmdb.org/t/p/${size}${path}`;
    }
}
