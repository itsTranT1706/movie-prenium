import { MoviesPageClient } from '@/components/features/movies-page-client';
import { serverApi } from '@/lib/api/server';

interface TrendingMoviesPageProps {
    searchParams: Promise<{ page?: string }>;
}

const TOTAL_PAGES = 100;

export default async function TrendingMoviesPage({ searchParams }: TrendingMoviesPageProps) {
    const params = await searchParams;
    const currentPage = Math.max(1, parseInt(params.page || '1', 10));

    let movies: any[] = [];

    try {
        movies = await serverApi.getTrendingMovies('week');
    } catch (error) {
        console.error('Failed to fetch trending movies:', error);
    }

    return (
        <MoviesPageClient
            movies={movies}
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            pageTitle="Phim Trending"
            baseUrl="/movies/trending"
        />
    );
}

export const metadata = {
    title: 'Phim Trending - Movie Streaming',
    description: 'Xem phim trending tuần này, phim hot nhất hiện nay',
};
