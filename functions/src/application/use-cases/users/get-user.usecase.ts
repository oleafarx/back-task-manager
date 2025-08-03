import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/IUser.repository";

export class GetUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(email: string): Promise<User> {
        console.log('Fetching user with ID:', email);
        const user = await this.userRepository.findByEmail(email);
        if (!user) {    
            console.log('User not found for email:', email);
            throw new Error(`User with email ${email} not found`);
        }
        console.log('User fetched:', user);
        return user;
    }
}