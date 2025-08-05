import { 
    createTaskController,
    getTasksByUserController,
    updateTaskController,
    deleteTaskController,
    completeTaskController
 } from "@/interfaces/http/express/controllers/task.controller";
import { Request, Response } from "express";
import { CreateTaskUseCase } from "@/application/use-cases/tasks/create-task.usecase";
import { GetTasksByUserUseCase } from "@/application/use-cases/tasks/get-tasks-by-user.usecase";
import { UpdateTaskUseCase } from "@/application/use-cases/tasks/update-task.usecase";
import { DeleteTaskUseCase } from "@/application/use-cases/tasks/delete-task.usecase";
import { CompleteTaskUseCase } from "@/application/use-cases/tasks/complete-task.usecase";
import { Task } from "@/domain/entities/task.entity";
import { Constants, Message } from "@/utils/contants";

describe('Task Controller Tests', () => {

    const mockReq = {
        params: {
            userId: 'user123',
            taskId: 'task123'
        },
        body: {
            id: 'task123',
            userId: 'user123',
            title: 'Test Task',
            description: 'This is a test task'
        }
    } as unknown as Request;

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    } as unknown as Response;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a task successfully', async () => {
        const spy1 = jest.spyOn(CreateTaskUseCase.prototype, 'execute');
        const expectedTask = new Task('user123', 'Test Task', 'This is a test task');
        spy1.mockResolvedValue(expectedTask);

        await createTaskController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('user123', 'Test Task', 'This is a test task');
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(Message._201_CREATED(expectedTask));
    });

    it('should manage error in create task', async () => {
        const spy1 = jest.spyOn(CreateTaskUseCase.prototype, 'execute');
        spy1.mockRejectedValue(new Error('Task creation failed'));

        await createTaskController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('user123', 'Test Task', 'This is a test task');
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(Message._500_INTERNAL_SERVER_ERROR('Task creation failed'));
    });

    it('should get tasks by user successfully', async () => {
        const spy1 = jest.spyOn(GetTasksByUserUseCase.prototype, 'execute');
        const expectedTasks = [new Task('user123', 'Test Task 1'), new Task('user123', 'Test Task 2')];
        spy1.mockResolvedValue(expectedTasks);

        await getTasksByUserController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('user123');
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(Message._200_OPERATION_SUCCESSFUL(expectedTasks));
    });

    it('should validate if no users are found', async () => {
        const spy1 = jest.spyOn(GetTasksByUserUseCase.prototype, 'execute');
        const expectedTasks: any = [];
        spy1.mockResolvedValue(expectedTasks);

        await getTasksByUserController(mockReq, mockRes);

        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('user123');
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(Message._404_NOT_FOUND('No tasks found for this user'));
    });

    it('should handle the error to get tasks', async () => {
        const spy1 = jest.spyOn(GetTasksByUserUseCase.prototype, 'execute');
        spy1.mockRejectedValue(new Error('Get task failed'));

        await getTasksByUserController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('user123');
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(Message._500_INTERNAL_SERVER_ERROR('Get task failed'));
    });

    it('should update a task successfully', async () => {
        const spy1 = jest.spyOn(UpdateTaskUseCase.prototype, 'execute');
        const updatedTask = new Task('user123', 'Test Task', 'This is a test task');
        spy1.mockResolvedValue(updatedTask);

        await updateTaskController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('task123', 'Test Task', 'This is a test task');
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(Message._200_OPERATION_SUCCESSFUL(updatedTask));
    });

    it('should handle error in update task', async () => {
        const spy1 = jest.spyOn(UpdateTaskUseCase.prototype, 'execute');
        spy1.mockRejectedValue(new Error('Update task failed'));

        await updateTaskController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('task123', 'Test Task', 'This is a test task');
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(Message._500_INTERNAL_SERVER_ERROR('Update task failed'));
    });

    it('should delete a task successfully', async () => {
        const spy1 = jest.spyOn(DeleteTaskUseCase.prototype, 'execute');
        spy1.mockResolvedValue(undefined);

        await deleteTaskController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('task123');
        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith(Message._204_NO_CONTENT());
    });

    it('should handle error in delete task', async () => {
        const spy1 = jest.spyOn(DeleteTaskUseCase.prototype, 'execute');
        spy1.mockRejectedValue(new Error('Delete task failed'));

        await deleteTaskController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('task123');
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(Message._500_INTERNAL_SERVER_ERROR('Delete task failed'));
    });

    it('should complete a task successfully', async () => {
        const spy1 = jest.spyOn(CompleteTaskUseCase.prototype, 'execute');
        spy1.mockResolvedValue(undefined);

        await completeTaskController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('task123');
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(Message._200_OPERATION_SUCCESSFUL({}, Constants.TASK_COMPLETED));
    });

    it('should handle error in complete task', async () => {
        const spy1 = jest.spyOn(CompleteTaskUseCase.prototype, 'execute');
        spy1.mockRejectedValue(new Error('Complete task failed'));

        await completeTaskController(mockReq, mockRes);
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith('task123');
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(Message._500_INTERNAL_SERVER_ERROR('Complete task failed'));
    });
})