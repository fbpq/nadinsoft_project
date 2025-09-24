import { Repository } from 'typeorm';
import { Task } from '../tasks/task.entity';
export declare class FilesService {
    private readonly tasksRepo;
    constructor(tasksRepo: Repository<Task>);
    getTaskWithAttachment(id: string): Promise<Task>;
}
