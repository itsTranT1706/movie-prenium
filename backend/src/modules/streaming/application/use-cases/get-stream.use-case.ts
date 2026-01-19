import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@/shared/domain';
import { STREAMING_PROVIDER, StreamingProviderPort, StreamManifest } from '../../domain';

export interface GetStreamInput {
    userId: string;
    movieId: string;
}

@Injectable()
export class GetStreamUseCase {
    constructor(
        @Inject(STREAMING_PROVIDER)
        private readonly streamingProvider: StreamingProviderPort,
    ) { }

    async execute(input: GetStreamInput): Promise<Result<StreamManifest>> {
        // Validate user has access to stream this movie
        const hasAccess = await this.streamingProvider.validateAccess(
            input.userId,
            input.movieId,
        );

        if (!hasAccess) {
            return Result.fail(new Error('Access denied'));
        }

        const manifest = await this.streamingProvider.getStreamManifest(input.movieId);

        if (!manifest) {
            return Result.fail(new Error('Stream not available'));
        }

        return Result.ok(manifest);
    }
}
