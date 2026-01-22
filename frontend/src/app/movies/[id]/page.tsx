import Link from 'next/link';
import { Play, Plus, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { MovieRow, EpisodeSelector, CommentSection } from '@/components/features';
import { serverApi } from '@/lib/api/server';
import { MovieDetailClient } from '@/components/features/movie-detail-client';
import { notFound } from 'next/navigation';

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

    // Sample episodes data - always show at least episode 1
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

    // Sample comments data
    const comments = [
        { id: '1', user: 'Alex Chen', avatar: 'AC', text: 'Phim hay quá!', time: '2 giờ trước' },
        { id: '2', user: 'Sarah Miller', avatar: 'SM', text: 'Đáng xem!', time: '5 giờ trước' },
    ];

    // Fetch similar movies
    let similarMovies: any[] = [];
    try {
        const popularMovies = await serverApi.getPopularMovies(1);
        similarMovies = popularMovies.slice(0, 6).map((m) => ({
            id: m.id,
            externalId: m.externalId,
            title: m.title,
            posterUrl: m.posterUrl,
            rating: m.rating,
            year: m.releaseDate ? new Date(m.releaseDate).getFullYear() : undefined,
            quality: m.quality || 'HD',
        }));
    } catch (error) {
        console.error('Failed to fetch similar movies:', error);
    }

    // Sample top weekly movies
    const topWeeklyMovies = similarMovies.slice(0, 6).map((m, i) => ({
        id: m.id,
        title: m.title,
        subtitle: '',
        posterUrl: m.posterUrl,
        season: 'T13',
        episode: `${m.year || 2024}`,
    }));

    return (
        <MovieDetailClient
            movie={movie}
            seasons={seasons}
            comments={comments}
            similarMovies={similarMovies}
            topWeeklyMovies={topWeeklyMovies}
        />
    );
}
