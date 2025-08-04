import { Request, Response } from 'express';
import { UserRepository } from '../../../../infrastructure/repositories/user.repository';
import { CreateUserUseCase } from '../../../../application/use-cases/users/create-user.usecase';
import { GetUserUseCase } from '../../../../application/use-cases/users/get-user.usecase';
import { Message } from '../../../../utils/contants';
import { getErrorMessage } from '../../../../utils/helpers';
import { log } from 'firebase-functions/logger';

const repository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(repository);
const getUserUseCase = new GetUserUseCase(repository);

export const createUserController = async (req: Request, res: Response) => {
    try {
        log('Received request to create user:', req.body);
        const { email } = req.body;
        const user = await createUserUseCase.execute(email);
        return res.status(201).json(Message._201_CREATED(user));
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        if (errorMessage.includes('already exists')) {
            return res.status(409).json(Message._409_CONFLICT(errorMessage));
        }
        return res.status(500).json(Message._500_INTERNAL_SERVER_ERROR(errorMessage));
    }
};

export const getUserController = async (req: Request, res: Response) => {
    try {
        const email = req.params.email;
        log('Received request to get user with email:', email);
        const user = await getUserUseCase.execute(email);
        return res.status(200).json(Message._200_OPERATION_SUCCESSFUL(user));
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        if (errorMessage.includes('not found')) {
            return res.status(404).json(Message._404_NOT_FOUND(errorMessage));
        }
        return res.status(500).json(Message._500_INTERNAL_SERVER_ERROR(errorMessage));
    }
}