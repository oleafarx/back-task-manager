import { Request, Response } from 'express';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { Message } from '../../../../utils/contants';
import { getErrorMessage } from '../../../../utils/helpers';
import { log } from 'firebase-functions/logger';

const authService = new AuthService();

export const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json(Message._400_BAD_REQUEST('Refresh token is required'));
        }
        const newAccessToken = authService.refreshAccessToken(refreshToken);
        const response = {
            accessToken: newAccessToken,
            tokenType: 'Bearer',
            expiresIn: '15m'
        }

        return res.status(200).json(Message._200_OPERATION_SUCCESSFUL(response));
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        log('Error refreshing token:', errorMessage);

        if (errorMessage.includes('expired')) {
            return res.status(401).json(Message._401_UNAUTHORIZED('Refresh token expired. Please login again.'));
        }

        if (errorMessage.includes('Invalid')) {
            return res.status(401).json(Message._401_UNAUTHORIZED('Invalid refresh token'));
        }

        return res.status(500).json(Message._500_INTERNAL_SERVER_ERROR(errorMessage));
    }
}