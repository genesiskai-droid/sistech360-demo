// TECHNOVA 360 Backend - Bookings Service (DEMO/SANDBOX)
// ============================================================

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, userId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: createBookingDto.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const clientProfile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!clientProfile) {
      throw new BadRequestException('Client profile not found');
    }

    const amount = service.basePrice;
    const finalAmount = amount;

    return this.prisma.booking.create({
      data: {
        clientId: clientProfile.id,
        serviceId: createBookingDto.serviceId,
        scheduledDate: new Date(createBookingDto.scheduledDate),
        durationMinutes: createBookingDto.durationMinutes || service.durationMinutes,
        address: createBookingDto.address,
        city: createBookingDto.city,
        notes: createBookingDto.notes,
        totalAmount: amount,
        finalAmount,
        status: 'PENDING',
      },
      include: {
        service: true,
        client: true,
        technician: true,
      },
    });
  }

  async findAll(filters?: { status?: string; clientId?: string; technicianId?: string }) {
    return this.prisma.booking.findMany({
      where: {
        status: filters?.status ? (filters.status as any) : undefined,
        clientId: filters?.clientId,
        technicianId: filters?.technicianId,
      },
      include: {
        service: true,
        client: {
          include: { user: true },
        },
        technician: {
          include: { user: true },
        },
        payments: true,
        workflowSteps: true,
      },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        client: {
          include: { user: true },
        },
        technician: {
          include: { user: true },
        },
        payments: true,
        workflowSteps: {
          orderBy: { stepOrder: 'asc' },
        },
        technicalReports: true,
        qualityControls: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    await this.findOne(id);

    return this.prisma.booking.update({
      where: { id },
      data: {
        scheduledDate: updateBookingDto.scheduledDate 
          ? new Date(updateBookingDto.scheduledDate) 
          : undefined,
        status: updateBookingDto.status as any,
        technicianId: updateBookingDto.technicianId,
        notes: updateBookingDto.notes,
        completedAt: updateBookingDto.status === 'COMPLETED' ? new Date() : undefined,
      },
      include: {
        service: true,
        client: { include: { user: true } },
        technician: { include: { user: true } },
      },
    });
  }

  async assignTechnician(bookingId: string, technicianId: string) {
    await this.findOne(bookingId);

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { technicianId },
      include: {
        service: true,
        client: { include: { user: true } },
        technician: { include: { user: true } },
      },
    });
  }

  async cancel(id: string) {
    return this.update(id, { status: 'CANCELLED' });
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date) {
    return this.prisma.booking.findMany({
      where: {
        scheduledDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: true,
        client: { include: { user: true } },
        technician: { include: { user: true } },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async getBookingStats() {
    const [total, pending, confirmed, inProgress, completed, cancelled] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'PENDING' } }),
      this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.booking.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.booking.count({ where: { status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { status: 'CANCELLED' } }),
    ]);

    return { total, pending, confirmed, inProgress, completed, cancelled };
  }
}
