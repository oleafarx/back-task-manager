import { TaskRepository } from '@/infrastructure/repositories/task.repository';
import { Task } from '@/domain/entities/task.entity';
import { db } from '@/infrastructure/firebase/firestore';

// Mock de Firestore
jest.mock('@/infrastructure/firebase/firestore', () => ({
  db: {
    collection: jest.fn()
  }
}));

describe('TaskRepository', () => {
  let taskRepository: TaskRepository;
  let mockCollection: any;
  let mockDoc: any;
  let mockAdd: jest.Mock<any>;
  let mockWhere: jest.Mock;
  let mockOrderBy: jest.Mock;
  let mockGet: jest.Mock<any>;
  let mockUpdate: jest.Mock<any>;

  beforeEach(() => {
    // Setup mocks
    mockAdd = jest.fn();
    mockWhere = jest.fn();
    mockOrderBy = jest.fn();
    mockGet = jest.fn();
    mockUpdate = jest.fn();

    mockDoc = {
      update: mockUpdate,
      get: mockGet
    };

    mockCollection = {
      add: mockAdd,
      where: mockWhere,
      doc: jest.fn().mockReturnValue(mockDoc)
    };

    const mockQuery = {
      where: mockWhere,
      orderBy: mockOrderBy,
      get: mockGet
    };

    // Chain methods for query
    mockWhere.mockReturnValue(mockQuery);
    mockOrderBy.mockReturnValue({ get: mockGet });

    (db.collection as jest.Mock).mockReturnValue(mockCollection);

    taskRepository = new TaskRepository();

    // Mock console.log to avoid test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task and return it with generated ID', async () => {
      // Arrange
      const task = new Task('user123', 'Test Task', 'Test Description');
      const mockDocRef = { id: 'generated-id-123' };
      mockAdd.mockResolvedValue(mockDocRef);

      // Act
      const result = await taskRepository.create(task);

      // Assert
      expect(mockAdd).toHaveBeenCalledWith({
        userId: task.userId,
        title: task.title,
        description: task.description,
        isCompleted: task.isCompleted,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        isActive: task.isActive
      });
      expect(result.id).toBe('generated-id-123');
      expect(result.title).toBe('Test Task');
    });
  });

  describe('findAllByUserId', () => {
    it('should return all tasks for a user ordered by createdAt desc', async () => {
      const userId = 'user123';
      const mockDocs = [
        { id: 'task1', data: () => ({ title: 'Task 1', userId }) },
        { id: 'task2', data: () => ({ title: 'Task 2', userId }) }
      ];
      const mockSnapshot = { 
        size: 2, 
        docs: mockDocs 
      };
      mockGet.mockResolvedValue(mockSnapshot);

      const result = await taskRepository.findAllByUserId(userId);

      expect(mockWhere).toHaveBeenNthCalledWith(1, 'userId', '==', userId);
      expect(mockWhere).toHaveBeenNthCalledWith(2, 'isActive', '==', true);
      expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('task1');
      expect(result[1].id).toBe('task2');
    });
  });

  describe('update', () => {
    it('should update task title and description', async () => {
      // Arrange
      const taskId = 'task123';
      const updateData = { title: 'Updated Title', description: 'Updated Description' };
      const mockDocData = { title: 'Updated Title', description: 'Updated Description' };
      const mockDocSnapshot = { 
        id: taskId, 
        data: () => mockDocData 
      };
      
      mockUpdate.mockResolvedValue(null);
      mockGet.mockResolvedValue(mockDocSnapshot);

      // Act
      const result = await taskRepository.update(taskId, updateData);

      // Assert
      expect(mockCollection.doc).toHaveBeenCalledWith(taskId);
      expect(mockUpdate).toHaveBeenCalledWith({
        title: updateData.title,
        description: updateData.description,
        updatedAt: expect.any(Date)
      });
      expect(mockGet).toHaveBeenCalled();
      expect(result.id).toBe(taskId);
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('delete', () => {
    it('should perform soft delete by setting isActive to false', async () => {
      // Arrange
      const taskId = 'task123';
      mockUpdate.mockResolvedValue(undefined);

      // Act
      await taskRepository.delete(taskId);

      // Assert
      expect(mockCollection.doc).toHaveBeenCalledWith(taskId);
      expect(mockUpdate).toHaveBeenCalledWith({
        isActive: false,
        updatedAt: expect.any(Date)
      });
    });
  });

  describe('complete', () => {
    it('should mark task as completed', async () => {
      // Arrange
      const taskId = 'task123';
      mockUpdate.mockResolvedValue(undefined);

      // Act
      await taskRepository.complete(taskId);

      // Assert
      expect(mockCollection.doc).toHaveBeenCalledWith(taskId);
      expect(mockUpdate).toHaveBeenCalledWith({
        isCompleted: true,
        updatedAt: expect.any(Date)
      });
    });
  });
});