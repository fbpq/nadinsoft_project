import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class AssineNewroleDto {
  @ApiProperty()
  @IsNotEmpty()
  
  role: any;


}