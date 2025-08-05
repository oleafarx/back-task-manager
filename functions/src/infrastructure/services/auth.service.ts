import jwt from 'jsonwebtoken'
import { log } from 'firebase-functions/logger'
import { TokenPayload, TokenPair } from '../../domain/entities/token.entity'
import { ParameterStore } from '../../utils/contants'

export class AuthService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;

    constructor() {
        this.accessTokenSecret = ParameterStore.accessTokenSecret,
        this.refreshTokenSecret = ParameterStore.accessTokenSecret
    }

    generateTokenPair(userId: string, email: string): TokenPair {
        try {
            const payload = { userId, email };
            const accessToken = jwt.sign(payload, this.accessTokenSecret, {
                expiresIn: '15m'
            });

            const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
                expiresIn: '7d'
            });

            return { accessToken, refreshToken }
        } catch (error) {
            log('Error generating token pair:', error);
            throw new Error('Failed to generate tokens');
        }
    };

    verifyAccessToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.accessTokenSecret) as TokenPayload
            return decoded;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid access token');
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Access token expired');
            }
            throw new Error('Token verification failed');
        }
    };

    verifyRefreshToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.refreshTokenSecret) as TokenPayload
            return decoded;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid refresh token');
            }
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Refresh token expired');
            }
            throw new Error('Refresh token verification failed');
        }
    };

    refreshAccessToken(refreshToken: string): string {
        try {
            const decoded = this.verifyRefreshToken(refreshToken);

            const newAccessToken = jwt.sign(
                { 
                    userId: decoded.userId, 
                    email: decoded.email 
                },
                this.accessTokenSecret,
                { 
                    expiresIn: '7d',
                }
            );

            return newAccessToken;
        } catch (error) {
            log('Error refreshing access token:', error);
            throw error;
        }
    };

    extractTokenFromHeader(authHeader: string | undefined): string {
        if (!authHeader) {
            throw new Error('Authorization header missing');
        }

        if (!authHeader.startsWith('Bearer ')) {
            throw new Error('Invalid authorization header format');
        }

        const token = authHeader.substring(7); // Remover "Bearer "
        
        if (!token) {
            throw new Error('Token missing in authorization header');
        }

        return token;
    }
}