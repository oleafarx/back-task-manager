export interface IUser {
    readonly id?: string;
    email: string;
    createdAt: Date
}

export class User implements IUser {
    constructor(
        public email: string,
        public createdAt: Date = new Date(),
        public readonly id?: string
    ) {}
}