import { Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { Movie } from '../../domain';
import { KKPhimMovieProvider } from '../../infrastructure/adapters';

export interface FilterMoviesDto {
    search?: string;
    genres?: string[];
    countries?: string[];
    yearFrom?: number;
    yearTo?: number;
    qualities?: string[];
    languages?: string[];
    status?: string[];
    type?: string; // phim-bo, phim-le, hoat-hinh, tv-shows
    page?: number;
    limit?: number;
}

@Injectable()
export class FilterMoviesUseCase {
    constructor(
        private readonly kkphimProvider: KKPhimMovieProvider,
    ) { }

    async execute(filters: FilterMoviesDto): Promise<Result<{ movies: Movie[]; total: number; page: number; totalPages: number }>> {
        try {
            const page = filters.page || 1;
            const limit = filters.limit || 24;

            let movies: Movie[] = [];
            let apiTotalPages = 1; // Track total pages from API

            // Map language filter to KKPhim sort_lang parameter
            const sortLang = this.mapLanguageToSortLang(filters.languages);
            
            // Get year for API (use yearFrom if specified, otherwise undefined)
            const year = filters.yearFrom;

            // Log filter parameters for debugging
            console.log('Filter parameters:', {
                search: filters.search,
                genres: filters.genres,
                countries: filters.countries,
                yearFrom: filters.yearFrom,
                yearTo: filters.yearTo,
                sortLang,
                page,
                limit
            });

            // Priority 1: Use advanced search if we have search query
            if (filters.search && filters.search.trim()) {
                const result = await this.kkphimProvider.advancedSearchWithPagination({
                    keyword: filters.search,
                    page,
                    limit,
                    sortField: 'modified.time',
                    sortType: 'desc',
                    sortLang,
                    category: filters.genres?.[0],
                    country: filters.countries?.[0],
                    year,
                });
                movies = result.movies;
                apiTotalPages = result.totalPages || 1;
                console.log(`Advanced search returned ${movies.length} movies, ${apiTotalPages} total pages`);
            }
            // Priority 2: Genre filter (even with multiple genres, use first one for API)
            else if (filters.genres && filters.genres.length >= 1) {
                movies = await this.kkphimProvider.getMoviesByGenre(
                    filters.genres[0],
                    page,
                    {
                        sortField: 'modified.time',
                        sortType: 'desc',
                        sortLang,
                        country: filters.countries?.[0],
                        year,
                        limit,
                    }
                );
                // Estimate: KKPhim usually has many pages for genres
                apiTotalPages = movies.length >= limit ? Math.min(page + 10, 50) : page;
                console.log(`Genre filter (${filters.genres[0]}) returned ${movies.length} movies`);
            }
            // Priority 3: Country filter (even with multiple countries, use first one for API)
            else if (filters.countries && filters.countries.length >= 1) {
                movies = await this.kkphimProvider.getMoviesByCountry(
                    filters.countries[0],
                    page,
                    {
                        sortField: 'modified.time',
                        sortType: 'desc',
                        sortLang,
                        category: filters.genres?.[0],
                        year,
                        limit,
                    }
                );
                // Estimate: KKPhim usually has many pages for countries
                apiTotalPages = movies.length >= limit ? Math.min(page + 10, 50) : page;
                console.log(`Country filter (${filters.countries[0]}) returned ${movies.length} movies`);
            }
            // Priority 4: Type filter + optional filters
            else if (filters.type) {
                movies = await this.kkphimProvider.getMoviesByTypeAdvanced(
                    filters.type,
                    page,
                    {
                        sortField: 'modified.time',
                        sortType: 'desc',
                        sortLang,
                        category: filters.genres?.[0],
                        country: filters.countries?.[0],
                        year,
                        limit,
                    }
                );
                // Estimate: KKPhim usually has many pages for types (phim-bo, phim-le, etc)
                apiTotalPages = movies.length >= limit ? Math.min(page + 10, 100) : page;
                console.log(`Type filter (${filters.type}) returned ${movies.length} movies`);
            }
            // Default: Get popular movies
            else {
                movies = await this.kkphimProvider.getPopularMovies(page);
                // Estimate: Popular movies usually have many pages
                apiTotalPages = movies.length >= limit ? Math.min(page + 10, 50) : page;
                console.log(`Popular movies returned ${movies.length} movies`);
            }

            // Apply MINIMAL client-side filters only for criteria not supported by API
            let filteredMovies = movies;
            const initialCount = movies.length;

            // Only filter by year range if yearTo is specified AND different from yearFrom
            if (filters.yearTo && filters.yearTo !== filters.yearFrom) {
                filteredMovies = filteredMovies.filter(movie => {
                    if (!movie.releaseDate) return true; // Keep movies without release date
                    const movieYear = movie.releaseDate.getFullYear();
                    const fromYear = filters.yearFrom || 1900;
                    const toYear = filters.yearTo!;
                    return movieYear >= fromYear && movieYear <= toYear;
                });
                console.log(`Year range filter: ${initialCount} → ${filteredMovies.length} movies`);
            }

            // Only filter by quality if specified
            if (filters.qualities && filters.qualities.length > 0) {
                const beforeQuality = filteredMovies.length;
                filteredMovies = filteredMovies.filter(movie =>
                    movie.quality && filters.qualities!.includes(movie.quality)
                );
                console.log(`Quality filter: ${beforeQuality} → ${filteredMovies.length} movies`);
            }

            // Only filter by status if specified
            if (filters.status && filters.status.length > 0) {
                const beforeStatus = filteredMovies.length;
                filteredMovies = filteredMovies.filter(movie => {
                    if (!movie.episodeCurrent) return true; // Keep movies without episode info
                    
                    const episodeLower = movie.episodeCurrent.toLowerCase();
                    
                    return filters.status!.some(status => {
                        if (status === 'Completed') {
                            return episodeLower.includes('hoàn tất') || episodeLower.includes('full');
                        }
                        if (status === 'Ongoing') {
                            return episodeLower.includes('tập') && !episodeLower.includes('hoàn tất') && !episodeLower.includes('full');
                        }
                        if (status === 'Upcoming') {
                            return episodeLower.includes('sắp chiếu') || episodeLower.includes('trailer');
                        }
                        return false;
                    });
                });
                console.log(`Status filter: ${beforeStatus} → ${filteredMovies.length} movies`);
            }

            console.log(`Final result: ${filteredMovies.length} movies`);

            // Calculate pagination - use API total pages, not filtered count
            // This ensures pagination works correctly even with client-side filters
            const total = filteredMovies.length;
            const totalPages = apiTotalPages; // Use API total pages instead of calculating from filtered results

            console.log(`Pagination: page ${page}/${totalPages}, showing ${total} movies`);

            return Result.ok({
                movies: filteredMovies,
                total,
                page,
                totalPages,
            });
        } catch (error) {
            console.error('Filter movies error:', error);
            return Result.fail(error as Error);
        }
    }

    /**
     * Map frontend language filter to KKPhim sort_lang parameter
     */
    private mapLanguageToSortLang(languages?: string[]): 'vietsub' | 'thuyet-minh' | 'long-tieng' | undefined {
        if (!languages || languages.length === 0) return undefined;
        
        // Priority: Vietsub > Thuyết Minh > Lồng Tiếng
        if (languages.includes('Vietsub')) return 'vietsub';
        if (languages.includes('Thuyết Minh')) return 'thuyet-minh';
        if (languages.includes('Lồng Tiếng')) return 'long-tieng';
        
        return undefined;
    }

    private normalizeString(str: string): string {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }
}
