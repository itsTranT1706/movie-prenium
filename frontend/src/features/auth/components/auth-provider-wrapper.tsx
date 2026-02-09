'use client';

import { AuthProvider } from '../hooks';

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
}
