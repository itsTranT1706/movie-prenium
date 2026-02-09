'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MoviesFilterPage } from '@/features/movies';

function SearchContent() {
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

/**
 * Search Results Page with Pagination
 * Displays full search results with filter capabilities
 */
export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
                <div className="text-white">Loading search results...</div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
