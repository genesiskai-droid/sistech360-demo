// TECHNOVA 360 Backend - Workflows Service (DEMO/SANDBOX)
// ============================================================

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkflowsService {
  constructor(private prisma: PrismaService) {}

  async findByBooking(bookingId: string) {
    return this.prisma.workflowStep.findMany({
      where: { bookingId },
      include: { technician: true, service: true },
      orderBy: { stepOrder: 'asc' },
    });
  }

  async updateStatus(id: string, status: string, technicianId?: string) {
    const data: any = { status: status as any };
    if (status === 'IN_PROGRESS') data.startedAt = new Date();
    if (status === 'COMPLETED') data.completedAt = new Date();
    if (technicianId) data.technicianId = technicianId;

    return this.prisma.workflowStep.update({
      where: { id },
      data,
      include: { technician: true, service: true },
    });
  }
}
