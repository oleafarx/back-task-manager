import { Task } from "../../../domain/entities/task.entity";
import { ITaskRepository } from "../../../domain/repositories/ITask.repository";

export class GetTasksByUserUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(userId: string): Promise<Task[]> {
        const tasks = await this.taskRepository.findAllByUserId(userId);
        return tasks;
    }
}