import { Request, Response } from 'express';
import { TaskRepository } from '../../../../infrastructure/repositories/task.repository';
import { CreateTaskUseCase } from '../../../../application/use-cases/create-task.usecase';

const repository = new TaskRepository();
const createTaskUseCase = new CreateTaskUseCase(repository);

export const createTaskController = async (req: Request, res: Response) => {
    try {
        console.log('Received request to create task:', req.body);
        const { userId, title, description = '' } = req.body;
        const task = await createTaskUseCase.execute(userId, title, description);
        res.status(201).json(task);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ message: 'Error creating task', error: errorMessage });
    }
}