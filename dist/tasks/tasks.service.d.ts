import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
export declare class TasksService {
    private repo;
    private usersService;
    constructor(repo: Repository<Task>, usersService: UsersService);
    create(dto: CreateTaskDto, user: User): Promise<Task>;
    findOne(id: string): Promise<Task>;
    findAllForUser(user: User, page?: number, limit?: number): Promise<{
        items: Task[];
        total: number;
        page: number;
        limit: number;
    }>;
    update(id: string, dto: Partial<Task>): Promise<Task>;
    remove(id: string): Promise<Task>;
}
