// TECHNOVA 360 Backend - Create User DTO (DEMO/SANDBOX)
// ============================================================

import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@technova.demo' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'demo123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '+51 999 888 777' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'MANAGER', 'TECHNICIAN', 'CLIENT'] })
  @IsOptional()
  @IsEnum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'CLIENT'])
  role?: string;

  @ApiPropertyOptional({ example: 'HVAC, Electrical' })
  @IsOptional()
  @IsString()
  specialization?: string;
}
