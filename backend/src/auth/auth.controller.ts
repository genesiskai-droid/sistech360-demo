// TECHNOVA 360 Backend - Auth Controller (DEMO/SANDBOX)
// ============================================================

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SupabaseLoginDto } from './dto/supabase-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('supabase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Supabase Auth token' })
  @ApiResponse({ status: 200, description: 'Supabase login successful' })
  async supabaseLogin(@Body() supabaseLoginDto: SupabaseLoginDto) {
    return this.authService.validateSupabaseToken(supabaseLoginDto.token);
  }
}
