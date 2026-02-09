import BaseApiClient from '@/shared/lib/api/base-client';
import { AuthResponse } from '@/types';

class AuthService extends BaseApiClient {
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
}

export const authService = new AuthService();
export default AuthService;
