import { Task } from '../entities/task.entity';

export interface ITaskRepository {
    create(task: Task): Promise<Task>;
    findAllByUserId(userId: string): Promise<Task[]>;
    update(taskId: string, task: Partial<Task>): Promise<Task>;
    delete(id: string): Promise<void>;
    complete(id: string): Promise<void>;
}