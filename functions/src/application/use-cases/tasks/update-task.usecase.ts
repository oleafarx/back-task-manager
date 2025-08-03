import { Task } from "../../../domain/entities/task.entity";
import { ITaskRepository } from "../../../domain/repositories/ITask.repository";

export class UpdateTaskUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(taskId: string, title: string, description: string): Promise<Task> {
        console.log('Updating task with ID UC:', taskId);
        const task = new Task('', title, description); // userId is not needed for update
        return this.taskRepository.update(taskId, task);
    }
}