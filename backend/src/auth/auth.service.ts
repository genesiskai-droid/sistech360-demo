// TECHNOVA 360 Backend - Auth Service (DEMO/SANDBOX)
// ============================================================

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || 'CLIENT',
        clientProfile: createUserDto.role === 'CLIENT' ? {
          create: {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            phone: createUserDto.phone,
          },
        } : undefined,
        technicianProfile: createUserDto.role === 'TECHNICIAN' ? {
          create: {
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            phone: createUserDto.phone,
            specialization: createUserDto.specialization,
          },
        } : undefined,
      },
      include: {
        clientProfile: true,
        technicianProfile: true,
      },
    });

    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken: token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: {
        clientProfile: true,
        technicianProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password) {
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken: token,
    };
  }

  async validateSupabaseToken(supabaseToken: string) {
    // In production, verify with Supabase
    // For demo, decode and create/find user
    try {
      const payload = this.jwtService.decode(supabaseToken);
      
      if (!payload || typeof payload === 'string') {
        throw new UnauthorizedException('Invalid token');
      }

      const { email, sub: supabaseId } = payload as { email: string; sub: string };

      let user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          clientProfile: true,
          technicianProfile: true,
        },
      });

      if (!user) {
        // Create user from Supabase data
        user = await this.prisma.user.create({
          data: {
            email,
            supabaseId,
            role: 'CLIENT',
            clientProfile: {
              create: {
                firstName: email.split('@')[0],
                lastName: 'Demo',
              },
            },
          },
          include: {
            clientProfile: true,
            technicianProfile: true,
          },
        });
      }

      const token = this.generateToken(user);

      return {
        user: this.sanitizeUser(user),
        accessToken: token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Supabase token');
    }
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: true,
        technicianProfile: true,
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
