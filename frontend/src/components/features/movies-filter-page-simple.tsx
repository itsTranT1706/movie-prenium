'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, PanelLeftClose, PanelLeft } from 'lucide-react';
import { MovieCard } from '@/components/features';
import { FilterSidebar, FilterState } from '@/components/features/filter-sidebar';
import { MobileFilterDrawer } from '@/components/features/mobile-filter-drawer';
import { StageSpotlight } from '@/components/ui/stage-spotlight';
import { apiClient } from '@/lib/api';
import { Movie } from '@/types';

interface MoviesFilterPageSimpleProps {
    pageTitle?: string;
    initialFilters?: Partial<FilterState>;
    initialMovies?: Movie[];
}

export function MoviesFilterPageSimple({
    pageTitle = 'Phim Phổ Biến',
    initialFilters = {},
    initialMovies = [],
}: MoviesFilterPageSimpleProps) {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        genres: [],
        countries: [],
        yearRange: [1990, 2026],
        qualities: [],
        languages: [],
        status: [],
        ...initialFilters, // Merge initial filters
    });
    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    console.log('🎬 Component rendered, filters:', filters);
    console.log('📊 Movies count:', movies.length);

    // Fetch movies when filters change
    useEffect(() => {
        console.log('🔄 useEffect triggered, filters:', filters);

        // Check if any filter is active
        const isFilterActive =
            filters.search !== '' ||
            filters.genres.length > 0 ||
            filters.countries.length > 0 ||
            filters.yearRange[0] !== 1990 ||
            filters.yearRange[1] !== 2026 ||
            filters.qualities.length > 0 ||
            filters.languages.length > 0 ||
            filters.status.length > 0;

        // If no filter is active and we have initial movies, use them
        if (!isFilterActive && initialMovies.length > 0) {
            console.log('📦 Using initial movies, no filter active');
            setMovies(initialMovies);
            return;
        }

        setHasAppliedFilter(true);
        setIsLoading(true);

        const timer = setTimeout(async () => {
            console.log('⏰ Debounce timer fired, fetching...');
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
                    page: 1,
                    limit: 24,
                });

                console.log('✅ API response:', {
                    success: response.success,
                    count: response.data?.length || 0,
                });

                if (response.success && response.data) {
                    setMovies(response.data);
                }
            } catch (error) {
                console.error('❌ Fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => {
            console.log('🧹 Cleanup timer');
            clearTimeout(timer);
        };
    }, [filters, initialMovies]);

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

            <MobileFilterDrawer
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
                filters={filters}
                onFilterChange={setFilters}
            />

            <div className="flex gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[2000px] mx-auto transition-all duration-300 relative z-10">
                <div
                    className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="sticky top-24 border-r border-white/10 pr-6">
                        <FilterSidebar filters={filters} onFilterChange={setFilters} />
                    </div>
                </div>

                <div className="flex-1 min-w-0 transition-all duration-300">
                    <div className="mb-8 pb-6 border-b border-white/10">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">{pageTitle}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            {isLoading ? (
                                <span>Đang tải...</span>
                            ) : (
                                <>
                                    <span className="font-medium text-white">{movies.length}</span>
                                    <span>phim</span>
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

                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}

                    {!isLoading && movies.length > 0 && (
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
                    )}

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
