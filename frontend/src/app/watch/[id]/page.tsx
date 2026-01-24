import { serverApi } from '@/lib/api/server';
import { WatchPageClient } from '@/components/features/watch-page-client';
import { notFound } from 'next/navigation';

export default async function WatchPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ id: string }>;
    searchParams: Promise<{ server?: string; episode?: string }>;
}) {
    const { id } = await params;
    const { server, episode } = await searchParams;
    let movie: any = null;
    
    try {
        movie = await serverApi.getMovieDetails(id);
    } catch (error) {
        console.error('Failed to fetch movie details:', error);
    }

    if (!movie) {
        notFound();
    }

    // Build servers and episodes from movie sources data
    // Each source represents a different streaming server (VIP #1, VIP #2, etc.)
    const seasons = [];
    if (movie.sources && movie.sources.length > 0) {
        movie.sources.forEach((source: any, sourceIndex: number) => {
            if (source.episodes && source.episodes.length > 0) {
                seasons.push({
                    id: `server${sourceIndex + 1}`,
                    number: sourceIndex + 1,
                    name: source.serverName || `Server ${sourceIndex + 1}`,
                    episodes: source.episodes.map((ep: any) => ({
                        id: `e${ep.episodeNumber}`,
                        number: ep.episodeNumber,
                        title: ep.title || `Tập ${ep.episodeNumber}`,
                    })),
                });
            }
        });
    }
    
    // Fallback if no sources
    if (seasons.length === 0) {
        seasons.push({
            id: 'server1',
            number: 1,
            name: 'Server 1',
            episodes: [{ id: 'e1', number: 1, title: movie.title }],
        });
    }

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
            currentServerId={server || 'server1'}
            currentEpisodeId={episode || 'e1'}
        />
    );
}
