// TECHNOVA 360 Backend - Register DTO (DEMO/SANDBOX)
// ============================================================

import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@company.demo', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'demo123', description: 'User password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: '+51 999 888 777', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: ['ADMIN', 'MANAGER', 'TECHNICIAN', 'CLIENT'], default: 'CLIENT' })
  @IsOptional()
  @IsEnum(['ADMIN', 'MANAGER', 'TECHNICIAN', 'CLIENT'])
  role?: string;

  @ApiPropertyOptional({ example: 'HVAC', description: 'Specialization (for technicians)' })
  @IsOptional()
  @IsString()
  specialization?: string;
}
