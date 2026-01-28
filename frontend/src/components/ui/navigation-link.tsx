'use client';

import Link from 'next/link';
import { useLoading } from '@/contexts/loading-context';
import { ComponentProps, MouseEvent } from 'react';

interface NavigationLinkProps extends ComponentProps<typeof Link> {
  showLoading?: boolean;
  loadingType?: 'fade' | 'skeleton';
}

/**
 * Enhanced Link component with automatic loading overlay
 * Shows loading when navigating to new page
 */
export function NavigationLink({
  showLoading: shouldShowLoading = true,
  loadingType = 'fade',
  onClick,
  ...props
}: NavigationLinkProps) {
  const { showLoading } = useLoading();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Show loading immediately when link is clicked
    if (shouldShowLoading) {
      showLoading(loadingType);
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return <Link {...props} onClick={handleClick} />;
}
