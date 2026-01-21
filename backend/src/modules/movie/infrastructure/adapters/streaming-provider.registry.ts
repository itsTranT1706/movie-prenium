import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { StreamingProviderPort } from '../../domain';
import { KKPhimStreamingAdapter } from './kkphim-streaming.adapter';
import { NguonCStreamingAdapter } from './nguonc-streaming.adapter';

/**
 * Streaming Provider Registry
 * 
 * Manages streaming providers dynamically.
 * 
 * To add a new provider:
 * 1. Create adapter implementing StreamingProviderPort
 * 2. Add class to PROVIDER_CLASSES array below
 * 3. Register in MovieModule providers
 */
@Injectable()
export class StreamingProviderRegistry implements OnModuleInit {
    private readonly logger = new Logger(StreamingProviderRegistry.name);
    private providers: StreamingProviderPort[] = [];

    /**
     * List of provider classes to collect.
     * Add new adapters here to register them automatically.
     */
    private static readonly PROVIDER_CLASSES = [
        KKPhimStreamingAdapter,
        NguonCStreamingAdapter,
        // Future: VieONStreamingAdapter, FPTPlayStreamingAdapter, etc.
    ];

    constructor(private readonly moduleRef: ModuleRef) { }

    /**
     * Called on module initialization.
     * Collects all registered provider instances.
     */
    async onModuleInit() {
        for (const ProviderClass of StreamingProviderRegistry.PROVIDER_CLASSES) {
            try {
                const provider = this.moduleRef.get(ProviderClass, { strict: false });
                if (provider) {
                    this.providers.push(provider);
                    this.logger.log(`Registered streaming provider: ${provider.providerName}`);
                }
            } catch {
                this.logger.warn(`Provider ${ProviderClass.name} not available`);
            }
        }
        this.logger.log(`Total streaming providers registered: ${this.providers.length}`);
    }

    /**
     * Get all registered streaming providers
     */
    getProviders(): StreamingProviderPort[] {
        return this.providers;
    }

    /**
     * Get a specific provider by name
     */
    getProviderByName(name: string): StreamingProviderPort | undefined {
        return this.providers.find(p => p.providerName === name);
    }
}
