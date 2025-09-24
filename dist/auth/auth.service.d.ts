import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<import("../users/user.entity").User>;
    validateUser(usernameOrEmail: string, pass: string): Promise<import("../users/user.entity").User>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
}
