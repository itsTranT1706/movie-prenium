'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient } from '@/shared/lib/api';
import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = apiClient.getToken();
        if (token) {
            // Try to decode JWT to get user ID
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.userId) {
                    // Fetch user details
                    apiClient.getUser(payload.userId).then(response => {
                        if (response.success && response.data) {
                            setUser(response.data);
                        } else {
                            // Token invalid, clear it
                            apiClient.setToken(null);
                        }
                        setIsLoading(false);
                    }).catch(() => {
                        apiClient.setToken(null);
                        setIsLoading(false);
                    });
                } else {
                    setIsLoading(false);
                }
            } catch {
                // Invalid token format
                apiClient.setToken(null);
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await apiClient.login(email, password);
            if (response.success && response.data) {
                apiClient.setToken(response.data.accessToken);
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: response.error || 'Login failed' };
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const register = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const response = await apiClient.register(email, password, name);
            if (response.success && response.data) {
                apiClient.setToken(response.data.accessToken);
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: response.error || 'Registration failed' };
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const logout = () => {
        apiClient.setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        const token = apiClient.getToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.userId) {
                    console.log('🔄 Refreshing user data...');
                    const response = await apiClient.getUser(payload.userId);
                    if (response.success && response.data) {
                        // Create new object to trigger re-render
                        setUser({ ...response.data });
                    }
                }
            } catch (error) {
                console.error('❌ Failed to refresh user:', error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            register,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
