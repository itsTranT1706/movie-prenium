import { Movie } from '@/modules/movie/domain';

/**
 * ========================================
 * NATURAL LANGUAGE PORT - STUB INTERFACE
 * ========================================
 * 
 * NOT IMPLEMENTED - Interface definition only
 * 
 * This port defines the contract for NLP-powered features.
 * When AI features are needed, implement this interface with:
 * - Semantic search (understand intent, not just keywords)
 * - Conversational AI for movie discovery
 * - Multi-language support
 * 
 * USAGE:
 * Any module needing NLP capabilities can inject this port.
 */
export interface NaturalLanguagePort {
    /**
     * Semantic search - understand user intent
     * @param query - Natural language query like "movies like inception but more emotional"
     */
    semanticSearch(query: string): Promise<Movie[]>;

    /**
     * Generate embeddings for text
     * @param text - Text to embed
     */
    generateEmbedding(text: string): Promise<number[]>;

    /**
     * Chat-based movie discovery
     * @param conversation - Conversation history
     */
    conversationalSearch(conversation: ConversationMessage[]): Promise<ConversationResponse>;

    /**
     * Translate text
     * @param text - Text to translate
     * @param targetLanguage - Target language code
     */
    translate(text: string, targetLanguage: string): Promise<string>;
}

export interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ConversationResponse {
    message: string;
    suggestedMovies: Movie[];
    followUpQuestions: string[];
}

export const NATURAL_LANGUAGE = Symbol('NATURAL_LANGUAGE');
