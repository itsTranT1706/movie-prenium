'use client';

import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, PanelLeftClose, PanelLeft } from 'lucide-react';
import { MovieCard } from '@/components/features';
import { FilterSidebar, FilterState } from '@/components/features/filter-sidebar';
import { MobileFilterDrawer } from '@/components/features/mobile-filter-drawer';
import { MoviePagination } from '@/components/features/movie-pagination';

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
    movies: Movie[];
    currentPage: number;
    totalPages: number;
    pageTitle?: string;
    baseUrl?: string;
}

export function MoviesPageClient({ 
    movies, 
    currentPage, 
    totalPages, 
    pageTitle = 'Phim Phổ Biến',
    baseUrl = '/movies'
}: MoviesPageClientProps) {
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
            <div className="fixed top-20 right-4 lg:right-8 z-30 flex gap-2">
                {/* Mobile Filter Button */}
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 bg-[#141414] text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-[#1a1a1a] transition-colors shadow-lg"
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
                    className="hidden lg:flex items-center gap-2 bg-[#141414] text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-[#1a1a1a] transition-colors group shadow-lg"
                    title="Toggle Sidebar (Ctrl+B)"
                >
                    {isSidebarOpen ? (
                        <>
                            <PanelLeftClose className="w-4 h-4" />
                            <span className="text-sm">Ẩn Bộ Lọc</span>
                        </>
                    ) : (
                        <>
                            <PanelLeft className="w-4 h-4" />
                            <span className="text-sm">Hiện Bộ Lọc</span>
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
            <div className="flex gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2000px] mx-auto transition-all duration-300">
                {/* Left Sidebar - Desktop Only */}
                <div
                    className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="sticky top-24 border-r border-white/10 pr-6">
                        <FilterSidebar filters={filters} onFilterChange={setFilters} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`flex-1 min-w-0 transition-all duration-300`}>
                    {/* Header */}
                    <div className="mb-8 pb-6 border-b border-white/10">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{pageTitle}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="font-medium text-white">{filteredMovies.length}</span>
                            <span>{filteredMovies.length === 1 ? 'phim' : 'phim'}</span>
                            {totalPages > 1 && (
                                <>
                                    <span className="text-gray-600">•</span>
                                    <span>Trang {currentPage} / {totalPages}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Movies Grid */}
                    {filteredMovies.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 lg:gap-5">
                                {filteredMovies.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} enablePreview={true} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <MoviePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                baseUrl={baseUrl}
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="text-center">
                                <p className="text-xl text-gray-400 mb-2">Không tìm thấy phim</p>
                                <p className="text-sm text-gray-500">Thử điều chỉnh bộ lọc của bạn</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
