// TECHNOVA 360 Backend - Admin Service (DEMO/SANDBOX)
// ============================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [users, bookings, payments, services, sosRequests] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.booking.count(),
      this.prisma.payment.count(),
      this.prisma.service.count(),
      this.prisma.sOSRequest.count(),
    ]);

    const revenue = await this.prisma.payment.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    });

    const completedBookings = await this.prisma.booking.count({
      where: { status: 'COMPLETED' },
    });

    const pendingBookings = await this.prisma.booking.count({
      where: { status: 'PENDING' },
    });

    const activeTechnicians = await this.prisma.technicianProfile.count({
      where: { isAvailable: true },
    });

    return {
      users,
      bookings,
      payments,
      services,
      sosRequests,
      totalRevenue: revenue._sum.amount || 0,
      completedBookings,
      pendingBookings,
      activeTechnicians,
    };
  }

  async getAuditLogs(limit = 100) {
    return this.prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async createAuditLog(data: any) {
    return this.prisma.auditLog.create({ data });
  }
}
