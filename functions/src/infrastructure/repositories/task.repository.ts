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
        const snapshot = await this.tasksCollection.
            where('userId', '==', userId).
            where('isActive', '==', true).
            orderBy('createdAt', 'desc').get();
        console.log(`Found ${snapshot.size} tasks for user ${userId}`)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);
    }

    async update(taskId: string, task: Partial<Task>): Promise<Task> {
        const ref = this.tasksCollection.doc(taskId);
        const { title, description } = task;
        console.log('Updating task with ID repository:', taskId, 'with data:', { title, description });

        await ref.update({ title, description, updatedAt: new Date() });
        const doc = await ref.get();
        return { id: doc.id, ...doc.data() } as Task;
    }

    async delete(taskId: string): Promise<void> {
        const ref = this.tasksCollection.doc(taskId);
        console.log('Deleting task with ID:', taskId);
        await ref.update({ isActive: false, updatedAt: new Date() });
        console.log('Task deleted (soft delete) with ID:', taskId);
    }

    async complete(taskId: string): Promise<void> {
        const ref = this.tasksCollection.doc(taskId);
        console.log('Completing task with ID:', taskId);
        await ref.update({ isCompleted: true, updatedAt: new Date() });
    }
}