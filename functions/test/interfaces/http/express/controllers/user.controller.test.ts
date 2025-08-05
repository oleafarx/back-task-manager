import { Request, Response } from 'express';
import { createUserController, getUserController } from '@/interfaces/http/express/controllers/user.controller';
import { CreateUserUseCase } from '@/application/use-cases/users/create-user.usecase';
import { GetUserUseCase } from '@/application/use-cases/users/get-user.usecase';
import { User } from '@/domain/entities/user.entity';
import { Message } from '@/utils/contants';
import { AuthService } from '@/infrastructure/services/auth.service';
describe('User controller tests', () => {

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;

    const mockReq = {
        params: {
            email: 'correo@gmail.com'
        },
        body: {
            email: 'correo@gmail.com'
        }
    } as unknown as Request;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a user successfully', async () => {
        const spy1 = jest.spyOn(CreateUserUseCase.prototype, 'execute');
        const expectedUser = new User('correo@gmail.com');
        spy1.mockResolvedValue(expectedUser);
        
        await createUserController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('correo@gmail.com');
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(Message._201_CREATED(expectedUser));
    });

    it('should handle error if user already exists', async () => {
        const spy1 = jest.spyOn(CreateUserUseCase.prototype, 'execute');
        spy1.mockRejectedValue(new Error('User already exists'));

        await createUserController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('correo@gmail.com');
        expect(mockRes.status).toHaveBeenCalledWith(409);
        expect(mockRes.json).toHaveBeenCalledWith(Message._409_CONFLICT('User already exists'));
    });
    
    it('should handle unexpected errors', async () => {
        const spy1 = jest.spyOn(CreateUserUseCase.prototype, 'execute');
        spy1.mockRejectedValue(new Error('Unexpected error'));
        
        await createUserController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('correo@gmail.com');
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(Message._500_INTERNAL_SERVER_ERROR('Unexpected error'));
    });
    
    it('should get a user successfully', async () => {
        const spy1 = jest.spyOn(GetUserUseCase.prototype, 'execute');
        const spy2 = jest.spyOn(AuthService.prototype, 'generateTokenPair');
        const expectedUser = new User('correo@gmail.com');
        const expectedAuth = { accessToken: 'fake accessToken', refreshToken: 'fake refreshToken' };
        spy1.mockResolvedValue(expectedUser);
        spy2.mockReturnValue(expectedAuth);
        
        const expected = {
            user: {
                email: expectedUser.email,
                id: expectedUser.id,
            },
            tokens: expectedAuth
        }
        
        await getUserController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('correo@gmail.com');
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(Message._200_OPERATION_SUCCESSFUL(expected));
    });

    it('should handle user not found error', async () => {
        const spy1 = jest.spyOn(GetUserUseCase.prototype, 'execute');
        spy1.mockRejectedValue(new Error('User not found'));

        await getUserController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('correo@gmail.com');
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(Message._404_NOT_FOUND('User not found'));
    });

    it('should handle unexpected errors when getting user', async () => {
        const spy1 = jest.spyOn(GetUserUseCase.prototype, 'execute');
        spy1.mockRejectedValue(new Error('Unexpected error'));

        await getUserController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('correo@gmail.com');
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(Message._500_INTERNAL_SERVER_ERROR('Unexpected error'));
    });
});