import { ITaskRepository } from "../../../domain/repositories/ITask.repository";

export class CompleteTaskUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(taskId: string): Promise<void> {
        console.log('Completing task with ID:', taskId);
        await this.taskRepository.complete(taskId);
    }
}