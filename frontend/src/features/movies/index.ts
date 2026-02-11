// Movies feature barrel export
export { default as MovieCard } from './components/movie-card';
export { default as MovieRow } from './components/movie-row';
export { MoviesGrid } from './components/movies-grid';
export { MoviePagination } from './components/movie-pagination';
export { FilterSidebar } from './components/filter-sidebar';
export type { FilterState } from './components/filter-sidebar';
export { MobileFilterDrawer } from './components/mobile-filter-drawer';
export { MoviesFilterPage } from './components/movies-filter-page';
export { MoviesFilterPageSimple } from './components/movies-filter-page-simple';
export { MoviesTrendingPage } from './components/movies-trending-page';
export { MoviesUnifiedPage } from './components/movies-unified-page';
export { MoviesPageClient } from './components/movies-page-client';
export { MovieDetailClient } from './components/movie-detail-client';
export { ShortsCarousel } from './components/shorts-carousel';
export { ShortsFeed } from './components/shorts-feed';

// API services
export { movieService } from './api/movie.service';
export { favoriteService } from './api/favorite.service';
export { watchHistoryService } from './api/watch-history.service';
export type { WatchHistoryItem } from './api/watch-history.service';
