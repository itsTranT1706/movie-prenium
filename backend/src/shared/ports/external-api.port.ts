/**
 * External API Port - Abstraction for all external service integrations
 * This ensures we are provider-agnostic
 * 
 * Today: Third-party APIs (TMDB, etc.)
 * Tomorrow: Self-hosted solutions
 */
export interface ExternalApiPort<TRequest, TResponse> {
    execute(request: TRequest): Promise<TResponse>;
}

/**
 * Health check for external services
 */
export interface ExternalServiceHealthPort {
    isHealthy(): Promise<boolean>;
    getServiceName(): string;
}
