import { Router } from "express";
import { refreshTokenController } from "@/interfaces/http/express/controllers/auth.controller";

jest.mock('express', () => ({
    Router: jest.fn(() => ({
        post: jest.fn(),
    }))
}));

jest.mock('@/interfaces/http/express/controllers/auth.controller', () => ({
    refreshTokenController: jest.fn(),
}));

describe('Auth Routes,', () => {
    let mockRouter: any;

    beforeEach(() => {
        mockRouter = {
            post: jest.fn(),
        };
        (Router as jest.Mock).mockReturnValue(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should configure all routes correctle', () => {
        require('@/interfaces/http/express/routes/auth.routes');

        expect(mockRouter.post).toHaveBeenCalledWith('/refresh', refreshTokenController);
    })

    it('should export the router instance', () => {
        const router = require('@/interfaces/http/express/routes/auth.routes').default;
        expect(router).toBeDefined();
    });
})