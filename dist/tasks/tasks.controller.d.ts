import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    create(dto: CreateTaskDto, req: any): Promise<Task>;
    list(req: any, page?: string, limit?: string): Promise<{
        items: Task[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOne(id: string): Promise<Task>;
    update(id: string, dto: UpdateTaskDto): Promise<Task>;
    remove(id: string): Promise<Task>;
    upload(id: string, file: Express.Multer.File): Promise<Task>;
}
