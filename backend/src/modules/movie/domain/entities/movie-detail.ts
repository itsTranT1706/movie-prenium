import { Movie } from './movie.entity';
import { StreamSource } from './stream-source.entity';

/**
 * Movie Detail Result - Contains movie metadata with streaming sources
 * 
 * Used by movie detail endpoint to return complete movie info including episodes.
 */
export interface MovieDetailResult {
    movie: Movie;
    sources: StreamSource[];
}
