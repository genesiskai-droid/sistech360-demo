// TECHNOVA 360 Backend - Services Service (DEMO/SANDBOX)
// ============================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(type?: string) {
    return this.prisma.service.findMany({
      where: type ? { type: type as any, isActive: true } : { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.service.findUnique({ where: { id } });
  }
}
