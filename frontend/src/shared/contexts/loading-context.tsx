'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { LoadingOverlay } from '@/shared/components/ui/loading-overlay';
import { SkeletonLoading } from '@/shared/components/ui/skeleton-loading';

type LoadingType = 'fade' | 'skeleton' | null;

interface LoadingContextType {
    showLoading: (type?: LoadingType) => void;
    hideLoading: () => void;
    isLoading: boolean;
    loadingType: LoadingType;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState<LoadingType>(null);
    const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

    const showLoading = useCallback((type: LoadingType = 'fade') => {
        // Clear any pending hide timer
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }

        setLoadingType(type);
        setIsLoading(true);
    }, []);

    const hideLoading = useCallback(() => {
        // Clear any existing timer
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
        }

        // Minimal delay for smooth transition
        hideTimerRef.current = setTimeout(() => {
            setIsLoading(false);
            // Delay clearing type to allow fade out animation to complete
            setTimeout(() => setLoadingType(null), 400);
        }, 100);
    }, []);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading, loadingType }}>
            {children}

            {/* Render appropriate loading component */}
            {loadingType === 'fade' && <LoadingOverlay isVisible={isLoading} />}
            {loadingType === 'skeleton' && <SkeletonLoading isVisible={isLoading} />}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}
