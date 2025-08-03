import { Task } from "../../../domain/entities/task.entity";
import { ITaskRepository } from "../../../domain/repositories/ITask.repository";
import { log } from "firebase-functions/logger";

export class CreateTaskUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(userId: string, title: string, description: string = ''): Promise<Task> {
        const task = new Task(userId, title, description);
        log('Creating task:', task);
        return this.taskRepository.create(task);
    }
}