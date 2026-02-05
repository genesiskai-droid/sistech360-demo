// TECHNOVA 360 Backend - App Module (DEMO/SANDBOX)
// ============================================================

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

// Database
import { PrismaModule } from './prisma/prisma.module';

// Auth
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

// Users
import { UsersModule } from './users/users.module';

// Bookings
import { BookingsModule } from './bookings/bookings.module';

// Services
import { ServicesModule } from './services/services.module';

// Payments
import { PaymentsModule } from './payments/payments.module';

// Workflows
import { WorkflowsModule } from './workflows/workflows.module';

// Reports
import { ReportsModule } from './reports/reports.module';

// Admin
import { AdminModule } from './admin/admin.module';

// SOS
import { SosModule } from './sos/sos.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    PrismaModule,

    // Auth
    AuthModule,

    // Users
    UsersModule,

    // Bookings
    BookingsModule,

    // Services
    ServicesModule,

    // Payments
    PaymentsModule,

    // Workflows
    WorkflowsModule,

    // Reports
    ReportsModule,

    // Admin
    AdminModule,

    // SOS
    SosModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
