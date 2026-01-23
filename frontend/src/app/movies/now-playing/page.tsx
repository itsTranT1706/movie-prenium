import { MoviesPageClient } from '@/components/features/movies-page-client';
import { serverApi } from '@/lib/api/server';

interface NowPlayingMoviesPageProps {
    searchParams: Promise<{ page?: string }>;
}

const TOTAL_PAGES = 100;

export default async function NowPlayingMoviesPage({ searchParams }: NowPlayingMoviesPageProps) {
    const params = await searchParams;
    const currentPage = Math.max(1, parseInt(params.page || '1', 10));

    let movies: any[] = [];

    try {
        movies = await serverApi.getCinemaMovies(currentPage, 20);
    } catch (error) {
        console.error('Failed to fetch now playing movies:', error);
    }

    return (
        <MoviesPageClient
            movies={movies}
            currentPage={currentPage}
            totalPages={TOTAL_PAGES}
            pageTitle="Phim Đang Chiếu Rạp"
            baseUrl="/movies/now-playing"
        />
    );
}

export const metadata = {
    title: 'Phim Đang Chiếu Rạp - Movie Streaming',
    description: 'Xem phim đang chiếu rạp mới nhất, phim hot trong rạp',
};
