// TECHNOVA 360 Backend - Reports Service (DEMO/SANDBOX)
// ============================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, technicianId: string) {
    return this.prisma.technicalReport.create({
      data: {
        ...data,
        technicianId,
      },
      include: { technician: true, booking: { include: { service: true, client: true } } },
    });
  }

  async findByBooking(bookingId: string) {
    return this.prisma.technicalReport.findMany({
      where: { bookingId },
      include: { technician: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.technicalReport.findMany({
      include: { technician: true, booking: { include: { service: true, client: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
