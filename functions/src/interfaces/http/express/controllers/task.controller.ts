import { Request, Response } from 'express';
import { TaskRepository } from '../../../../infrastructure/repositories/task.repository';
import { CreateTaskUseCase } from '../../../../application/use-cases/tasks/create-task.usecase';
import { GetTasksByUserUseCase } from '../../../../application/use-cases/tasks/get-tasks-by-user.usecase';
import { UpdateTaskUseCase } from '../../../../application/use-cases/tasks/update-task.usecase';
import { DeleteTaskUseCase } from '../../../../application/use-cases/tasks/delete-task.usecase';
import { CompleteTaskUseCase } from '../../../../application/use-cases/tasks/complete-task.usecase';
import { Message, Constants } from '../../../../utils/contants';
import { getErrorMessage } from '../../../../utils/getErrorMessage';

const repository = new TaskRepository();
const createTaskUseCase = new CreateTaskUseCase(repository);
const getTasksByUserUseCase = new GetTasksByUserUseCase(repository);
const updateTaskUseCase = new UpdateTaskUseCase(repository);
const deleteTaskUseCase = new DeleteTaskUseCase(repository);
const completeTaskUseCase = new CompleteTaskUseCase(repository);

export const createTaskController = async (req: Request, res: Response) => {
    try {
        console.log('Received request to create task:', req.body);
        const { userId, title, description = '' } = req.body;
        const task = await createTaskUseCase.execute(userId, title, description);
        console.log('Task created successfully:', task);
        res.status(201).json(Message._201_CREATED(task));
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error('Error creating task:', errorMessage);
        res.status(500).json(Message._500_INTERNAL_SERVER_ERROR(errorMessage));
    }
}

export const getTasksByUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        console.log('Received request to get tasks for user:', userId);
        const tasks = await getTasksByUserUseCase.execute(userId);
        if (tasks.length === 0) {
            return res.status(404).json(Message._404_NOT_FOUND(Constants.TASK_NOT_FOUND));
        }
        return res.status(200).json(Message._200_OPERATION_SUCCESSFUL(tasks));
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        return res.status(500).json(Message._500_INTERNAL_SERVER_ERROR(errorMessage));

    }
}

export const updateTaskController = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;
        const { title, description } = req.body;
        console.log('Received request to update task:', { taskId, title, description });
        const updatedTask = await updateTaskUseCase.execute(taskId, title, description);
        res.status(200).json(Message._200_OPERATION_SUCCESSFUL(updatedTask));
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(500).json(Message._500_INTERNAL_SERVER_ERROR(errorMessage));
    }
}

export const deleteTaskController = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;
        console.log('Received request to delete task with ID:', taskId);
        await deleteTaskUseCase.execute(taskId);
        res.status(204).json(Message._204_NO_CONTENT());
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(500).json(Message._500_INTERNAL_SERVER_ERROR(errorMessage));
    }
}   

export const completeTaskController = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;
        console.log('Received request to complete task with ID:', taskId);
        await completeTaskUseCase.execute(taskId);
        res.status(200).json(Message._200_OPERATION_SUCCESSFUL({}, Constants.TASK_COMPLETED));
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(500).json(Message._500_INTERNAL_SERVER_ERROR(errorMessage));
    }
}   