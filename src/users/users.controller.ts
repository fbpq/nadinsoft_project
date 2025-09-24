import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  UseGuards,
  SetMetadata,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { unlinkSync } from 'fs';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async all() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  async one(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Update user by id (Admin or self)' })
  @ApiBody({ type: UpdateUserDto }) // اطمینان از نمایش بدنه در Swagger
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user by id (Admin only)' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/role')
  @Roles('user')
  @ApiOperation({ summary: 'Assign role to user (Admin only)' })
  async assignRole(@Param('id') id: string, @Body() body: { role: 'admin' | 'user' }) {
    return this.usersService.assignRole(id, body.role);
  }

  @Post(':id/profile-picture')
  @Roles('user')
  @ApiOperation({ summary: 'Upload profile picture (self only)' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile picture file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR || './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
    }),
  )
  async uploadProfilePicture(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const user = await this.usersService.findById(id);

    if (user.profilePicturePath) {
      try {
        unlinkSync(user.profilePicturePath);
      } catch (e) {}
    }

    return this.usersService.update(id, { profilePicturePath: file.path });
  }
}