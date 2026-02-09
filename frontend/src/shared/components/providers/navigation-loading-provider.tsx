'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useLoading } from '@/shared/contexts';

function NavigationLoadingHandler({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { hideLoading } = useLoading();

    useEffect(() => {
        // When navigation completes, hide loading
        hideLoading();
    }, [pathname, searchParams, hideLoading]);

    return <>{children}</>;
}

export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            <NavigationLoadingHandler>{children}</NavigationLoadingHandler>
        </Suspense>
    );
}
