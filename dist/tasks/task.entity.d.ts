import { User } from '../users/user.entity';
export declare class Task {
    id: string;
    title: string;
    description: string;
    owner: User;
    attachmentPath: string;
    createdAt: Date;
    updatedAt: Date;
}
