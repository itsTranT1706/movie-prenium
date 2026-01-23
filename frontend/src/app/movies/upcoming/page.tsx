import { MoviesPageClient } from '@/components/features/movies-page-client';
import { serverApi } from '@/lib/api/server';

interface UpcomingMoviesPageProps {
    searchParams: Promise<{ page?: string }>;
}

const TOTAL_PAGES = 100;

export default async function UpcomingMoviesPage({ searchParams }: UpcomingMoviesPageProps) {
    const params = await searchParams;
    const currentPage = Math.max(1, parseInt(params.page || '1', 10));

    let movies: any[] = [];

    try {
        movies = await serverApi.getUpcomingMovies(currentPage);
    } catch (error) {
        console.error('Failed to fetch upcoming movies:', error);
    }

    return (
        <MoviesPageClient
            movies={movies}
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            pageTitle="Phim Sắp Chiếu"
            baseUrl="/movies/upcoming"
        />
    );
}

export const metadata = {
    title: 'Phim Sắp Chiếu - Movie Streaming',
    description: 'Xem phim sắp chiếu, phim mới sắp ra mắt',
};
