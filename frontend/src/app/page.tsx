import {
  HeroBanner,
  MobileHeroCarousel,
  ContinueWatchingWrapper,
  GenreCardGrid,
  TheaterMoviesWrapper,
  Top10MoviesWrapper,
  TrendingSectionWrapper,
  CountryMoviesWrapper,
  UpcomingMoviesWrapper,
  UpcomingMoviesSkeleton,
  TheaterMoviesSkeleton,
  TrendingSectionSkeleton,
  Top10MoviesSkeleton,
  MovieRowSkeleton,
} from '@/features/home';
import { MovieRow } from '@/features/movies';
import { LazySection } from '@/shared/components/ui';
import { serverApi } from '@/shared/lib/api/server';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

/**
 * Homepage - Movie Streaming Platform
 * Cinema-style layout with real TMDB poster data
 * Uses Server Components for data fetching
 */
export default async function HomePage() {
  const isLoggedIn = true;

  // Fetch all data on server with error handling
  let trendingData: any[] = [];
  let popularData: any[] = [];
  let topBannerData: any[] = [];

  try {
    [trendingData, popularData, topBannerData] = await Promise.all([
      serverApi.getTrendingMovies('week'),
      serverApi.getPopularMovies(1),
      serverApi.getTopBanners(),
    ]);
    // console.log('[HomePage] Fetched data:', {
    //   trendingCount: trendingData?.length,
    //   popularCount: popularData?.length,
    //   topBannerCount: topBannerData?.length
    // });
  } catch (error) {
    console.error('[HomePage] Failed to fetch movies:', error);
  }

  // Map top banners for hero section
  const topBannerMovies = (topBannerData || []).map((banner) => ({
    id: banner.id,
    externalId: banner.externalId,
    title: banner.title,
    description: banner.description || '',
    posterUrl: banner.posterUrl || '',
    backdropUrl: banner.backdropUrl || '',
    trailerUrl: banner.trailerUrl,
    rating: banner.rating || 0,
    year: banner.releaseDate ? new Date(banner.releaseDate).getFullYear() : new Date().getFullYear(),
    quality: 'HD',
    genre: banner.genres?.length > 0 ? banner.genres.join(', ') : 'Movie',
    isNew: true,
    genres: banner.genres || [],
    duration: banner.duration ? `${Math.floor(banner.duration / 60)}h ${banner.duration % 60}m` : '',
    ageRating: '13+',
  }));

  // Map trending movies with safety checks (as fallback)
  const trendingMovies = (trendingData || []).slice(0, 10).map((movie) => {
    return {
      id: movie.id,
      externalId: movie.externalId,
      title: movie.title,
      description: movie.description || '',
      logoUrl: movie.logoUrl,
      posterUrl: movie.posterUrl || '',
      backdropUrl: movie.backdropUrl || '',
      trailerUrl: movie.trailerUrl,
      rating: movie.rating || 0,
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : new Date().getFullYear(),
      quality: movie.quality || 'HD',
      genre: movie.genres?.length > 0 ? movie.genres.join(', ') : 'Movie',
      isNew: true,
      genres: movie.genres || [],
      duration: movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : '',
      ageRating: '13+',
    };
  });

  // Map popular movies with safety checks
  const popularMovies = (popularData || []).slice(0, 10).map((movie) => ({
    id: movie.id,
    externalId: movie.externalId,
    title: movie.title,
    description: movie.description || '',
    posterUrl: movie.posterUrl || '',
    backdropUrl: movie.backdropUrl || '',
    logoUrl: movie.logoUrl,
    backdrops: movie.backdrops || [],
    posters: movie.posters || [],
    trailerUrl: movie.trailerUrl,
    rating: movie.rating || 0,
    year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : new Date().getFullYear(),
    quality: movie.quality || 'HD',
    genre: movie.genres?.length > 0 ? movie.genres.join(', ') : 'Movie',
    isNew: true,
    genres: movie.genres || [],
    duration: movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : '',
    ageRating: '13+',
  }));

  // Use popular movies for hero banner
  const heroMovies = popularMovies;

  const featuredMovies = heroMovies.slice(0, 6);
  // console.log('[HomePage] Featured movies for HeroBanner:', {
  //   source: 'popular',
  //   count: featuredMovies.length,
  //   movies: featuredMovies.map(m => ({ id: m.id, externalId: m.externalId, title: m.title }))
  // });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Banner - Always visible */}
      <div className="hidden md:block">
        <HeroBanner
          movies={featuredMovies}
          isLoading={false}
          key={`hero-desktop-${featuredMovies.length}`}
        />
      </div>

      {/* Hero Banner - Mobile (Vertical Carousel) */}
      <div className="md:hidden">
        <MobileHeroCarousel
          movies={featuredMovies}
        />
      </div>

      {/* Content sections - seamless transition with hero */}
      <div className="relative z-10 -mt-12 lg:-mt-16">
        {/* Genre Section - Above fold, no lazy load */}
        <GenreCardGrid />

        {/* Continue Watching - Above fold, client-side fetch */}
        <ContinueWatchingWrapper />

        {/* Trending Section - Mock data for display */}
        <LazySection minHeight="280px" sectionKey="trending-section" loader={<TrendingSectionSkeleton />}>
          <TrendingSectionWrapper />
        </LazySection>

        {/* Country Movies - Lazy loaded */}
        <LazySection minHeight="280px" sectionKey="country">
          <CountryMoviesWrapper />
        </LazySection>

        {/* Trending - Lazy loaded */}
        {trendingMovies.length > 0 && (
          <LazySection minHeight="350px" sectionKey="trending">
            <MovieRow
              title="Trending This Week"
              href="/movies/trending"
              movies={trendingMovies}
              icon="trending"
              fluid
            />
          </LazySection>
        )}

        {/* Theater Movies - Lazy loaded */}
        <LazySection minHeight="300px" sectionKey="theater" loader={<TheaterMoviesSkeleton />}>
          <TheaterMoviesWrapper />
        </LazySection>

        {/* Top 10 Movies - Lazy loaded */}
        <LazySection minHeight="400px" sectionKey="top10" loader={<Top10MoviesSkeleton />}>
          <Top10MoviesWrapper />
        </LazySection>

        {/* Upcoming Movies - Lazy loaded */}
        <LazySection minHeight="280px" sectionKey="upcoming" loader={<UpcomingMoviesSkeleton />}>
          <UpcomingMoviesWrapper />
        </LazySection>

        {/* New Releases - Lazy loaded */}
        {popularMovies.length > 0 && (
          <LazySection minHeight="350px" sectionKey="new" loader={<MovieRowSkeleton />}>
            <MovieRow
              title="New Releases"
              href="/movies"
              movies={popularMovies}
              icon="new"
              fluid
            />
          </LazySection>
        )}
      </div>
    </div>
  );
}
