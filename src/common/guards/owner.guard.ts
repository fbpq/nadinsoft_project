import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { TasksService } from '../../tasks/tasks.service';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private tasksService: TasksService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const id = req.params.id;
    if (!id) return false;
    const task = await this.tasksService.findOne(id);
    if (!task) throw new ForbiddenException('Task not found or access denied');
    if (task.owner.id !== user.userId && user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }
    return true;
  }
}
