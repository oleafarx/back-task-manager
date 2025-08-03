import { Router } from "express";
import { 
    createUserController, 
    getUserController
} from "@/interfaces/http/express/controllers/user.controller";

jest.mock('express', () => ({
    Router: jest.fn(() => ({
        post: jest.fn(),
        get: jest.fn(),
    }))
}));

jest.mock('@/interfaces/http/express/controllers/user.controller', () => ({
    createUserController: jest.fn(),
    getUserController: jest.fn()
}));

describe('User Routes', () => {
    let mockRouter: any;

    beforeEach(() => {
        mockRouter = {
            post: jest.fn(),
            get: jest.fn()
        };
        (Router as jest.Mock).mockReturnValue(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should configure POST / route for creating users', () => {
        require('@/interfaces/http/express/routes/user.routes');
        
        expect(mockRouter.post).toHaveBeenCalledWith('/', createUserController);
        expect(mockRouter.get).toHaveBeenCalledWith('/:email', getUserController);
    });

    it('should export the router instance', () => {
        const router = require('@/interfaces/http/express/routes/user.routes').default;
        expect(router).toBeDefined();
    });
});