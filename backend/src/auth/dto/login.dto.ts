// TECHNOVA 360 Backend - Login DTO (DEMO/SANDBOX)
// ============================================================

import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@technova.demo', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'demo123', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}
