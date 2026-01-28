import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Result } from '@/shared/domain';
import { Favorite, FAVORITE_REPOSITORY, FavoriteRepositoryPort } from '../../domain';
import { MOVIE_REPOSITORY, MovieRepositoryPort, Movie } from '@/modules/movie/domain';

export interface AddFavoriteInput {
    userId: string;
    movieId: string; // Can be internal UUID or externalId
    externalId?: string; // Optional externalId if movieId is not UUID
    movieData?: any; // Optional movie data to create if not exists
}

@Injectable()
export class AddFavoriteUseCase {
    private readonly logger = new Logger(AddFavoriteUseCase.name);

    constructor(
        @Inject(FAVORITE_REPOSITORY)
        private readonly favoriteRepository: FavoriteRepositoryPort,
        @Inject(MOVIE_REPOSITORY)
        private readonly movieRepository: MovieRepositoryPort,
    ) { }

    async execute(input: AddFavoriteInput): Promise<Result<Favorite>> {
        this.logger.log(`Adding favorite - userId: ${input.userId}, movieId: ${input.movieId}, externalId: ${input.externalId}`);

        // Try to find movie by internal UUID first
        let movie = await this.movieRepository.findById(input.movieId);
        if (movie) {
            this.logger.log(`Found movie by internal UUID: ${movie.id} - ${movie.title}`);
        }

        // If not found by UUID, try externalId
        if (!movie && input.externalId) {
            movie = await this.movieRepository.findByExternalId(input.externalId);
            if (movie) {
                this.logger.log(`Found movie by externalId (from input): ${movie.id} - ${movie.title}`);
            }
        }

        // If not found by externalId, try using movieId as externalId
        if (!movie) {
            movie = await this.movieRepository.findByExternalId(input.movieId);
            if (movie) {
                this.logger.log(`Found movie by externalId (from movieId): ${movie.id} - ${movie.title}`);
            }
        }

        // If still not found and movieData provided, create new movie
        if (!movie && input.movieData) {
            this.logger.log(`Creating new movie with externalId: ${input.externalId || input.movieId}`);
            const newMovie = Movie.create(uuidv4(), {
                externalId: input.externalId || input.movieId,
                title: input.movieData.title,
                originalTitle: input.movieData.originalTitle,
                mediaType: input.movieData.mediaType || 'movie',
                description: input.movieData.description,
                posterUrl: input.movieData.posterUrl,
                backdropUrl: input.movieData.backdropUrl,
                trailerUrl: input.movieData.trailerUrl,
                releaseDate: input.movieData.releaseDate ? new Date(input.movieData.releaseDate) : undefined,
                duration: input.movieData.duration,
                rating: input.movieData.rating,
                genres: input.movieData.genres || [],
                imdbId: input.movieData.imdbId,
                originalLanguage: input.movieData.originalLanguage,
                provider: input.movieData.provider || 'tmdb',
                streamUrl: input.movieData.streamUrl,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            movie = await this.movieRepository.save(newMovie);
            this.logger.log(`Created new movie: ${movie.id} - ${movie.title}`);
        }

        // If still no movie found, return error
        if (!movie) {
            this.logger.warn(`Movie not found and no movieData provided`);
            return Result.fail(new Error('Movie not found. Please provide movie data.'));
        }

        // IMPORTANT: Check if already favorited using the internal movie.id
        // This ensures we check against the actual movie record, not the input movieId
        this.logger.log(`Checking if movie ${movie.id} is already favorited by user ${input.userId}`);
        const existing = await this.favoriteRepository.findByUserAndMovie(
            input.userId,
            movie.id, // Use the resolved internal movie.id
        );

        if (existing) {
            this.logger.warn(`Movie ${movie.id} already in favorites for user ${input.userId}`);
            // Return a specific error message for duplicate favorites
            return Result.fail(new Error('Movie already in favorites'));
        }

        // Create new favorite with the internal movie.id
        const favorite = Favorite.create(uuidv4(), {
            userId: input.userId,
            movieId: movie.id, // Always use internal movie.id
            createdAt: new Date(),
        });

        await this.favoriteRepository.save(favorite);
        this.logger.log(`Successfully added favorite: ${favorite.id} for movie ${movie.id}`);
        return Result.ok(favorite);
    }
}
