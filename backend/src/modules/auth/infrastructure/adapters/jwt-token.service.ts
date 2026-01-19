import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort, TokenPayload } from '../../domain';

@Injectable()
export class JwtTokenService implements TokenServicePort {
    constructor(private readonly jwtService: JwtService) { }

    generateAccessToken(payload: TokenPayload): string {
        return this.jwtService.sign(payload);
    }

    generateRefreshToken(payload: TokenPayload): string {
        return this.jwtService.sign(payload, { expiresIn: '30d' });
    }

    verifyToken(token: string): TokenPayload | null {
        try {
            return this.jwtService.verify<TokenPayload>(token);
        } catch {
            return null;
        }
    }
}
