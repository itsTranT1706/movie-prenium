'use client';

import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, PanelLeftClose, PanelLeft } from 'lucide-react';
import { MoviesGrid } from '@/components/features/movies-grid';
import { FilterSidebar, FilterState } from '@/components/features/filter-sidebar';
import { MobileFilterDrawer } from '@/components/features/mobile-filter-drawer';

// Mock movie data - replace with actual API call
const MOCK_MOVIES = [
    { id: '1', title: 'Dune: Part Two', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', rating: 8.8, year: 2024, quality: '4K', isNew: true, genres: ['Sci-Fi', 'Adventure'], country: 'United States' },
    { id: '2', title: 'Oppenheimer', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', rating: 8.9, year: 2023, quality: '4K', genres: ['Biography', 'Drama'], country: 'United States' },
    { id: '3', title: 'The Batman', posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvez8tKL8rLj5Bjs.jpg', rating: 8.0, year: 2022, quality: 'HD', genres: ['Action', 'Crime'], country: 'United States' },
    { id: '4', title: 'Avatar 2', posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', rating: 7.8, year: 2022, quality: '4K', genres: ['Sci-Fi', 'Adventure'], country: 'United States' },
    { id: '5', title: 'Top Gun: Maverick', posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', rating: 8.4, year: 2022, quality: 'HD', genres: ['Action', 'Drama'], country: 'United States' },
    { id: '6', title: 'Spider-Verse', posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', rating: 8.7, year: 2023, quality: '4K', isNew: true, genres: ['Animation', 'Action'], country: 'United States' },
    { id: '7', title: 'Barbie', posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', rating: 7.0, year: 2023, quality: 'HD', genres: ['Comedy', 'Adventure'], country: 'United States' },
    { id: '8', title: 'John Wick 4', posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7LsyBnq43j2k.jpg', rating: 8.1, year: 2023, quality: '4K', genres: ['Action', 'Thriller'], country: 'United States' },
    { id: '9', title: 'Guardians 3', posterUrl: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', rating: 8.0, year: 2023, quality: '4K', genres: ['Action', 'Adventure'], country: 'United States' },
    { id: '10', title: 'The Creator', posterUrl: 'https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg', rating: 7.2, year: 2023, quality: 'HD', genres: ['Sci-Fi', 'Thriller'], country: 'United States' },
    { id: '11', title: 'Godzilla x Kong', posterUrl: 'https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg', rating: 7.2, year: 2024, quality: '4K', isNew: true, genres: ['Action', 'Sci-Fi'], country: 'United States' },
    { id: '12', title: 'Kung Fu Panda 4', posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', rating: 7.0, year: 2024, quality: 'HD', isNew: true, genres: ['Animation', 'Action'], country: 'United States' },
    { id: '13', title: 'Civil War', posterUrl: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg', rating: 7.5, year: 2024, quality: '4K', isNew: true, genres: ['War', 'Action'], country: 'United States' },
    { id: '14', title: 'Furiosa', posterUrl: 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg', rating: 8.0, year: 2024, quality: '4K', isNew: true, genres: ['Action', 'Adventure'], country: 'United States' },
    { id: '15', title: 'Inside Out 2', posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', rating: 8.2, year: 2024, quality: 'HD', isNew: true, genres: ['Animation', 'Family'], country: 'United States' },
    { id: '16', title: 'Deadpool 3', posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', rating: 8.5, year: 2024, quality: '4K', isNew: true, genres: ['Action', 'Comedy'], country: 'United States' },
    { id: '17', title: 'Kingdom of the Planet', posterUrl: 'https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg', rating: 7.3, year: 2024, quality: 'HD', isNew: true, genres: ['Sci-Fi', 'Adventure'], country: 'United States' },
    { id: '18', title: 'Challengers', posterUrl: 'https://image.tmdb.org/t/p/w500/H6vke7zGiuLsz4v4RPeReb9Az5p.jpg', rating: 7.8, year: 2024, quality: 'HD', isNew: true, genres: ['Romance', 'Drama'], country: 'United States' },
    { id: '19', title: 'Parasite', posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', rating: 8.6, year: 2019, quality: 'Full HD', genres: ['Drama', 'Thriller'], country: 'South Korea' },
    { id: '20', title: 'Spirited Away', posterUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', rating: 8.6, year: 2001, quality: 'HD', genres: ['Animation', 'Fantasy'], country: 'Japan' },
];

export default function MoviesPage() {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        genres: [],
        countries: [],
        yearRange: [1990, 2026],
        qualities: [],
        languages: [],
        status: [],
    });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop sidebar state

    // Keyboard shortcut: Ctrl+B to toggle sidebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                setIsSidebarOpen((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter movies based on current filters
    const filteredMovies = useMemo(() => {
        return MOCK_MOVIES.filter((movie) => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (!movie.title.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Genre filter
            if (filters.genres.length > 0) {
                const hasMatchingGenre = movie.genres?.some((genre) =>
                    filters.genres.includes(genre)
                );
                if (!hasMatchingGenre) return false;
            }

            // Country filter
            if (filters.countries.length > 0) {
                if (!movie.country || !filters.countries.includes(movie.country)) {
                    return false;
                }
            }

            // Year range filter
            if (movie.year) {
                if (movie.year < filters.yearRange[0] || movie.year > filters.yearRange[1]) {
                    return false;
                }
            }

            // Quality filter
            if (filters.qualities.length > 0) {
                if (!movie.quality || !filters.qualities.includes(movie.quality)) {
                    return false;
                }
            }

            return true;
        });
    }, [filters]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-16 lg:pt-20">
            {/* Filter Toggle Buttons */}
            <div className="fixed top-20 right-4 z-30 flex gap-2">
                {/* Mobile Filter Button */}
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 bg-[#141414] text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-[#1a1a1a] transition-colors"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                    {(filters.genres.length + filters.countries.length + filters.qualities.length) > 0 && (
                        <span className="bg-white text-black text-xs px-2 py-0.5 rounded-full font-medium">
                            {filters.genres.length + filters.countries.length + filters.qualities.length}
                        </span>
                    )}
                </button>

                {/* Desktop Sidebar Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden lg:flex items-center gap-2 bg-[#141414] text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-[#1a1a1a] transition-colors group"
                    title="Toggle Sidebar (Ctrl+B)"
                >
                    {isSidebarOpen ? (
                        <>
                            <PanelLeftClose className="w-4 h-4" />
                            <span className="text-sm">Hide Filters</span>
                        </>
                    ) : (
                        <>
                            <PanelLeft className="w-4 h-4" />
                            <span className="text-sm">Show Filters</span>
                        </>
                    )}
                    <span className="text-xs text-gray-500 group-hover:text-gray-400 ml-1">Ctrl+B</span>
                </button>
            </div>

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                filters={filters}
                onFilterChange={setFilters}
            />

            {/* Main Layout */}
            <div className="flex gap-4 lg:gap-6 p-4 lg:p-6 max-w-[2000px] mx-auto transition-all duration-300">
                {/* Left Sidebar - Desktop Only */}
                <div 
                    className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${
                        isSidebarOpen ? 'w-1/5 opacity-100' : 'w-0 opacity-0 overflow-hidden'
                    }`}
                >
                    <div className="sticky top-20 border-r border-white/10 pr-6">
                        <FilterSidebar filters={filters} onFilterChange={setFilters} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`flex-1 transition-all duration-300 ${
                    isSidebarOpen ? 'w-full lg:w-4/5' : 'w-full'
                }`}>
                    {/* Header */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                        <h1 className="text-3xl font-bold text-white mb-2">All Movies</h1>
                        <p className="text-gray-400">
                            {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'} found
                        </p>
                    </div>

                    {/* Movies Grid */}
                    {filteredMovies.length > 0 ? (
                        <MoviesGrid initialMovies={filteredMovies} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="text-center">
                                <p className="text-xl text-gray-400 mb-2">No movies found</p>
                                <p className="text-sm text-gray-500">Try adjusting your filters</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
