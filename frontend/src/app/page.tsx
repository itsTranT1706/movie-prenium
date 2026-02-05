import {
  HeroBanner,
  MovieRow,
  ContinueWatchingWrapper,
  GenreCardGrid,
  TheaterMoviesWrapper,
  Top10MoviesWrapper,
  TrendingSectionWrapper,
} from '@/components/features';
import { CountryMoviesWrapper } from '@/components/features/country-movies-wrapper';
import { UpcomingMoviesWrapper } from '@/components/features/upcoming-movies-wrapper';
import { LazySection } from '@/components/ui';
import { serverApi } from '@/lib/api/server';

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

  try {
    [trendingData, popularData] = await Promise.all([
      serverApi.getTrendingMovies('week'),
      serverApi.getPopularMovies(1),
    ]);
    // console.log('[HomePage] Fetched data:', {
    //   trendingCount: trendingData?.length,
    //   popularCount: popularData?.length
    // });
  } catch (error) {
    console.error('[HomePage] Failed to fetch movies:', error);
  }

  // Map trending movies with safety checks
  const trendingMovies = (trendingData || []).slice(0, 10).map((movie) => {
    return {
      id: movie.id,
      externalId: movie.externalId,
      title: movie.title,
      description: movie.description || '',
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

  // Use popular movies for hero banner if trending is empty
  const heroMovies = trendingMovies.length > 0 ? trendingMovies : (popularData || []).slice(0, 10).map((movie) => ({
    id: movie.id,
    externalId: movie.externalId,
    title: movie.title,
    description: movie.description || '',
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
  }));

  const featuredMovies = heroMovies.slice(0, 6);
  // console.log('[HomePage] Featured movies for HeroBanner:', {
  //   count: featuredMovies.length,
  //   movies: featuredMovies.map(m => ({ id: m.id, externalId: m.externalId, title: m.title }))
  // });

  // Map popular movies with safety checks
  const popularMovies = (popularData || []).slice(0, 10).map((movie) => ({
    id: movie.id,
    externalId: movie.externalId,
    title: movie.title,
    posterUrl: movie.posterUrl || '',
    backdropUrl: movie.backdropUrl,
    trailerUrl: movie.trailerUrl,
    rating: movie.rating || 0,
    year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : new Date().getFullYear(),
    quality: movie.quality || 'HD',
    genres: movie.genres || [],
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Banner - Always visible */}
      <HeroBanner
        movies={featuredMovies.length > 0 ? featuredMovies : []}
        isLoading={false}
        key={`hero-${featuredMovies.length}`}
      />

      {/* Content sections - seamless transition with hero */}
      <div className="relative z-10 -mt-12 lg:-mt-16">
        {/* Genre Section - Above fold, no lazy load */}
        <GenreCardGrid />

        {/* Continue Watching - Above fold, client-side fetch */}
        <ContinueWatchingWrapper />

        {/* Trending Section - Mock data for display */}
        <LazySection minHeight="280px" sectionKey="country">
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
            />
          </LazySection>
        )}

        {/* Theater Movies - Lazy loaded */}
        <LazySection minHeight="300px" sectionKey="theater">
          <TheaterMoviesWrapper />
        </LazySection>

        {/* Top 10 Movies - Lazy loaded */}
        <LazySection minHeight="400px" sectionKey="top10">
          <Top10MoviesWrapper />
        </LazySection>

        {/* Upcoming Movies - Lazy loaded */}
        <LazySection minHeight="280px" sectionKey="upcoming">
          <UpcomingMoviesWrapper />
        </LazySection>

        {/* New Releases - Lazy loaded */}
        {popularMovies.length > 0 && (
          <LazySection minHeight="350px" sectionKey="new">
            <MovieRow
              title="New Releases"
              href="/movies"
              movies={popularMovies}
              icon="new"
            />
          </LazySection>
        )}
      </div>
    </div>
  );
}
