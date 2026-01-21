import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MOVIE_REPOSITORY, MOVIE_PROVIDER } from '../domain';
import { SearchMoviesUseCase, GetPopularMoviesUseCase, GetMovieStreamsUseCase, GetCinemaMoviesUseCase } from '../application';
import {
    PrismaMovieRepository,
    KKPhimMovieProvider,
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
        GetMovieStreamsUseCase,
        GetCinemaMoviesUseCase,

        // Repository binding (Port -> Adapter)
        {
            provide: MOVIE_REPOSITORY,
            useClass: PrismaMovieRepository,
        },

        // Movie List Provider (KKPhim - 100% có stream)
        {
            provide: MOVIE_PROVIDER,
            useClass: KKPhimMovieProvider,
        },

        // Streaming Providers (add new adapters here)
        KKPhimStreamingAdapter,
        NguonCStreamingAdapter,

        // Provider Registry - collects all streaming providers
        StreamingProviderRegistry,
    ],
    exports: [MOVIE_REPOSITORY, MOVIE_PROVIDER, StreamingProviderRegistry],
})
export class MovieModule { }
