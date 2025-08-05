import { ITaskRepository } from "../../../domain/repositories/ITask.repository";

export class DeleteTaskUseCase {
    constructor(private taskRepository: ITaskRepository) {}

    async execute(taskId: string): Promise<void> {
        await this.taskRepository.delete(taskId);
    }
}