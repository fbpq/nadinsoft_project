import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateTaskDto, user: User) {
    const owner = await this.usersService.findById(dto.ownerId);
    if (!owner) throw new NotFoundException('Owner not found');

    const task = this.repo.create({
      title: dto.title,
      description: dto.description,
      owner,
    });

    if ((task as any).id) {
      delete (task as any).id;
    }

    return this.repo.save(task);
  }

  async findOne(id: string) {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async findAllForUser(user: User, page = 1, limit = 10) {
    const [items, total] = await this.repo.findAndCount({
      where: { owner: { id: user.id } },
      relations: ['owner'],
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, limit };
  }

  async update(id: string, dto: Partial<Task>) {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    return this.repo.remove(task);
  }
}