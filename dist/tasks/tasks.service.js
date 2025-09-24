"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./task.entity");
const users_service_1 = require("../users/users.service");
let TasksService = class TasksService {
    constructor(repo, usersService) {
        this.repo = repo;
        this.usersService = usersService;
    }
    async create(dto, user) {
        const owner = await this.usersService.findById(dto.ownerId);
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        const task = this.repo.create({
            title: dto.title,
            description: dto.description,
            owner,
        });
        if (task.id) {
            delete task.id;
        }
        return this.repo.save(task);
    }
    async findOne(id) {
        const task = await this.repo.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        return task;
    }
    async findAllForUser(user, page = 1, limit = 10) {
        const [items, total] = await this.repo.findAndCount({
            where: { owner: { id: user.id } },
            relations: ['owner'],
            take: limit,
            skip: (page - 1) * limit,
            order: { createdAt: 'DESC' },
        });
        return { items, total, page, limit };
    }
    async update(id, dto) {
        const task = await this.findOne(id);
        Object.assign(task, dto);
        return this.repo.save(task);
    }
    async remove(id) {
        const task = await this.findOne(id);
        return this.repo.remove(task);
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map