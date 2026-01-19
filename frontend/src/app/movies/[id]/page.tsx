import Link from 'next/link';
import { Play, Plus, Star, Clock, Calendar, Film, ArrowLeft } from 'lucide-react';
import { MovieRow } from '@/components/features';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
    // Sample movie data - would come from API
    const movie = {
        id: params.id,
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.',
        backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
        rating: 8.8,
        year: 2024,
        duration: '2h 46m',
        quality: '4K',
        genres: ['Sci-Fi', 'Adventure', 'Drama'],
        director: 'Denis Villeneuve',
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Josh Brolin'],
    };

    const similarMovies = [
        { id: '2', title: 'Dune', posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', rating: 8.0, year: 2021, quality: '4K' },
        { id: '3', title: 'Arrival', posterUrl: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', rating: 7.9, year: 2016, quality: 'HD' },
        { id: '4', title: 'Blade Runner 2049', posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', rating: 8.0, year: 2017, quality: '4K' },
        { id: '5', title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.7, year: 2014, quality: '4K' },
        { id: '6', title: 'The Martian', posterUrl: 'https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg', rating: 8.0, year: 2015, quality: 'HD' },
        { id: '7', title: 'Sicario', posterUrl: 'https://image.tmdb.org/t/p/w500/8dp7M8MOkyK7DhnVVnjpIFvPKZ0.jpg', rating: 7.6, year: 2015, quality: 'HD' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Hero Section */}
            <div className="relative h-[50vh] lg:h-[60vh]">
                {/* Backdrop */}
                <div className="absolute inset-0">
                    <img
                        src={movie.backdropUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />

                {/* Back Button */}
                <Link
                    href="/movies"
                    className="absolute top-20 left-4 lg:left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm">Back</span>
                </Link>
            </div>

            {/* Content */}
            <div className="relative -mt-32 lg:-mt-40">
                <div className="container">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Poster */}
                        <div className="hidden lg:block flex-shrink-0 w-[200px]">
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">
                                {movie.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                                    <Star className="w-4 h-4 fill-yellow-400" />
                                    {movie.rating}
                                </span>
                                <span className="flex items-center gap-1 text-gray-400 text-sm">
                                    <Calendar className="w-4 h-4" />
                                    {movie.year}
                                </span>
                                <span className="flex items-center gap-1 text-gray-400 text-sm">
                                    <Clock className="w-4 h-4" />
                                    {movie.duration}
                                </span>
                                <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">
                                    {movie.quality}
                                </span>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-2xl">
                                {movie.description}
                            </p>

                            {/* CTA */}
                            <div className="flex gap-3 mb-6">
                                <Link
                                    href={`/watch/${movie.id}`}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition-colors"
                                >
                                    <Play className="w-5 h-5 fill-black" />
                                    <span>Play</span>
                                </Link>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-700/50 text-white font-semibold text-sm rounded hover:bg-gray-700 transition-colors">
                                    <Plus className="w-5 h-5" />
                                    <span>My List</span>
                                </button>
                            </div>

                            {/* Credits */}
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-400">
                                    <span className="text-gray-500">Director:</span>{' '}
                                    <span className="text-white">{movie.director}</span>
                                </p>
                                <p className="text-gray-400">
                                    <span className="text-gray-500">Cast:</span>{' '}
                                    <span className="text-white">{movie.cast.join(', ')}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Movies */}
                <div className="mt-8">
                    <MovieRow
                        title="You May Also Like"
                        movies={similarMovies}
                    />
                </div>
            </div>
        </div>
    );
}
