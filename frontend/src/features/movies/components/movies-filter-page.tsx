'use client';

import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, PanelLeftClose, PanelLeft } from 'lucide-react';
import MovieCard from './movie-card';
import { FilterSidebar, FilterState } from './filter-sidebar';
import { MobileFilterDrawer } from './mobile-filter-drawer';
import { MoviePagination } from './movie-pagination';
import { StageSpotlight } from '@/shared/components/ui';
import { apiClient } from '@/shared/lib/api';
import { Movie } from '@/types';

interface MoviesFilterPageProps {
    initialMovies?: Movie[];
    initialPage?: number;
    pageTitle?: string;
    baseUrl?: string;
    initialSearchQuery?: string;
    initialFilters?: {
        type?: string;
        genres?: string[];
        countries?: string[];
    };
}

export function MoviesFilterPage({
    initialMovies = [],
    initialPage = 1,
    pageTitle = 'Phim Phổ Biến',
    baseUrl = '/movies',
    initialSearchQuery = '',
    initialFilters = {}
}: MoviesFilterPageProps) {
    const [filters, setFilters] = useState<FilterState>({
        search: initialSearchQuery,
        genres: initialFilters.genres || [],
        countries: initialFilters.countries || [],
        yearRange: [1990, 2026],
        qualities: [],
        languages: [],
        status: [],
    });
    const [movieType] = useState<string | undefined>(initialFilters.type); // Store type separately, not in filters
    const [movies, setMovies] = useState<Movie[]>(initialMovies);

    // Sync search filter with initialSearchQuery when URL changes (navigation without remount)
    useEffect(() => {
        setFilters(prev => {
            if (prev.search !== initialSearchQuery) {
                return { ...prev, search: initialSearchQuery };
            }
            return prev;
        });
    }, [initialSearchQuery]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // console.log('MoviesFilterPage rendered with filters:', filters);
    // console.log('Current movies count:', movies.length);
    // console.log('🔢 Pagination state:', { currentPage, totalPages, shouldShowPagination: totalPages > 1 });

    // Handle filter changes
    const handleFilterChange = useCallback((newFilters: FilterState) => {
        // console.log('🎯 handleFilterChange called with:', newFilters);
        setFilters(newFilters);
    }, []);

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

    // Fetch movies with filters
    const fetchMovies = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            // console.log('🎬 Fetching movies with filters:', {
            //     search: filters.search,
            //     genres: filters.genres,
            //     countries: filters.countries,
            //     yearRange: filters.yearRange,
            //     qualities: filters.qualities,
            //     languages: filters.languages,
            //     status: filters.status,
            //     page,
            // });

            const response = await apiClient.filterMovies({
                search: filters.search || undefined,
                genres: filters.genres.length > 0 ? filters.genres : undefined,
                countries: filters.countries.length > 0 ? filters.countries : undefined,
                yearFrom: filters.yearRange[0] !== 1990 ? filters.yearRange[0] : undefined,
                yearTo: filters.yearRange[1] !== 2026 ? filters.yearRange[1] : undefined,
                qualities: filters.qualities.length > 0 ? filters.qualities : undefined,
                languages: filters.languages.length > 0 ? filters.languages : undefined,
                status: filters.status.length > 0 ? filters.status : undefined,
                type: movieType, // Include type from initialFilters
                page,
                limit: 24,
            });

            // console.log('✅ API response:', {
            //     success: response.success,
            //     dataCount: response.data?.length || 0,
            //     pagination: response.pagination,
            // });

            if (response.success && response.data) {
                setMovies(response.data);
                setCurrentPage(page);

                // Calculate total pages from response
                if (response.pagination && response.pagination.totalPages) {
                    console.log('📊 Setting totalPages from API:', response.pagination.totalPages);
                    setTotalPages(response.pagination.totalPages);
                } else if (response.data.length >= 24) {
                    // If we got full page of results, assume there might be more
                    console.log('📊 Full page received, estimating more pages exist');
                    setTotalPages(page + 1);
                } else if (response.data.length > 0) {
                    // Less than full page means this is the last page
                    console.log('📊 Partial page received, this is last page');
                    setTotalPages(page);
                } else {
                    // No results
                    console.log('📊 No results, setting totalPages to 1');
                    setTotalPages(1);
                }

                // console.log('📊 Final state:', {
                //     currentPage: page,
                //     totalPages: response.pagination?.totalPages || 'calculated',
                //     moviesCount: response.data.length
                // });
            }
        } catch (error) {
            console.error('❌ Failed to fetch movies:', error);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Fetch movies when filters change
    useEffect(() => {
        console.log('🔄 Filters changed, scheduling fetch...');
        const debounceTimer = setTimeout(() => {
            console.log('⏰ Debounce timer fired, fetching movies...');
            fetchMovies(1);
        }, 500); // Debounce 500ms for search input

        return () => {
            console.log('🧹 Clearing debounce timer');
            clearTimeout(debounceTimer);
        };
    }, [fetchMovies]);

    // Handle page change
    const handlePageChange = (page: number) => {
        fetchMovies(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {/* Stage Spotlight Effect */}
            <StageSpotlight color="gold" intensity="medium" />

            {/* Filter Toggle Buttons */}
            <div className="fixed top-20 right-4 lg:right-8 z-30 flex gap-2">
                {/* Mobile Filter Button */}
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
                onFilterChange={handleFilterChange}
            />

            {/* Main Layout */}
            <div className="flex gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2000px] mx-auto transition-all duration-300 relative z-10">
                {/* Left Sidebar - Desktop Only */}
                <div
                    className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="sticky top-24 border-r border-white/10 pr-6">
                        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 transition-all duration-300">
                    {/* Header */}
                    <div className="mb-8 pb-6 border-b border-white/10">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{pageTitle}</h1>
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
                                            <span className="text-yellow-500">{activeFilterCount} bộ lọc đang áp dụng</span>
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
