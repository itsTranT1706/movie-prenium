const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getToken(): string | null {
        if (!this.token && typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
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

        const response = await fetch(url, {
            ...options,
            headers,
        });

        return response.json();
    }

    // Auth endpoints
    async login(email: string, password: string) {
        return this.request<{ user: any; accessToken: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(email: string, password: string, name?: string) {
        return this.request<{ user: any; accessToken: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    // Movie endpoints
    async searchMovies(query: string) {
        return this.request<any[]>(`/movies/search?q=${encodeURIComponent(query)}`);
    }

    async getPopularMovies(page = 1) {
        return this.request<any[]>(`/movies/popular?page=${page}`);
    }

    // Favorites endpoints
    async getFavorites() {
        return this.request<any[]>('/favorites');
    }

    async addFavorite(movieId: string) {
        return this.request<any>(`/favorites/${movieId}`, { method: 'POST' });
    }

    // Recommendations endpoints
    async getRecommendations(limit = 10) {
        return this.request<any[]>(`/recommendations?limit=${limit}`);
    }

    // Streaming endpoints
    async getStream(movieId: string) {
        return this.request<any>(`/streaming/${movieId}`);
    }

    // User endpoints
    async getUser(userId: string) {
        return this.request<any>(`/users/${userId}`);
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
