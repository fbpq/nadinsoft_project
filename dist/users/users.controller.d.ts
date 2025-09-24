import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare const Roles: (...roles: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    all(): Promise<import("./user.entity").User[]>;
    one(id: string): Promise<import("./user.entity").User>;
    update(id: string, dto: UpdateUserDto): Promise<import("./user.entity").User>;
    remove(id: string): Promise<import("./user.entity").User>;
    assignRole(id: string, body: {
        role: 'admin' | 'user';
    }): Promise<import("./user.entity").User>;
    uploadProfilePicture(id: string, file: Express.Multer.File): Promise<import("./user.entity").User>;
}
