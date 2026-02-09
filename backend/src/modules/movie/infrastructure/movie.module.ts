import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MOVIE_REPOSITORY, MOVIE_PROVIDER, REACTION_REPOSITORY } from '../domain';
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
    ReactToMovieUseCase,
    GetReactionStatsUseCase,
    GetMovieCastUseCase,
    GetMoviesByActorUseCase,
    GetActorProfileUseCase,
} from '../application';
import {
    PrismaMovieRepository,
    KKPhimMovieProvider,
    TMDBMovieProvider,
    KKPhimStreamingAdapter,
    NguonCStreamingAdapter,
    StreamingProviderRegistry,
    PrismaReactionRepository,

} from './adapters';
import { MovieController, MovieReactionController } from './controllers';

@Module({
    imports: [HttpModule],
    controllers: [MovieController, MovieReactionController],

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
        GetMovieCastUseCase,
        GetMoviesByActorUseCase,
        GetActorProfileUseCase,

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

        // Reaction implementation
        ReactToMovieUseCase,
        GetReactionStatsUseCase,
        {
            provide: REACTION_REPOSITORY,
            useClass: PrismaReactionRepository,
        },
    ],
    exports: [MOVIE_REPOSITORY, MOVIE_PROVIDER, StreamingProviderRegistry, REACTION_REPOSITORY],
})
export class MovieModule { }
