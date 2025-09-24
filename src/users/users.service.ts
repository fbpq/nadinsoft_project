import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/task.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  async create(dto: RegisterDto) {
    const exists = await this.repo.findOne({ where: [{ email: dto.email }, { username: dto.username }] });
    if (exists) throw new BadRequestException('Email or username already taken');
    const user = this.repo.create({ ...dto, role: 'user' });
    return this.repo.save(user);
  }

  async findById(id: string) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async findByUsernameOrEmail(identifier: string) {
    return this.repo.findOne({ where: [{ username: identifier }, { email: identifier }] });
  }

  async verifyPassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }

  async findAll() {
    return this.repo.find();
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findById(id);
    Object.assign(user, attrs);
    if (attrs.password) {
      user.password = await bcrypt.hash(attrs.password, 10);
    }
    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    await this.taskRepo.delete({ owner: { id } });
    return this.repo.remove(user);
  }

  async assignRole(id: string, role: 'admin' | 'user') {
    const user = await this.findById(id);
    user.role = role;
    return this.repo.save(user);
  }
}