import { Task } from '../tasks/task.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
    role: 'admin' | 'user';
    profilePicturePath: string;
    tasks: Task[];
    createdAt: Date;
    updatedAt: Date;
    hashPassword(): Promise<void>;
    validatePassword(password: string): Promise<boolean>;
    toJSON(): any;
}
