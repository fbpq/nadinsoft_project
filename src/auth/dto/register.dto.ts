import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class RegisterDto {
  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'john@example.com' }) 
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' }) 
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'password123' }) 
  @IsNotEmpty()
  @MinLength(8 , { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z]).+$/, { message: 'Password must contain both uppercase and lowercase letters' })

  password: string;
}