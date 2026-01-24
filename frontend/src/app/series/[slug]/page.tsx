import { MoviesFilterPage } from '@/components/features';
import { serverApi } from '@/lib/api/server';
import { notFound } from 'next/navigation';

interface TypePageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

// Type mapping for display names and API slugs
const TYPE_CONFIG: Record<string, { name: string; apiSlug: string }> = {
    'phim-bo': { name: 'Phim Bộ', apiSlug: 'phim-bo' },
    'phim-le': { name: 'Phim Lẻ', apiSlug: 'phim-le' },
    'tv-shows': { name: 'TV Shows', apiSlug: 'tv-shows' },
    'hoat-hinh': { name: 'Hoạt Hình', apiSlug: 'hoat-hinh' },
};

export default async function TypePage({ params, searchParams }: TypePageProps) {
    const { slug } = await params;
    const { page = '1' } = await searchParams;
    const currentPage = Math.max(1, parseInt(page, 10));

    // Validate type slug
    const typeConfig = TYPE_CONFIG[slug];
    if (!typeConfig) {
        notFound();
    }

    // Fetch initial movies for the type
    let initialMovies: any[] = [];
    try {
        initialMovies = await serverApi.getMoviesByType(typeConfig.apiSlug, currentPage);
    } catch (error) {
        console.error('Failed to fetch movies by type:', error);
    }

    return (
        <MoviesFilterPage
            initialMovies={initialMovies}
            initialPage={currentPage}
            pageTitle={typeConfig.name}
            baseUrl={`/series/${slug}`}
            initialFilters={{ type: typeConfig.apiSlug }}
        />
    );
}

export async function generateMetadata({ params }: TypePageProps) {
    const { slug } = await params;
    const typeConfig = TYPE_CONFIG[slug];
    const typeName = typeConfig?.name || slug;

    return {
        title: `${typeName} - Movie Streaming`,
        description: `Xem ${typeName} mới nhất, chất lượng cao, vietsub nhanh nhất`,
    };
}
