import { MoviesPageClient } from '@/components/features/movies-page-client';
import { serverApi } from '@/lib/api/server';

interface TopRatedMoviesPageProps {
    searchParams: Promise<{ page?: string }>;
}

const TOTAL_PAGES = 100;

export default async function TopRatedMoviesPage({ searchParams }: TopRatedMoviesPageProps) {
    const params = await searchParams;
    const currentPage = Math.max(1, parseInt(params.page || '1', 10));

    let movies: any[] = [];

    try {
        movies = await serverApi.getTopRatedMovies(currentPage);
    } catch (error) {
        console.error('Failed to fetch top rated movies:', error);
    }

    return (
        <MoviesPageClient
            movies={movies}
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            pageTitle="Phim Đánh Giá Cao"
            baseUrl="/movies/top-rated"
        />
    );
}

export const metadata = {
    title: 'Phim Đánh Giá Cao - Movie Streaming',
    description: 'Xem phim được đánh giá cao nhất, phim hay nhất mọi thời đại',
};
