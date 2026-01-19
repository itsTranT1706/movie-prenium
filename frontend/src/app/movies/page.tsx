import { MovieCard } from '@/components/features';
import { Search, Filter, ChevronDown } from 'lucide-react';

export default function MoviesPage() {
    // Real TMDB poster URLs
    const movies = [
        { id: '1', title: 'Dune: Part Two', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', rating: 8.8, year: 2024, quality: '4K', isNew: true },
        { id: '2', title: 'Oppenheimer', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', rating: 8.9, year: 2023, quality: '4K' },
        { id: '3', title: 'The Batman', posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvez8tKL8rLj5Bjs.jpg', rating: 8.0, year: 2022, quality: 'HD' },
        { id: '4', title: 'Avatar 2', posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', rating: 7.8, year: 2022, quality: '4K' },
        { id: '5', title: 'Top Gun: Maverick', posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', rating: 8.4, year: 2022, quality: 'HD' },
        { id: '6', title: 'Spider-Verse', posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', rating: 8.7, year: 2023, quality: '4K' },
        { id: '7', title: 'Barbie', posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', rating: 7.0, year: 2023, quality: 'HD' },
        { id: '8', title: 'John Wick 4', posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7LsyBnq43j2k.jpg', rating: 8.1, year: 2023, quality: '4K' },
        { id: '9', title: 'Guardians 3', posterUrl: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', rating: 8.0, year: 2023, quality: '4K' },
        { id: '10', title: 'The Creator', posterUrl: 'https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg', rating: 7.2, year: 2023, quality: 'HD' },
        { id: '11', title: 'Godzilla x Kong', posterUrl: 'https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg', rating: 7.2, year: 2024, quality: '4K', isNew: true },
        { id: '12', title: 'Kung Fu Panda 4', posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', rating: 7.0, year: 2024, quality: 'HD', isNew: true },
        { id: '13', title: 'Civil War', posterUrl: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg', rating: 7.5, year: 2024, quality: '4K', isNew: true },
        { id: '14', title: 'Furiosa', posterUrl: 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg', rating: 8.0, year: 2024, quality: '4K', isNew: true },
        { id: '15', title: 'Inside Out 2', posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', rating: 8.2, year: 2024, quality: 'HD', isNew: true },
        { id: '16', title: 'Deadpool 3', posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', rating: 8.5, year: 2024, quality: '4K', isNew: true },
        { id: '17', title: 'The Godfather', posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', rating: 9.2, year: 1972, quality: 'HD' },
        { id: '18', title: 'Interstellar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.7, year: 2014, quality: '4K' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-20 pb-8">
            <div className="container">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-white">Movies</h1>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="search"
                                placeholder="Search movies..."
                                className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-700"
                            />
                        </div>

                        {/* Genre Filter */}
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm text-gray-300 hover:border-gray-700 transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Genre</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {/* Year Filter */}
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm text-gray-300 hover:border-gray-700 transition-colors">
                            <span>Year</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {/* Quality Filter */}
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm text-gray-300 hover:border-gray-700 transition-colors">
                            <span>Quality</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                {/* Load More */}
                <div className="flex justify-center mt-8">
                    <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors">
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
}
