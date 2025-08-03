import { ITaskRepository } from "../../../domain/repositories/ITask.repository";

export class DeleteTaskUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(taskId: string): Promise<void> {
        console.log('Deleting task with ID:', taskId);
        await this.taskRepository.delete(taskId);
    }
}