import { Task } from "../../../domain/entities/task.entity";
import { ITaskRepository } from "../../../domain/repositories/ITask.repository";

export class CreateTaskUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(userId: string, title: string, description: string = ''): Promise<Task> {
        const task = new Task(userId, title, description);
        console.log('Creating task with details:', {
            userId,
            title,
            description
        });
        return this.taskRepository.create(task);
    }
}