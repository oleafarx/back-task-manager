import { db } from "../firebase/firestore";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/IUser.repository";
import { log } from "firebase-functions/logger";

export class UserRepository implements IUserRepository {
    private usersCollection = db.collection("users");

    async create(user: User): Promise<User> {
        const existingUserSnapshot = await this.usersCollection.where('email', '==', user.email).get();
        if (!existingUserSnapshot.empty) {
            throw new Error(`User with ${user.email} already exists.`);
        }
        const docRef = await this.usersCollection.add({
            email: user.email,
            createdAt: user.createdAt
        });
        log('User created with ID:', docRef.id);
        return { ...user, id: docRef.id } as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        const snapshot = await this.usersCollection.where('email', '==', email).get();
        if (snapshot.empty) {
            return null;
        }
        log(`User found with email ${email}:`);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as User)[0];
    }
}