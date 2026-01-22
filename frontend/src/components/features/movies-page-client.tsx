'use client';

import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, PanelLeftClose, PanelLeft } from 'lucide-react';
import { MoviesGrid } from '@/components/features/movies-grid';
import { FilterSidebar, FilterState } from '@/components/features/filter-sidebar';
import { MobileFilterDrawer } from '@/components/features/mobile-filter-drawer';
import { apiClient } from '@/lib/api';

interface Movie {
    id: string;
    title: string;
    posterUrl?: string;
    backdropUrl?: string;
    releaseDate?: string;
    rating?: number;
    quality?: string;
    genres?: string[];
}

interface MoviesPageClientProps {
    initialMovies: Movie[];
}

export function MoviesPageClient({ initialMovies }: MoviesPageClientProps) {
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [loading, setLoading] = useState(false);

    // Fetch movies based on filters
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            
            // If genre filter is active, fetch by genre
            if (filters.genres.length > 0) {
                const genreSlug = filters.genres[0].toLowerCase().replace(/\s+/g, '-');
                const result = await apiClient.getMoviesByGenre(genreSlug, 1);
                if (result.success && result.data) {
                    setMovies(result.data);
                }
            }
            // If country filter is active, fetch by country
            else if (filters.countries.length > 0) {
                const countrySlug = filters.countries[0].toLowerCase().replace(/\s+/g, '-');
                const result = await apiClient.getMoviesByCountry(countrySlug, 1);
                if (result.success && result.data) {
                    setMovies(result.data);
                }
            }
            // Otherwise use initial movies
            else {
                setMovies(initialMovies);
            }
            
            setLoading(false);
        };
        
        fetchMovies();
    }, [filters.genres, filters.countries, initialMovies]);

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

    // Filter movies based on current filters (client-side filtering for search, year, quality)
    const filteredMovies = useMemo(() => {
        return movies.filter((movie) => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                if (!movie.title.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Year range filter
            if (movie.releaseDate) {
                const year = new Date(movie.releaseDate).getFullYear();
                if (year < filters.yearRange[0] || year > filters.yearRange[1]) {
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
    }, [movies, filters]);

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
