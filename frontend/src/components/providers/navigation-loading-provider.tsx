'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/contexts/loading-context';

/**
 * Provider component that automatically handles loading state during navigation
 * Add this to your layout to enable automatic navigation loading
 */
export function NavigationLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hideLoading } = useLoading();

  useEffect(() => {
    // Minimal delay to ensure page is rendered, then hide loading smoothly
    const timer = setTimeout(() => {
      hideLoading();
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, hideLoading]);

  return <>{children}</>;
}
