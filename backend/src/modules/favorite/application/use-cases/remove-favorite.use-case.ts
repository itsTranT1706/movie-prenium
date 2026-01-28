import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { FAVORITE_REPOSITORY, FavoriteRepositoryPort } from '../../domain';
import { MOVIE_REPOSITORY, MovieRepositoryPort } from '@/modules/movie/domain';

export interface RemoveFavoriteInput {
    userId: string;
    movieId: string; // Can be internal UUID or externalId
}

@Injectable()
export class RemoveFavoriteUseCase {
    private readonly logger = new Logger(RemoveFavoriteUseCase.name);

    constructor(
        @Inject(FAVORITE_REPOSITORY)
        private readonly favoriteRepository: FavoriteRepositoryPort,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(input: RemoveFavoriteInput): Promise<Result<void>> {
        this.logger.log(`Removing favorite - userId: ${input.userId}, movieId: ${input.movieId}`);
        
        let internalMovieId = input.movieId;

        // Try to find movie by externalId first if movieId doesn't look like a UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.movieId);
        
        if (!isUUID) {
            this.logger.log(`MovieId ${input.movieId} is not a UUID, trying to find by externalId`);
            // This is likely an externalId (TMDB ID), try to find the movie
            const movie = await this.movieRepository.findByExternalId(input.movieId);
            if (movie) {
                internalMovieId = movie.id;
                this.logger.log(`Found movie by externalId: ${movie.id} - ${movie.title}`);
            } else {
                // Movie not found by externalId, maybe it doesn't exist
                this.logger.warn(`Movie not found by externalId: ${input.movieId}`);
                return Result.fail(new Error('Movie not found'));
            }
        } else {
            this.logger.log(`MovieId ${input.movieId} is a UUID, using directly`);
        }

        // Check if favorite exists
        this.logger.log(`Checking if favorite exists for userId: ${input.userId}, movieId: ${internalMovieId}`);
        const existing = await this.favoriteRepository.findByUserAndMovie(
            input.userId,
            internalMovieId,
        );

        if (!existing) {
            this.logger.warn(`Favorite not found for userId: ${input.userId}, movieId: ${internalMovieId}`);
            return Result.fail(new Error('Movie not in favorites'));
        }

        this.logger.log(`Deleting favorite: ${existing.id}`);
        await this.favoriteRepository.deleteByUserAndMovie(input.userId, internalMovieId);
        this.logger.log(`Successfully removed favorite for movieId: ${internalMovieId}`);
        return Result.ok(undefined);
    }
}
