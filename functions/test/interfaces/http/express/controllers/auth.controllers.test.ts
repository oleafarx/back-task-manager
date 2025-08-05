import { refreshTokenController } from "@/interfaces/http/express/controllers/auth.controller";
import { Request, Response } from "express";
import { AuthService } from '@/infrastructure/services/auth.service';
import { Message } from "@/utils/contants";

describe('Auth Controller Tests', () => {
    const mockReq = {
        body: {
            refreshToken: 'fake refreshToken',
        }
    } as unknown as Request;

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should generate a new acess token', async () => {
        const spy1 = jest.spyOn(AuthService.prototype, 'refreshAccessToken');
        const expectedAuth = 'fake accessToken';
        spy1.mockReturnValue(expectedAuth);
        const expected = {
            accessToken: expectedAuth,
            tokenType: 'Bearer',
            expiresIn: '15m'
        }

        await refreshTokenController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('fake refreshToken');
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(Message._200_OPERATION_SUCCESSFUL(expected));
    });

    it('should return 400 if refresh token not exists', async () => {
        const spy1 = jest.spyOn(AuthService.prototype, 'refreshAccessToken');
        const mockReq = {
            body: {
                otherData: 'test',
            }
        } as unknown as Request;        

        await refreshTokenController(mockReq, mockRes);

        expect(spy1).toHaveBeenCalledTimes(0);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith(Message._400_BAD_REQUEST('Refresh token is required'));
    });

    it('should manage error in generate a new acess token', async () => {
        const spy1 = jest.spyOn(AuthService.prototype, 'refreshAccessToken');
        spy1.mockImplementation(() => { throw new Error('Error in refresh token') });


        await refreshTokenController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('fake refreshToken');
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(Message._500_INTERNAL_SERVER_ERROR('Error in refresh token'));
    });
});