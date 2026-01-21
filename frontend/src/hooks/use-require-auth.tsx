'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from './use-auth';

/**
 * Hook to require authentication before performing an action
 * Shows toast notification and redirects to login if not authenticated
 * Preserves current URL for redirect after login
 * 
 * @example
 * const requireAuth = useRequireAuth();
 * 
 * const handleComment = () => {
 *   requireAuth(() => {
 *     // This code only runs if user is authenticated
 *     submitComment();
 *   }, 'Vui lòng đăng nhập để bình luận');
 * };
 */
export function useRequireAuth() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const requireAuth = useCallback(
        (
            action: () => void,
            message: string = 'Vui lòng đăng nhập để tiếp tục'
        ) => {
            if (isAuthenticated) {
                // User is authenticated, execute action immediately
                action();
            } else {
                // User is not authenticated, show simple toast
                const currentPath = window.location.pathname + window.location.search;
                
                toast.error(message, {duration: 4000});
            }
        },
        [isAuthenticated, router]
    );

    return requireAuth;
}

export default useRequireAuth;
