interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    pagination?: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
}

class BaseApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl?: string) {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const BASE_URL = API_BASE_URL.includes('/api/v1') ? API_BASE_URL : `${API_BASE_URL}/api/v1`;
        this.baseUrl = baseUrl || BASE_URL;
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

    protected async request<T>(
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

    // Public GET method  
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint);
    }
}

export default BaseApiClient;
