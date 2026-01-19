/**
 * Token Service Port - Abstraction for token generation/validation
 */
export interface TokenServicePort {
    generateAccessToken(payload: TokenPayload): string;
    generateRefreshToken(payload: TokenPayload): string;
    verifyToken(token: string): TokenPayload | null;
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
