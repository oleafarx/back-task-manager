import { ITaskRepository } from "../../../domain/repositories/ITask.repository";

export class CompleteTaskUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(taskId: string): Promise<void> {
        await this.taskRepository.complete(taskId);
    }
}