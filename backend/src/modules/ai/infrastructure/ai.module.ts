import { Module } from '@nestjs/common';
import { AI_RECOMMENDATION, CONTENT_ANALYSIS, NATURAL_LANGUAGE } from '../domain';
import { StubAIAdapter } from './adapters';

/**
 * ========================================
 * AI MODULE - STUB ONLY
 * ========================================
 * 
 * This module exports AI ports so other modules can
 * optionally inject AI capabilities.
 * 
 * Currently, only StubAIAdapter is registered.
 * All methods throw NotImplementedError.
 * 
 * FUTURE IMPLEMENTATION:
 * When AI features are needed:
 * 1. Add AI SDK dependencies (OpenAI, TensorFlow, etc.)
 * 2. Create real adapter implementations
 * 3. Replace stub bindings with real implementations
 * 
 * Other modules (recommendation, movie, etc.) can then
 * inject AI ports and use AI capabilities seamlessly.
 */
@Module({
    providers: [
        // Stub implementations - will throw NotImplementedError
        {
            provide: AI_RECOMMENDATION,
            useClass: StubAIAdapter,
        },
        // CONTENT_ANALYSIS and NATURAL_LANGUAGE are not registered
        // because they have no stub adapter yet.
        // Register them when implementations are available.
    ],
    exports: [
        AI_RECOMMENDATION,
        // CONTENT_ANALYSIS,
        // NATURAL_LANGUAGE,
    ],
})
export class AIModule { }
