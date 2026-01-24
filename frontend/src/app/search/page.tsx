'use client';

import { useSearchParams } from 'next/navigation';
import { MoviesFilterPage } from '@/components/features';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

/**
 * Search Results Page with Pagination
 * Displays full search results with filter capabilities
 */
export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    return (
        <MoviesFilterPage
            initialMovies={[]}
            initialPage={1}
            pageTitle={query ? `Kết quả tìm kiếm: "${query}"` : 'Tìm kiếm phim'}
            baseUrl="/search"
            initialSearchQuery={query}
        />
    );
}
