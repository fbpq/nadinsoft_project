import { CanActivate, ExecutionContext } from '@nestjs/common';
import { TasksService } from '../../tasks/tasks.service';
export declare class OwnerGuard implements CanActivate {
    private tasksService;
    constructor(tasksService: TasksService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
