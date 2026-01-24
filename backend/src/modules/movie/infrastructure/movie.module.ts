import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MOVIE_REPOSITORY, MOVIE_PROVIDER } from '../domain';
import {
    SearchMoviesUseCase,
    GetPopularMoviesUseCase,
    GetTopRatedMoviesUseCase,
    GetMovieStreamsUseCase,
    GetCinemaMoviesUseCase,
    GetMoviesByGenreUseCase,
    GetMoviesByCountryUseCase,
    GetTrendingMoviesUseCase,
    GetUpcomingMoviesUseCase,
    GetMovieDetailsUseCase,
    FilterMoviesUseCase,
} from '../application';
import {
    PrismaMovieRepository,
    KKPhimMovieProvider,
    TMDBMovieProvider,
    KKPhimStreamingAdapter,
    NguonCStreamingAdapter,
    StreamingProviderRegistry,
} from './adapters';
import { MovieController } from './controllers';

@Module({
    imports: [HttpModule],
    controllers: [MovieController],
    providers: [
        // Use Cases
        SearchMoviesUseCase,
        GetPopularMoviesUseCase,
        GetTopRatedMoviesUseCase,
        GetMovieStreamsUseCase,
        GetCinemaMoviesUseCase,
        GetMoviesByGenreUseCase,
        GetMoviesByCountryUseCase,
        GetTrendingMoviesUseCase,
        GetUpcomingMoviesUseCase,
        GetMovieDetailsUseCase,
        FilterMoviesUseCase,

        // Repository binding (Port -> Adapter)
        {
            provide: MOVIE_REPOSITORY,
            useClass: PrismaMovieRepository,
        },

        // Movie Provider - TMDB as primary metadata source
        TMDBMovieProvider, // Direct class provider for DI
        {
            provide: MOVIE_PROVIDER,
            useExisting: TMDBMovieProvider, // Use same instance
        },

        // KKPhim Provider (kept for fallback)
        KKPhimMovieProvider,

        // Streaming Providers (add new adapters here)
        KKPhimStreamingAdapter,
        NguonCStreamingAdapter,

        // Provider Registry - collects all streaming providers
        StreamingProviderRegistry,
    ],
    exports: [MOVIE_REPOSITORY, MOVIE_PROVIDER, StreamingProviderRegistry],
})
export class MovieModule { }
