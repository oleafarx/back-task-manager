import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/IUser.repository";

export class CreateUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(email: string): Promise<User> {
        const user = new User(email);
        return this.userRepository.create(user);
    }
}