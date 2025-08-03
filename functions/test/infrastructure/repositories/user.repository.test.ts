import { UserRepository } from '@/infrastructure/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { db } from '@/infrastructure/firebase/firestore';

jest.mock('@/infrastructure/firebase/firestore', () => ({
  db: {
    collection: jest.fn()
  }
}));

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockCollection: any;
  let mockAdd: jest.Mock;
  let mockWhere: jest.Mock;
  let mockGet: jest.Mock;

  beforeEach(() => {
    mockAdd = jest.fn();
    mockWhere = jest.fn();
    mockGet = jest.fn();

    mockCollection = {
      add: mockAdd,
      where: mockWhere
    };

    mockWhere.mockReturnValue({ get: mockGet });

    (db.collection as jest.Mock).mockReturnValue(mockCollection);

    userRepository = new UserRepository();

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user when email does not exist', async () => {
      const user = new User('test@example.com');
      const mockDocRef = { id: 'generated-id-123' };
      const emptySnapshot = { empty: true };
      
      mockGet.mockResolvedValue(emptySnapshot);
      mockAdd.mockResolvedValue(mockDocRef);

      const result = await userRepository.create(user);

      expect(mockWhere).toHaveBeenCalledWith('email', '==', user.email);
      expect(mockGet).toHaveBeenCalled();
      expect(mockAdd).toHaveBeenCalledWith({
        email: user.email,
        createdAt: user.createdAt
      });
      expect(result.id).toBe('generated-id-123');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error when user with email already exists', async () => {
      const user = new User('existing@example.com');
      const existingSnapshot = { empty: false };
      
      mockGet.mockResolvedValue(existingSnapshot);

      await expect(userRepository.create(user)).rejects.toThrow(
        'User with existing@example.com already exists.'
      );
      
      expect(mockWhere).toHaveBeenCalledWith('email', '==', user.email);
      expect(mockGet).toHaveBeenCalled();
      expect(mockAdd).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      const email = 'test@example.com';
      const mockDoc = {
        id: 'user123',
        data: () => ({ email, createdAt: new Date() })
      };
      const mockSnapshot = {
        size: 1,
        empty: false,
        docs: [mockDoc]
      };
      
      mockGet.mockResolvedValue(mockSnapshot);

      const result = await userRepository.findByEmail(email);

      expect(mockWhere).toHaveBeenCalledWith('email', '==', email);
      expect(mockGet).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result?.id).toBe('user123');
      expect(result?.email).toBe(email);
    });

    it('should return null when user not found by email', async () => {
      const email = 'notfound@example.com';
      const emptySnapshot = {
        size: 0,
        empty: true,
        docs: []
      };
      
      mockGet.mockResolvedValue(emptySnapshot);

      const result = await userRepository.findByEmail(email);

      expect(mockWhere).toHaveBeenCalledWith('email', '==', email);
      expect(mockGet).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return first user when multiple users found (edge case)', async () => {
      const email = 'test@example.com';
      const mockDoc1 = {
        id: 'user123',
        data: () => ({ email, createdAt: new Date() })
      };
      const mockDoc2 = {
        id: 'user456',
        data: () => ({ email, createdAt: new Date() })
      };
      const mockSnapshot = {
        size: 2,
        empty: false,
        docs: [mockDoc1, mockDoc2]
      };
      
      mockGet.mockResolvedValue(mockSnapshot);

      const result = await userRepository.findByEmail(email);

      expect(mockWhere).toHaveBeenCalledWith('email', '==', email);
      expect(mockGet).toHaveBeenCalled();
      expect(result).not.toBeNull();
      expect(result?.id).toBe('user123');
      expect(result?.email).toBe(email);
    });
  });
});