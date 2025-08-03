import { db } from "../firebase/firestore";
import { Task } from "../../domain/entities/task.entity";
import { ITaskRepository } from "../../domain/repositories/ITask.repository";
import { log } from "firebase-functions/logger";

export class TaskRepository implements ITaskRepository {
    private tasksCollection = db.collection("tasks");

    async create(task: Task): Promise<Task> {
        const docRef = await this.tasksCollection.add({
            userId: task.userId,
            title: task.title,
            description: task.description,
            isCompleted: task.isCompleted,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
            isActive: task.isActive
        });
        log('Task created with ID:', docRef.id);
        return { ...task, id: docRef.id } as Task;
    }

    async findAllByUserId(userId: string): Promise<Task[]> {
        const snapshot = await this.tasksCollection.
            where('userId', '==', userId).
            where('isActive', '==', true).
            orderBy('createdAt', 'desc').get();
        log(`Found ${snapshot.size} tasks for user ${userId}`)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);
    }

    async update(taskId: string, task: Partial<Task>): Promise<Task> {
        const ref = this.tasksCollection.doc(taskId);
        const { title, description } = task;

        await ref.update({ title, description, updatedAt: new Date() });
        const doc = await ref.get();
        log('Task updated', doc);
        return { id: doc.id, ...doc.data() } as Task;
    }

    async delete(taskId: string): Promise<void> {
        const ref = this.tasksCollection.doc(taskId);
        await ref.update({ isActive: false, updatedAt: new Date() });
        log('Task deleted (soft delete) with ID:', taskId);
    }

    async complete(taskId: string): Promise<void> {
        const ref = this.tasksCollection.doc(taskId);
        await ref.update({ isCompleted: true, updatedAt: new Date() });
        log('Task completed with ID:', taskId);
    }
}