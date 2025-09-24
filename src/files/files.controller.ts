import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('task/:id')
  @ApiOperation({ summary: 'Download task attachment by task id' })
  async downloadTaskAttachment(@Param('id') id: string, @Res() res: Response) {
    const task = await this.filesService.getTaskWithAttachment(id);
    if (!task || !task.attachmentPath) {
      return res.status(404).send({ message: 'File not found' });
    }

    const filePath = join(process.cwd(), task.attachmentPath);
    if (!existsSync(filePath)) {
      return res.status(404).send({ message: 'File not found' });
    }

    return res.sendFile(filePath);
  }
}
