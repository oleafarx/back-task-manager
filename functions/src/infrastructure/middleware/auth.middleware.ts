import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth.services'
import { Message } from '../../utils/contants'
import { log } from 'firebase-functions/logger'

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}
   
const authService = new AuthService();

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authService.extractTokenFromHeader(authHeader);

        const decoded = authService.verifyAccessToken(token);
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        }
        log('User authenticated:', decoded.email);
        next();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        log('Authentication error:', errorMessage);
        
        if (errorMessage.includes('expired')) {
            return res.status(401).json(Message._401_UNAUTHORIZED('Access token expired'));
        }
        
        if (errorMessage.includes('Invalid') || errorMessage.includes('missing')) {
            return res.status(401).json(Message._401_UNAUTHORIZED('Invalid or missing token'));
        }
        
        return res.status(401).json(Message._401_UNAUTHORIZED('Authentication failed'));
    }
}