import {
  HeroBanner,
  MovieRow,
  ContinueWatching,
  GenreCardGrid,
  TrendingSection,
  CountryMoviesSection,
  TheaterMoviesSection,
  Top10MoviesSection,
  UpcomingMoviesSection,
} from '@/components/features';
import { LazySection } from '@/components/ui';

/**
 * Homepage - Movie Streaming Platform
 * Cinema-style layout with real TMDB poster data
 * Uses LazySection for scroll-based lazy loading
 */
export default function HomePage() {
  const isLoggedIn = true;

  // Real TMDB poster URLs with full preview data
  const trendingMovies = [
    { id: '1', title: 'Dune: Part Two', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w', rating: 8.8, year: 2024, quality: '4K', isNew: true, genres: ['Sci-Fi', 'Adventure', 'Drama'], duration: '2h 46m', ageRating: '13+' },
    { id: '2', title: 'Oppenheimer', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg', rating: 8.9, year: 2023, quality: '4K', genres: ['Biography', 'Drama', 'History'], duration: '3h 0m', ageRating: '16+' },
    { id: '3', title: 'The Batman', posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvez8tKL8rLj5Bjs.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4', rating: 8.0, year: 2022, quality: 'HD', genres: ['Action', 'Crime', 'Drama'], duration: '2h 56m', ageRating: '13+' },
    { id: '4', title: 'Avatar 2', posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg', trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0', rating: 7.8, year: 2022, quality: '4K', genres: ['Sci-Fi', 'Adventure', 'Action'], duration: '3h 12m', ageRating: '13+' },
    { id: '5', title: 'Top Gun: Maverick', posterUrl: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg', trailerUrl: 'https://www.youtube.com/watch?v=giXco2jaZ_4', rating: 8.4, year: 2022, quality: 'HD', genres: ['Action', 'Drama'], duration: '2h 11m', ageRating: '13+' },
    { id: '6', title: 'Spider-Verse', posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/nGxUxi3PfXDRm7Vg95VBNgNM8yc.jpg', trailerUrl: 'https://www.youtube.com/watch?v=shW9i6k8cB0', rating: 8.7, year: 2023, quality: '4K', isNew: true, genres: ['Animation', 'Action', 'Adventure'], duration: '2h 20m', ageRating: '7+' },
    { id: '7', title: 'Barbie', posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/nHf61UzkfFno5X1ofIhugCPus2R.jpg', trailerUrl: 'https://www.youtube.com/watch?v=pBk4NYhWNMM', rating: 7.0, year: 2023, quality: 'HD', genres: ['Comedy', 'Adventure', 'Fantasy'], duration: '1h 54m', ageRating: '13+' },
    { id: '8', title: 'John Wick 4', posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7LsyBnq43j2k.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/i8dshLvq4LE3s0v8PrkDdUyb1ae.jpg', trailerUrl: 'https://www.youtube.com/watch?v=qEVUtrk8_B4', rating: 8.1, year: 2023, quality: '4K', genres: ['Action', 'Thriller', 'Crime'], duration: '2h 49m', ageRating: '18+' },
    { id: '9', title: 'Guardians 3', posterUrl: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/5i3ghCXVLNhewrBjTesMgy4FHT6.jpg', trailerUrl: 'https://www.youtube.com/watch?v=u3V5KDHRQvk', rating: 8.0, year: 2023, quality: '4K', genres: ['Action', 'Adventure', 'Sci-Fi'], duration: '2h 30m', ageRating: '13+' },
    { id: '10', title: 'The Creator', posterUrl: 'https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/kjQBrc00fB2RjHZB3PGR4w9ibpz.jpg', trailerUrl: 'https://www.youtube.com/watch?v=ex3C1-5Dhb8', rating: 7.2, year: 2023, quality: 'HD', genres: ['Sci-Fi', 'Thriller', 'Action'], duration: '2h 13m', ageRating: '13+' },
  ];

  const newReleases = [
    { id: '11', title: 'Godzilla x Kong', posterUrl: 'https://image.tmdb.org/t/p/w500/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/xRd1eJIDe7JHO5u4gtEYwGn5wtf.jpg', trailerUrl: 'https://www.youtube.com/watch?v=lV1OOlGwExM', rating: 7.2, year: 2024, quality: '4K', isNew: true, genres: ['Action', 'Sci-Fi', 'Adventure'], duration: '1h 55m', ageRating: '13+' },
    { id: '12', title: 'Kung Fu Panda 4', posterUrl: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/kYgQzzjNis5jJalYtIHgrom0gOx.jpg', trailerUrl: 'https://www.youtube.com/watch?v=_inKs4eeHiI', rating: 7.0, year: 2024, quality: 'HD', isNew: true, genres: ['Animation', 'Action', 'Comedy'], duration: '1h 34m', ageRating: '7+' },
    { id: '13', title: 'Civil War', posterUrl: 'https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/z121dSTR7PY9KxKuvwiIFSYW8cf.jpg', trailerUrl: 'https://www.youtube.com/watch?v=aDyQxtg0V2w', rating: 7.5, year: 2024, quality: '4K', isNew: true, genres: ['War', 'Action', 'Drama'], duration: '1h 49m', ageRating: '18+' },
    { id: '14', title: 'Furiosa', posterUrl: 'https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/3TNSoa0UHGEzEz5ndXGjJVKo8RJ.jpg', trailerUrl: 'https://www.youtube.com/watch?v=XJMuhwVlca4', rating: 8.0, year: 2024, quality: '4K', isNew: true, genres: ['Action', 'Adventure', 'Sci-Fi'], duration: '2h 28m', ageRating: '16+' },
    { id: '15', title: 'Inside Out 2', posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg', trailerUrl: 'https://www.youtube.com/watch?v=LEjhY15eCx0', rating: 8.2, year: 2024, quality: 'HD', isNew: true, genres: ['Animation', 'Family', 'Adventure'], duration: '1h 36m', ageRating: '7+' },
    { id: '16', title: 'Deadpool 3', posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg', trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk', rating: 8.5, year: 2024, quality: '4K', isNew: true, genres: ['Action', 'Comedy', 'Sci-Fi'], duration: '2h 8m', ageRating: '18+' },
    { id: '17', title: 'Kingdom of the Planet', posterUrl: 'https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/fypydCipcWDKDTTCoPucBsdGYXW.jpg', trailerUrl: 'https://www.youtube.com/watch?v=XtFI7SNtVpY', rating: 7.3, year: 2024, quality: 'HD', isNew: true, genres: ['Sci-Fi', 'Adventure', 'Action'], duration: '2h 25m', ageRating: '13+' },
    { id: '18', title: 'Challengers', posterUrl: 'https://image.tmdb.org/t/p/w500/H6vke7zGiuLsz4v4RPeReb9Az5p.jpg', backdropUrl: 'https://image.tmdb.org/t/p/w780/nxxCPRGTzxUH8SFMrIsvMmdxHti.jpg', trailerUrl: 'https://www.youtube.com/watch?v=IzJu7Fy-S6E', rating: 7.8, year: 2024, quality: 'HD', isNew: true, genres: ['Romance', 'Drama', 'Sport'], duration: '2h 11m', ageRating: '16+' },
  ];

  const featuredSeries = [
    { id: '19', title: 'Shogun', posterUrl: 'https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg', rating: 9.0, year: 2024, quality: '4K', isNew: true },
    { id: '20', title: 'The Bear', posterUrl: 'https://image.tmdb.org/t/p/w500/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg', rating: 8.7, year: 2024, quality: 'HD' },
    { id: '21', title: 'House of Dragon', posterUrl: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg', rating: 8.5, year: 2024, quality: '4K' },
    { id: '22', title: 'The Last of Us', posterUrl: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', rating: 8.8, year: 2023, quality: '4K' },
    { id: '23', title: 'Wednesday', posterUrl: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg', rating: 8.1, year: 2022, quality: 'HD' },
    { id: '24', title: 'Fallout', posterUrl: 'https://image.tmdb.org/t/p/w500/AnsSKR9LuK0T9bAOcPVA3PUvyWj.jpg', rating: 8.4, year: 2024, quality: '4K', isNew: true },
    { id: '25', title: 'True Detective', posterUrl: 'https://image.tmdb.org/t/p/w500/ao8qYeVUBBBxjDuedWN9DeRXHNL.jpg', rating: 8.2, year: 2024, quality: 'HD' },
    { id: '26', title: '3 Body Problem', posterUrl: 'https://image.tmdb.org/t/p/w500/eyxKREf9ADz02bPvWfHvPR2MNEJ.jpg', rating: 7.8, year: 2024, quality: '4K', isNew: true },
  ];

  const continueWatchingItems = [
    { id: '27', title: 'Breaking Bad', posterUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', rating: 9.5, progress: 75, episodeInfo: 'S5 E14 • 23:14 left' },
    { id: '28', title: 'Stranger Things', posterUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', rating: 8.7, progress: 40, episodeInfo: 'S4 E6 • 45:30 left' },
    { id: '29', title: 'The Witcher', posterUrl: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', rating: 8.0, progress: 90, episodeInfo: 'S3 E8 • 10:00 left' },
    { id: '30', title: 'Peaky Blinders', posterUrl: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg', rating: 8.8, progress: 55, episodeInfo: 'S6 E3 • 35:00 left' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Banner - Always visible */}
      <HeroBanner />

      {/* Content sections - seamless transition with hero */}
      <div className="relative z-10 -mt-12 lg:-mt-16">
        {/* Genre Section - Above fold, no lazy load */}
        <GenreCardGrid />

        {/* Continue Watching - Above fold */}
        <ContinueWatching items={continueWatchingItems} isLoggedIn={isLoggedIn} />

        {/* Country Movies - Lazy loaded */}
        <LazySection minHeight="280px" sectionKey="country">
          <CountryMoviesSection />
        </LazySection>

        {/* Trending - Lazy loaded */}
        <LazySection minHeight="350px" sectionKey="trending">
          <MovieRow
            title="Trending This Week"
            href="/trending"
            movies={trendingMovies}
            icon="trending"
          />
        </LazySection>

        {/* Theater Movies - Lazy loaded */}
        <LazySection minHeight="300px" sectionKey="theater">
          <TheaterMoviesSection />
        </LazySection>

        {/* Top 10 Movies - Lazy loaded */}
        <LazySection minHeight="400px" sectionKey="top10">
          <Top10MoviesSection />
        </LazySection>

        {/* Upcoming Movies - Lazy loaded */}
        <LazySection minHeight="280px" sectionKey="upcoming">
          <UpcomingMoviesSection />
        </LazySection>

        {/* Trending Section - Lazy loaded */}
        <LazySection minHeight="400px" sectionKey="stats">
          <TrendingSection />
        </LazySection>

        {/* Featured Series - Lazy loaded */}
        <LazySection minHeight="350px" sectionKey="series">
          <MovieRow
            title="Featured Series"
            href="/series"
            movies={featuredSeries}
            icon="series"
          />
        </LazySection>

        {/* New Releases - Lazy loaded */}
        <LazySection minHeight="350px" sectionKey="new">
          <MovieRow
            title="New Releases"
            href="/new"
            movies={newReleases}
            icon="new"
          />
        </LazySection>
      </div>
    </div>
  );
}
