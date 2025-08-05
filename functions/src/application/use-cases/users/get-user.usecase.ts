import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/IUser.repository";

export class GetUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {    
            throw new Error(`User with email ${email} not found`);
        }
        return user;
    }
}