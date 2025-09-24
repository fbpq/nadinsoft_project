import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OwnerGuard } from '../common/guards/owner.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { unlinkSync } from 'fs';
import { Task } from './task.entity';
import { UpdateTaskDto } from './dto/update-task.dto'; 

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  async create(@Body() dto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async list(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.tasksService.findAllForUser(
      req.user,
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Get single task (owner only)' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  async getOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Update task (owner only)' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  @ApiBody({ type: UpdateTaskDto }) 
  async update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Delete task (owner only)' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/attachment')
  @UseGuards(OwnerGuard)
  @ApiOperation({ summary: 'Upload attachment to task (owner only)' })
  @ApiParam({ name: 'id', description: 'Task ID', type: String })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Task attachment file',
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
        destination: process.env.UPLOAD_DIR || './uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
    }),
  )
  async upload(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    const task = await this.tasksService.findOne(id);

    if (task.attachmentPath) {
      try {
        unlinkSync(task.attachmentPath);
      } catch (e) {}
    }

    return this.tasksService.update(id, { attachmentPath: file.path } as Partial<Task>);
  }
}