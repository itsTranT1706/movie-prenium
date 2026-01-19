import { Module } from '@nestjs/common';
import { MOVIE_REPOSITORY, MOVIE_PROVIDER } from '../domain';
import { SearchMoviesUseCase, GetPopularMoviesUseCase } from '../application';
import { PrismaMovieRepository, StubMovieProvider } from './adapters';
import { MovieController } from './controllers';

@Module({
    controllers: [MovieController],
    providers: [
        // Use Cases
        SearchMoviesUseCase,
        GetPopularMoviesUseCase,
        // Repository binding (Port -> Adapter)
        {
            provide: MOVIE_REPOSITORY,
            useClass: PrismaMovieRepository,
        },
        // Provider binding - SWAP THIS when integrating real providers
        {
            provide: MOVIE_PROVIDER,
            useClass: StubMovieProvider,
        },
    ],
    exports: [MOVIE_REPOSITORY, MOVIE_PROVIDER],
})
export class MovieModule { }
