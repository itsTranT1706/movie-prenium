import { User, AuthResponse, Movie, StreamSource, Favorite } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_PREFIX = '/api/v1';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl + API_PREFIX;
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }
        }
    }

    getToken(): string | null {
        if (!this.token && typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
        return this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;
        const token = this.getToken();

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || data.message || 'Request failed',
                };
            }

            return data;
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    // Auth endpoints
    async login(email: string, password: string) {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(email: string, password: string, name?: string) {
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    // Movie endpoints
    async searchMovies(query: string) {
        return this.request<Movie[]>(`/movies/search?q=${encodeURIComponent(query)}`);
    }

    async getPopularMovies(page = 1) {
        return this.request<Movie[]>(`/movies/popular?page=${page}`);
    }

    async getCinemaMovies(page = 1, limit = 24) {
        return this.request<Movie[]>(`/movies/cinema?page=${page}&limit=${limit}`);
    }

    async getMovieStreams(tmdbId: string, mediaType: 'movie' | 'tv' = 'movie', originalName?: string) {
        const params = new URLSearchParams({ mediaType });
        if (originalName) params.append('originalName', originalName);
        return this.request<StreamSource[]>(`/movies/${tmdbId}/streams?${params.toString()}`);
    }

    // Favorites endpoints
    async getFavorites() {
        return this.request<Favorite[]>('/favorites');
    }

    async addFavorite(movieId: string) {
        return this.request<Favorite>(`/favorites/${movieId}`, { method: 'POST' });
    }

    // Recommendations endpoints
    async getRecommendations(limit = 10) {
        return this.request<Movie[]>(`/recommendations?limit=${limit}`);
    }

    // Streaming endpoints
    async getStream(movieId: string) {
        return this.request<any>(`/streaming/${movieId}`);
    }

    // User endpoints
    async getUser(userId: string) {
        return this.request<User>(`/users/${userId}`);
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
