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
    ) {
        console.log('Me ejecute una vez');
    }

    complete(): void {
        this.isCompleted = true;
        this.updatedAt = new Date();
    }

    update(title: string, description: string): void {
        this.title = title;
        this.description = description;
        this.updatedAt = new Date();
    }

    delete(): void {
        this.isActive = false;
        this.updatedAt = new Date();
    }
}