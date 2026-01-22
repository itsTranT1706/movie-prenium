import { serverApi } from '@/lib/api/server';
import { WatchPageClient } from '@/components/features/watch-page-client';
import { notFound } from 'next/navigation';

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let movie: any = null;
    
    try {
        movie = await serverApi.getMovieDetails(id);
    } catch (error) {
        console.error('Failed to fetch movie details:', error);
    }

    if (!movie) {
        notFound();
    }

    // Sample seasons data
    const seasons = [
        {
            id: 's1',
            number: 1,
            name: 'Phần 1',
            episodes: movie.mediaType !== 'tv' 
                ? [{ id: 'e1', number: 1, title: movie.title }]
                : [
                    { id: 'e1', number: 1, title: 'Episode 1' },
                    { id: 'e2', number: 2, title: 'Episode 2' },
                ],
        },
    ];

    // Sample comments
    const comments = [
        { id: '1', user: 'Alex Chen', avatar: 'AC', text: 'Phim hay quá!', time: '2 giờ trước' },
        { id: '2', user: 'Sarah Miller', avatar: 'SM', text: 'Cảnh quay đẹp tuyệt vời.', time: '5 giờ trước' },
    ];

    // Fetch top weekly movies
    let topWeeklyMovies: any[] = [];
    try {
        const popularMovies = await serverApi.getPopularMovies(1);
        topWeeklyMovies = popularMovies.slice(0, 5).map((m) => ({
            id: m.externalId || m.id,
            title: m.title,
            subtitle: m.originalTitle,
            posterUrl: m.posterUrl,
            season: 'T13',
            episode: `${m.releaseDate ? new Date(m.releaseDate).getFullYear() : 2024}`,
        }));
    } catch (error) {
        console.error('Failed to fetch top movies:', error);
    }

    return (
        <WatchPageClient
            movie={movie}
            seasons={seasons}
            comments={comments}
            topWeeklyMovies={topWeeklyMovies}
        />
    );
}
