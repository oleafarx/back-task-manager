export interface ITask {
    readonly id?: string;
    readonly userId: string;
    title: string;
    description: string;
    isCompleted: boolean;
    readonly createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export class Task implements ITask {
    constructor(
        public readonly userId: string,
        public title: string,
        public description: string = '',
        public isCompleted: boolean = false,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
        public isActive: boolean = true,
        public readonly id?: string
    ) {}
}