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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
const task_entity_1 = require("../tasks/task.entity");
let UsersService = class UsersService {
    constructor(repo, taskRepo) {
        this.repo = repo;
        this.taskRepo = taskRepo;
    }
    async create(dto) {
        const exists = await this.repo.findOne({ where: [{ email: dto.email }, { username: dto.username }] });
        if (exists)
            throw new common_1.BadRequestException('Email or username already taken');
        const user = this.repo.create(Object.assign(Object.assign({}, dto), { role: 'user' }));
        return this.repo.save(user);
    }
    async findById(id) {
        const u = await this.repo.findOne({ where: { id } });
        if (!u)
            throw new common_1.NotFoundException('User not found');
        return u;
    }
    async findByUsernameOrEmail(identifier) {
        return this.repo.findOne({ where: [{ username: identifier }, { email: identifier }] });
    }
    async verifyPassword(user, password) {
        return bcrypt.compare(password, user.password);
    }
    async findAll() {
        return this.repo.find();
    }
    async update(id, attrs) {
        const user = await this.findById(id);
        Object.assign(user, attrs);
        if (attrs.password) {
            user.password = await bcrypt.hash(attrs.password, 10);
        }
        return this.repo.save(user);
    }
    async remove(id) {
        const user = await this.findById(id);
        await this.taskRepo.delete({ owner: { id } });
        return this.repo.remove(user);
    }
    async assignRole(id, role) {
        const user = await this.findById(id);
        user.role = role;
        return this.repo.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_2.InjectRepository)(task_entity_1.Task)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map