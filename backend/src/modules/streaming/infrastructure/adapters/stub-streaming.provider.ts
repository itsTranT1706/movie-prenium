import { Injectable, Logger } from '@nestjs/common';
import { StreamingProviderPort, StreamManifest } from '../../domain';

/**
 * Stub Streaming Provider
 * 
 * PLACEHOLDER implementation for development.
 * 
 * FUTURE IMPLEMENTATIONS:
 * - SelfHostedStreamingProvider: Local media server (e.g., HLS from your server)
 * - CDNStreamingProvider: AWS CloudFront, Cloudflare Stream, etc.
 * - ThirdPartyStreamingProvider: External streaming APIs
 */
@Injectable()
export class StubStreamingProvider implements StreamingProviderPort {
    private readonly logger = new Logger(StubStreamingProvider.name);

    async getStreamUrl(movieId: string): Promise<string | null> {
        this.logger.log(`[STUB] Getting stream URL for movie: ${movieId}`);
        // TODO: Replace with actual streaming provider implementation
        return null;
    }

    async getStreamManifest(movieId: string): Promise<StreamManifest | null> {
        this.logger.log(`[STUB] Getting stream manifest for movie: ${movieId}`);
        // TODO: Replace with actual streaming provider implementation
        return null;
    }

    async validateAccess(userId: string, movieId: string): Promise<boolean> {
        this.logger.log(`[STUB] Validating access for user: ${userId}, movie: ${movieId}`);
        // TODO: Implement actual access validation (subscriptions, purchases, etc.)
        return true; // Allow all in development
    }
}
