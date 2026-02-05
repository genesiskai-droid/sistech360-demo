// TECHNOVA 360 Backend - Main Entry Point (DEMO/SANDBOX)
// ============================================================

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:5173');

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TECHNOVA 360 API')
    .setDescription('TECHNOVA 360 Backend API - DEMO/SANDBOX Version\n\n⚠️ WARNING: This is a demo system with fictional data only.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('bookings', 'Booking management')
    .addTag('services', 'Service catalog')
    .addTag('payments', 'Payment processing')
    .addTag('workflows', 'Workflow steps')
    .addTag('reports', 'Technical reports')
    .addTag('admin', 'Admin operations')
    .addTag('sos', 'SOS emergency requests')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 TECHNOVA 360 Backend - DEMO/SANDBOX                   ║
║                                                            ║
║   API:       http://localhost:${port}/${apiPrefix}             ║
║   Swagger:   http://localhost:${port}/docs                    ║
║                                                            ║
║   ⚠️  DEMO SYSTEM - FICTIONAL DATA ONLY                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
