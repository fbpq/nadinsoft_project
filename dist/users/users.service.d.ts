import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { Task } from '../tasks/task.entity';
export declare class UsersService {
    private repo;
    private taskRepo;
    constructor(repo: Repository<User>, taskRepo: Repository<Task>);
    create(dto: RegisterDto): Promise<User>;
    findById(id: string): Promise<User>;
    findByUsernameOrEmail(identifier: string): Promise<User>;
    verifyPassword(user: User, password: string): Promise<boolean>;
    findAll(): Promise<User[]>;
    update(id: string, attrs: Partial<User>): Promise<User>;
    remove(id: string): Promise<User>;
    assignRole(id: string, role: 'admin' | 'user'): Promise<User>;
}
