import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete project' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'user-uuid-here' })
  @IsString()
  @IsNotEmpty()
  ownerId: string;
}