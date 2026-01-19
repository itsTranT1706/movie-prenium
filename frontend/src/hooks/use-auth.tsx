'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, name?: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = apiClient.getToken();
        if (token) {
            // TODO: Validate token and fetch user
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const response = await apiClient.login(email, password);
        if (response.success && response.data) {
            apiClient.setToken(response.data.accessToken);
            setUser(response.data.user);
            return true;
        }
        return false;
    };

    const register = async (email: string, password: string, name?: string): Promise<boolean> => {
        const response = await apiClient.register(email, password, name);
        if (response.success && response.data) {
            apiClient.setToken(response.data.accessToken);
            setUser(response.data.user);
            return true;
        }
        return false;
    };

    const logout = () => {
        apiClient.setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
