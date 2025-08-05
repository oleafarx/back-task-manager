import { CompleteTaskUseCase } from '@/application/use-cases/tasks/complete-task.usecase';
import { CreateTaskUseCase } from '@/application/use-cases/tasks/create-task.usecase';
import { DeleteTaskUseCase } from '@/application/use-cases/tasks/delete-task.usecase';
import { GetTasksByUserUseCase } from '@/application/use-cases/tasks/get-tasks-by-user.usecase';
import { UpdateTaskUseCase } from '@/application/use-cases/tasks/update-task.usecase';
import { Task } from '@/domain/entities/task.entity';
import { ITaskRepository } from '@/domain/repositories/ITask.repository';

const mockTaskRepository: jest.Mocked<ITaskRepository> = {
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  complete: jest.fn()
};

describe('Task Use Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CompleteTaskUseCase', () => {
    let completeTaskUseCase: CompleteTaskUseCase;

    beforeEach(() => {
      completeTaskUseCase = new CompleteTaskUseCase(mockTaskRepository);
    });

    it('should complete a task by calling repository complete method', async () => {
      const taskId = 'task123';
      mockTaskRepository.complete.mockResolvedValue(undefined);

      await completeTaskUseCase.execute(taskId);

      expect(mockTaskRepository.complete).toHaveBeenCalledWith(taskId);
    });
  });

  describe('CreateTaskUseCase', () => {
    let createTaskUseCase: CreateTaskUseCase;

    beforeEach(() => {
      createTaskUseCase = new CreateTaskUseCase(mockTaskRepository);
    });

    it('should create a task with userId, title and description', async () => {
      const userId = 'user123';
      const title = 'Test Task';
      const description = 'Test Description';
      const expectedTask = new Task(userId, title, description);
      
      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const result = await createTaskUseCase.execute(userId, title, description);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        userId,
        title,
        description
      }));
      expect(result).toEqual(expectedTask);
    });

    it('should create a task with default empty description when not provided', async () => {
      const userId = 'user123';
      const title = 'Test Task';
      const expectedTask = new Task(userId, title, '');
      
      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const result = await createTaskUseCase.execute(userId, title);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        userId,
        title,
        description: ''
      }));
      expect(result).toEqual(expectedTask);
    });
  });

  describe('DeleteTaskUseCase', () => {
    let deleteTaskUseCase: DeleteTaskUseCase;

    beforeEach(() => {
      deleteTaskUseCase = new DeleteTaskUseCase(mockTaskRepository);
    });

    it('should delete a task by calling repository delete method', async () => {
      const taskId = 'task123';
      mockTaskRepository.delete.mockResolvedValue(undefined);

      await deleteTaskUseCase.execute(taskId);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
    });
  });

  describe('GetTasksByUserUseCase', () => {
    let getTasksByUserUseCase: GetTasksByUserUseCase;

    beforeEach(() => {
      getTasksByUserUseCase = new GetTasksByUserUseCase(mockTaskRepository);
    });

    it('should get all tasks for a user', async () => {
      const userId = 'user123';
      const expectedTasks = [
        new Task(userId, 'Task 1', 'Description 1'),
        new Task(userId, 'Task 2', 'Description 2')
      ];
      
      mockTaskRepository.findAllByUserId.mockResolvedValue(expectedTasks);

      const result = await getTasksByUserUseCase.execute(userId);

      expect(mockTaskRepository.findAllByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedTasks);
    });
  });

  describe('UpdateTaskUseCase', () => {
    let updateTaskUseCase: UpdateTaskUseCase;

    beforeEach(() => {
      updateTaskUseCase = new UpdateTaskUseCase(mockTaskRepository);
    });

    it('should update a task with new title and description', async () => {
      const taskId = 'task123';
      const title = 'Updated Title';
      const description = 'Updated Description';
      const updatedTask = new Task('user123', title, description);
      
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await updateTaskUseCase.execute(taskId, title, description);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, expect.objectContaining({
        userId: '',
        title,
        description
      }));
      expect(result).toEqual(updatedTask);
    });
  });
});