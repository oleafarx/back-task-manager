import { Router } from 'express';
import { 
    createTaskController, 
    getTasksByUserController,
    updateTaskController,
    deleteTaskController,
    completeTaskController
} from '@/interfaces/http/express/controllers/task.controller';
import { authenticateToken } from '@/infrastructure/middleware/auth.middleware';

jest.mock('express', () => ({
    Router: jest.fn(() => ({
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    }))
}));

jest.mock('@/infrastructure/middleware/auth.middleware', () => ({
    authenticateToken: jest.fn()
}));

jest.mock('@/interfaces/http/express/controllers/task.controller', () => ({
    createTaskController: jest.fn(),
    getTasksByUserController: jest.fn(),
    updateTaskController: jest.fn(),
    deleteTaskController: jest.fn(),
    completeTaskController: jest.fn()
}));

describe('Task Routes', () => {
    let mockRouter: any;

    beforeEach(() => {
        mockRouter = {
            post: jest.fn(),
            get: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        };
        (Router as jest.Mock).mockReturnValue(mockRouter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should configure all routes correctly', () => {
        require('@/interfaces/http/express/routes/task.routes');
        
        expect(mockRouter.post).toHaveBeenCalledWith('/', authenticateToken, createTaskController);
        expect(mockRouter.get).toHaveBeenCalledWith('/:userId', authenticateToken, getTasksByUserController);
        expect(mockRouter.put).toHaveBeenCalledWith('/:taskId', authenticateToken, updateTaskController);
        expect(mockRouter.delete).toHaveBeenCalledWith('/:taskId', authenticateToken, deleteTaskController);
        expect(mockRouter.post).toHaveBeenCalledWith('/:taskId/complete', authenticateToken, completeTaskController);
    });

    it('should export the router instance', () => {
        const router = require('@/interfaces/http/express/routes/task.routes').default;
        expect(router).toBeDefined();
    });
});