'use client';

import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, PanelLeftClose, PanelLeft } from 'lucide-react';
import { MovieCard } from '@/components/features';
import { FilterSidebar, FilterState } from '@/components/features/filter-sidebar';
import { MobileFilterDrawer } from '@/components/features/mobile-filter-drawer';
import { StageSpotlight } from '@/components/ui/stage-spotlight';
import { apiClient } from '@/lib/api';
import { Movie } from '@/types';

interface MoviesUnifiedPageProps {
    initialMovies: Movie[];
    pageTitle?: string;
    initialFilters?: Partial<FilterState>;
    // API endpoint to fetch more pages (for popular/trending/etc)
    // Example: "/movies/popular" will call with ?page=2
    apiEndpoint?: string;
}

export function MoviesUnifiedPage({ 
    initialMovies, 
    pageTitle = 'Phim', 
    initialFilters = {},
    apiEndpoint,
}: MoviesUnifiedPageProps) {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        genres: [],
        countries: [],
        yearRange: [1990, 2026],
        qualities: [],
        languages: [],
        status: [],
        ...initialFilters,
    });
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUsingFilterApi, setIsUsingFilterApi] = useState(false);

    // Initialize: load first page if we have apiEndpoint and no initial filters
    useEffect(() => {
        const hasInitialFilters = Object.keys(initialFilters).length > 0;
        if (!hasInitialFilters && apiEndpoint && initialMovies.length > 0) {
            // For TMDB API, we already have initial movies, just set pagination
            // TMDB popular usually returns 20 items per page
            setTotalPages(initialMovies.length >= 20 ? 2 : 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Check if user has applied additional filters beyond initial filters
    const hasAdditionalFilters = 
        filters.search !== '' ||
        filters.genres.length > (initialFilters.genres?.length || 0) ||
        filters.countries.length > (initialFilters.countries?.length || 0) ||
        filters.qualities.length > (initialFilters.qualities?.length || 0) ||
        filters.languages.length > (initialFilters.languages?.length || 0) ||
        filters.status.length > (initialFilters.status?.length || 0) ||
        filters.yearRange[0] !== 1990 ||
        filters.yearRange[1] !== 2026 ||
        // Check if filters differ from initial
        JSON.stringify(filters.genres.sort()) !== JSON.stringify((initialFilters.genres || []).sort()) ||
        JSON.stringify(filters.countries.sort()) !== JSON.stringify((initialFilters.countries || []).sort());

    // Fetch movies using filter API
    const fetchFilteredMovies = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        setIsUsingFilterApi(true);
        
        try {
            const response = await apiClient.filterMovies({
                search: filters.search || undefined,
                genres: filters.genres.length > 0 ? filters.genres : undefined,
                countries: filters.countries.length > 0 ? filters.countries : undefined,
                yearFrom: filters.yearRange[0] !== 1990 ? filters.yearRange[0] : undefined,
                yearTo: filters.yearRange[1] !== 2026 ? filters.yearRange[1] : undefined,
                qualities: filters.qualities.length > 0 ? filters.qualities : undefined,
                languages: filters.languages.length > 0 ? filters.languages : undefined,
                status: filters.status.length > 0 ? filters.status : undefined,
                page,
                limit: 24,
            });

            if (response.success && response.data) {
                setMovies(response.data);
                setCurrentPage(page);
                
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages || 1);
                } else {
                    setTotalPages(response.data.length >= 24 ? page + 1 : page);
                }
            }
        } catch (error) {
            console.error('❌ Filter API error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Fetch movies using original API (for popular/trending)
    const fetchOriginalMovies = useCallback(async (page: number = 1) => {
        if (!apiEndpoint) return;
        
        setIsLoading(true);
        setIsUsingFilterApi(false);
        
        try {
            const response = await apiClient.get(`${apiEndpoint}?page=${page}&limit=24`);
            if (response.success && response.data) {
                setMovies(response.data);
                setCurrentPage(page);
                
                // Check if pagination info is available
                if (response.pagination && response.pagination.totalPages) {
                    setTotalPages(response.pagination.totalPages);
                } else {
                    // Estimate: if we got full page, there might be more
                    setTotalPages(response.data.length >= 24 ? page + 1 : page);
                }
            }
        } catch (error) {
            console.error('❌ Original API error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint]);

    // Handle filter changes
    useEffect(() => {
        // If we have initial filters (genre/country pages), always use filter API
        const hasInitialFilters = Object.keys(initialFilters).length > 0;
        
        if (hasInitialFilters || hasAdditionalFilters) {
            // Use filter API (KKPhim)
            const timer = setTimeout(() => {
                fetchFilteredMovies(1);
            }, 500);
            
            return () => clearTimeout(timer);
        } else {
            // No filters - reset to initial TMDB movies
            setMovies(initialMovies);
            setCurrentPage(1);
            setIsUsingFilterApi(false);
            // Set pagination for TMDB data
            setTotalPages(initialMovies.length >= 20 ? 2 : 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, hasAdditionalFilters, fetchFilteredMovies]);

    // Handle page change
    const handlePageChange = (page: number) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (isUsingFilterApi || Object.keys(initialFilters).length > 0) {
            fetchFilteredMovies(page);
        } else {
            fetchOriginalMovies(page);
        }
    };

    const activeFilterCount = 
        (filters.search ? 1 : 0) +
        filters.genres.length + 
        filters.countries.length + 
        filters.qualities.length +
        filters.languages.length +
        filters.status.length +
        (filters.yearRange[0] !== 1990 || filters.yearRange[1] !== 2026 ? 1 : 0);

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-16 lg:pt-20 relative overflow-hidden">
            <StageSpotlight color="gold" intensity="medium" />

            {/* Filter Toggle Buttons */}
            <div className="fixed top-20 right-4 lg:right-8 z-30 flex gap-2">
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 bg-[#141414] text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-[#1a1a1a] transition-colors shadow-lg"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-white text-black text-xs px-2 py-0.5 rounded-full font-medium">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden lg:flex items-center gap-2 bg-[#141414] text-white px-4 py-2 rounded-xl border border-white/10 hover:bg-[#1a1a1a] transition-colors group shadow-lg"
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
            <div className="flex gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2000px] mx-auto transition-all duration-300 relative z-10">
                {/* Left Sidebar */}
                <div
                    className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${
                        isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'
                    }`}
                >
                    <div className="sticky top-24 border-r border-white/10 pr-6">
                        <FilterSidebar filters={filters} onFilterChange={setFilters} />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 transition-all duration-300">
                    {/* Header */}
                    <div className="mb-8 pb-6 border-b border-white/10">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                            {pageTitle}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            {isLoading ? (
                                <span>Đang tải...</span>
                            ) : (
                                <>
                                    <span className="font-medium text-white">{movies.length}</span>
                                    <span>phim</span>
                                    {totalPages > 1 && (
                                        <>
                                            <span className="text-gray-600">•</span>
                                            <span>Trang {currentPage} / {totalPages}</span>
                                        </>
                                    )}
                                    {activeFilterCount > 0 && (
                                        <>
                                            <span className="text-gray-600">•</span>
                                            <span className="text-yellow-500">{activeFilterCount} bộ lọc</span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}

                    {/* Movies Grid */}
                    {!isLoading && movies.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 lg:gap-5">
                                {movies.map((movie, index) => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={{
                                            ...movie,
                                            duration: movie.duration ? `${movie.duration} phút` : undefined,
                                        }}
                                        enablePreview={true}
                                        priority={index < 6}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-[#141414] text-white rounded-xl border border-white/10 hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Trước
                                        </button>
                                        <span className="px-4 py-2 text-white">
                                            Trang {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-[#141414] text-white rounded-xl border border-white/10 hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Sau
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Empty State */}
                    {!isLoading && movies.length === 0 && (
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
