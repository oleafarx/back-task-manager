import { CreateUserUseCase } from "@/application/use-cases/users/create-user.usecase";
import { GetUserUseCase } from "@/application/use-cases/users/get-user.usecase";
import { User } from "@/domain/entities/user.entity";
import { IUserRepository } from "@/domain/repositories/IUser.repository";

const mockUserRepository: jest.Mocked<IUserRepository> = {
    create: jest.fn(),
    findByEmail: jest.fn()
}

describe('User Use Cases', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    describe('CreateUserUseCase', () => {
        let createUserUseCase: CreateUserUseCase;

        beforeEach(() => {
          createUserUseCase = new CreateUserUseCase(mockUserRepository);
        });

        it('should create a user with the provided email', async () => {
            const email = 'correo@gmail.com';
            const expectedUser = new User(email);

            mockUserRepository.create.mockResolvedValue(expectedUser);
            const result = await createUserUseCase.execute(email);
            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                email,
                createdAt: expect.any(Date)
            }));
        });
    });

    describe('GetUserUseCase', () => {
        let getUserUseCase: GetUserUseCase;

        beforeEach(() => {
            getUserUseCase = new GetUserUseCase(mockUserRepository);
        });

        it('should fetch a user by email', async () => {
            const email = 'correo@gmail.com';
            const expectedUser = new User(email);
            mockUserRepository.findByEmail.mockResolvedValue(expectedUser);
            
            const result = await getUserUseCase.execute(email);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(expectedUser);
        });

        it('should throw an error if user is not found', async () => {
            const email = 'correo@gmail.com';
            mockUserRepository.findByEmail.mockResolvedValue(null);
            await expect(getUserUseCase.execute(email)).rejects.toThrow(`User with email ${email} not found`);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
        });
    });
});
