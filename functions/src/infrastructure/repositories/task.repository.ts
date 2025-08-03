import { db } from "../firebase/firestore";
import { Task } from "../../domain/entities/task.entity";
import { ITaskRepository } from "../../domain/repositories/ITask.repository";

export class TaskRepository implements ITaskRepository {
    private tasksCollection = db.collection("tasks");

    async create(task: Task): Promise<Task> {
        console.log('Creating task in repository:', task);
        const docRef = await this.tasksCollection.add({
            userId: task.userId,
            title: task.title,
            description: task.description,
            isCompleted: task.isCompleted,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            isActive: task.isActive
        });
        console.log('Task created with ID:', docRef.id);
        return { ...task, id: docRef.id } as Task;
    }

    async findAllByUserId(userId: string): Promise<Task[]> {
        const snapshot = await this.tasksCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);
    }

    async update(taskId: string, task: Partial<Task>): Promise<Task> {
        const ref = this.tasksCollection.doc(taskId);
        await ref.update({ ...task, updatedAt: new Date() });
        const doc = await ref.get();
        return { id: doc.id, ...doc.data() } as Task;
    }

    async delete(taskId: string): Promise<void> {
        await this.tasksCollection.doc(taskId).delete();
    }

    async complete(taskId: string): Promise<void> {
        const ref = this.tasksCollection.doc(taskId);
        await ref.update({ isCompleted: true, updatedAt: new Date() });
    }
}