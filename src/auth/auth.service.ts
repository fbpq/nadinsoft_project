import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    return this.usersService.create(dto);
  }

  async validateUser(usernameOrEmail: string, pass: string) {
    const user = await this.usersService.findByUsernameOrEmail(usernameOrEmail);
    if (!user) return null;
    const valid = await this.usersService.verifyPassword(user, pass);
    if (!valid) return null;
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.usernameOrEmail, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user.toJSON()
    };
  }
}
