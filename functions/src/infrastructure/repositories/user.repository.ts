import { db } from "../firebase/firestore";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/IUser.repository";

export class UserRepository implements IUserRepository {
    private usersCollection = db.collection("users");

    async create(user: User): Promise<User> {
        console.log('Creating user in repository:', user);
        const existingUserSnapshot = await this.usersCollection.where('email', '==', user.email).get();
        if (!existingUserSnapshot.empty) {
            throw new Error(`User with ${user.email} already exists.`);
        }
        const docRef = await this.usersCollection.add({
            email: user.email,
            createdAt: user.createdAt
        });
        console.log('User created with ID:', docRef.id);
        return { ...user, id: docRef.id } as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        const snapshot = await this.usersCollection.where('email', '==', email).get();
        console.log(`Found ${snapshot.size} users with email ${email}`);
        if (snapshot.empty) {
            console.log('User not found with email:', email);
            return null;
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as User)[0];
    }
}