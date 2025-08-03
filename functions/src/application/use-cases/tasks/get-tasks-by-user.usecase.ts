import { Task } from "../../../domain/entities/task.entity";
import { ITaskRepository } from "../../../domain/repositories/ITask.repository";

export class GetTasksByUserUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(userId: string): Promise<Task[]> {
        console.log('Fetching tasks for user:', userId);
        const tasks = await this.taskRepository.findAllByUserId(userId);
        console.log('Tasks fetched:', tasks);
        return tasks;
    }
}