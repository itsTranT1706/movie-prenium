import { MoviesTrendingPage } from '@/components/features';
import { serverApi } from '@/lib/api/server';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function TrendingMoviesPage() {
    let trendingMovies: any[] = [];

    try {
        trendingMovies = await serverApi.getTrendingMovies('week');
        console.log('🔥 Loaded trending movies:', trendingMovies.length);
    } catch (error) {
        console.error('❌ Failed to fetch trending movies:', error);
    }

    return <MoviesTrendingPage initialMovies={trendingMovies} />;
}

export const metadata = {
    title: 'Phim Trending - Movie Streaming',
    description: 'Xem phim trending tuần này, phim hot nhất hiện nay',
};
