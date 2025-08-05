import { Task } from "../../../domain/entities/task.entity";
import { ITaskRepository } from "../../../domain/repositories/ITask.repository";

export class UpdateTaskUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(taskId: string, title: string, description: string): Promise<Task> {
        const task = new Task('', title, description);
        return this.taskRepository.update(taskId, task);
    }
}