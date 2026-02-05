// TECHNOVA 360 Backend - SOS Service (DEMO/SANDBOX)
// ============================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SosService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, userId: string) {
    return this.prisma.sOSRequest.create({
      data: {
        ...data,
        userId,
        status: 'RECEIVED',
      },
      include: { user: true },
    });
  }

  async findAll(filters?: { status?: string; priority?: string }) {
    return this.prisma.sOSRequest.findMany({
      where: {
        status: filters?.status ? (filters.status as any) : undefined,
        priority: filters?.priority ? (filters.priority as any) : undefined,
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string, assignedTo?: string) {
    const data: any = { status: status as any };
    if (status === 'RESOLVED') data.resolvedAt = new Date();
    if (assignedTo) data.assignedTo = assignedTo;

    return this.prisma.sOSRequest.update({
      where: { id },
      data,
      include: { user: true },
    });
  }

  async getStats() {
    const [total, critical, high, medium, low, resolved] = await Promise.all([
      this.prisma.sOSRequest.count(),
      this.prisma.sOSRequest.count({ where: { priority: 'CRITICAL' } }),
      this.prisma.sOSRequest.count({ where: { priority: 'HIGH' } }),
      this.prisma.sOSRequest.count({ where: { priority: 'MEDIUM' } }),
      this.prisma.sOSRequest.count({ where: { priority: 'LOW' } }),
      this.prisma.sOSRequest.count({ where: { status: 'RESOLVED' } }),
    ]);

    return { total, critical, high, medium, low, resolved };
  }
}
