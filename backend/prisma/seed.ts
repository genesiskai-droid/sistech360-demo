// TECHNOVA 360 Backend - Seed Script (DEMO/SANDBOX)
// ============================================================
// WARNING: This seed creates 100 demo records with realistic data
// All data is fictional and for demonstration purposes only
// ============================================================

import { PrismaClient, Role, ServiceType, BookingStatus, SOSPriority, SOSStatus, WorkflowStepStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Demo password for all users
const DEMO_PASSWORD = 'demo123456';
const hashedPassword = bcrypt.hashSync(DEMO_PASSWORD, 10);

// Demo data arrays
const firstNames = [
  'Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Luisa', 'Diego', 'Carmen', 'Miguel', 'Rosa',
  'Jorge', 'Elena', 'Alejandro', 'Sofía', 'Fernando', 'Patricia', 'Ricardo', 'Verónica', 'Luis', 'Andrea',
  'Roberto', 'Gabriela', 'Eduardo', 'Fernanda', 'Sebastián', 'Daniela', 'Andrés', 'Valentina', 'Alberto', 'Camila',
  'Francisco', 'Renata', 'David', 'Ximena', 'Sergio', 'Isabella', 'Raúl', 'Mariana', 'Javier', 'Renato'
];

const lastNames = [
  'García', 'López', 'Martínez', 'Rodríguez', 'Sánchez', 'Pérez', 'González', 'Hernández', 'Ramírez', 'Torres',
  'Flores', 'Rivas', 'Mendoza', 'Ortiz', 'Cruz', 'Gómez', 'Ruiz', 'Díaz', 'Reyes', 'Morales',
  'Aguirre', 'Sosa', 'Navarro', 'Molina', 'Herrera', 'Jiménez', 'Vargas', 'Medina', 'Castro', 'Delgado',
  'Estrada', 'Santos', 'Guerrero', 'Sandoval', 'Guzmán', 'Paz', 'Valencia', 'Campos', 'Núñez', 'León'
];

const companies = [
  'TechCorp Solutions', 'Innovate Systems', 'Digital Ventures', 'Cloud Nine Tech', 'Smart Solutions Inc',
  'Future Tech Labs', 'Nexus Industries', 'Quantum Computing', 'DataDriven Co', 'AI Innovations',
  'EcoTech Solutions', 'Green Energy Corp', 'SecureNet Systems', 'CyberShield Inc', 'CloudBase Tech',
  'SmartHome Pro', 'Industrial Automation', 'Building Services Ltd', 'Facility Management Co', 'Property Services'
];

const cities = [
  'Lima', 'Santiago', 'Bogotá', 'Buenos Aires', 'Ciudad de México',
  'São Paulo', 'Caracas', 'Quito', 'La Paz', 'Montevideo',
  'Asunción', 'Panama City', 'San José', 'Santo Domingo', 'Havana'
];

const serviceTypes = ['INSTALLATION', 'REPAIR', 'MAINTENANCE', 'CONSULTATION', 'EMERGENCY'];
const specializations = ['HVAC', 'Electrical', 'Plumbing', 'Security Systems', 'Network Infrastructure', 'Fire Safety', 'Elevators'];

const issueTypes = [
  'Equipment Failure', 'Power Outage', 'Security Breach', 'System Malfunction', 'Water Leak',
  'Fire Alarm', 'Elevator Stuck', 'HVAC Failure', 'Network Down', 'Security Camera Offline'
];

const workflowSteps = [
  { name: 'Initial Assessment', description: 'Evaluate the situation and document findings', order: 1 },
  { name: 'Safety Check', description: 'Ensure all safety protocols are followed', order: 2 },
  { name: 'Diagnosis', description: 'Identify root cause of the issue', order: 3 },
  { name: 'Repair/Resolution', description: 'Perform necessary repairs or resolutions', order: 4 },
  { name: 'Testing', description: 'Test the system to ensure proper operation', order: 5 },
  { name: 'Final Inspection', description: 'Conduct final quality check', order: 6 },
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🌱 Starting seed process...');

  // Clean database first
  console.log('🗑️  Cleaning database...');
  await prisma.auditLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.workflowStep.deleteMany();
  await prisma.qualityControl.deleteMany();
  await prisma.technicalReport.deleteMany();
  await prisma.sOSRequest.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.technicianProfile.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database cleaned');

  // Create Admin User
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@technova.demo',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true,
      clientProfile: {
        create: {
          firstName: 'Admin',
          lastName: 'Technova',
          phone: '+51 999 000 001',
          company: 'TECHNOVA 360',
          city: 'Lima',
        },
      },
    },
  });

  // Create Manager User
  console.log('👤 Creating manager user...');
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@technova.demo',
      password: hashedPassword,
      role: 'MANAGER',
      emailVerified: true,
      clientProfile: {
        create: {
          firstName: 'María',
          lastName: 'González',
          phone: '+51 999 000 002',
          company: 'TECHNOVA 360',
          city: 'Lima',
        },
      },
    },
  });

  // Create 10 Technicians
  console.log('🔧 Creating technicians...');
  const technicians: any[] = [];
  for (let i = 0; i < 10; i++) {
    const tech = await prisma.user.create({
      data: {
        email: `tecnico${i + 1}@technova.demo`,
        password: hashedPassword,
        role: 'TECHNICIAN',
        emailVerified: true,
        technicianProfile: {
          create: {
            firstName: randomElement(firstNames),
            lastName: randomElement(lastNames),
            phone: `+51 999 ${randomInt(100, 999)} ${randomInt(100, 999)}`,
            employeeId: `TECH-${String(i + 1).padStart(4, '0')}`,
            specialization: randomElement(specializations),
            yearsExperience: randomInt(1, 15),
            hourlyRate: randomInt(25, 80),
            isAvailable: Math.random() > 0.2,
          },
        },
      },
    });
    technicians.push(tech);
  }

  // Create 50 Clients
  console.log('👥 Creating clients...');
  const clients: any[] = [];
  for (let i = 0; i < 50; i++) {
    const city = randomElement(cities);
    const client = await prisma.user.create({
      data: {
        email: `cliente${i + 1}@demo.com`,
        password: hashedPassword,
        role: 'CLIENT',
        emailVerified: true,
        clientProfile: {
          create: {
            firstName: randomElement(firstNames),
            lastName: randomElement(lastNames),
            phone: `+51 999 ${randomInt(100, 999)} ${randomInt(100, 999)}`,
            company: randomElement(companies),
            address: `Av. ${randomElement(['Principal', 'Libertad', 'Independencia', 'Solidaridad', 'Progreso'])} ${randomInt(100, 9999)}`,
            city,
            country: city === 'Lima' ? 'Perú' : city === 'Santiago' ? 'Chile' : city === 'Bogotá' ? 'Colombia' : 'Argentina',
            postalCode: `${randomInt(1000, 9999)}`,
            taxId: `${randomElement(['RUC', 'DNI', 'NIT', 'CUIT'])}${randomInt(10000000, 99999999)}`,
          },
        },
      },
    });
    clients.push(client);
  }

  // Create Services
  console.log('🛠️  Creating services...');
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'HVAC Installation',
        description: 'Complete HVAC system installation for commercial spaces',
        type: 'INSTALLATION',
        basePrice: 2500.00,
        durationMinutes: 480,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'HVAC Repair',
        description: 'Diagnostic and repair services for heating and cooling systems',
        type: 'REPAIR',
        basePrice: 350.00,
        durationMinutes: 120,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'HVAC Maintenance',
        description: 'Preventive maintenance for optimal HVAC performance',
        type: 'MAINTENANCE',
        basePrice: 200.00,
        durationMinutes: 90,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Electrical Installation',
        description: 'Complete electrical system installation',
        type: 'INSTALLATION',
        basePrice: 3000.00,
        durationMinutes: 480,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Electrical Repair',
        description: 'Electrical troubleshooting and repair services',
        type: 'REPAIR',
        basePrice: 250.00,
        durationMinutes: 90,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Security Systems',
        description: 'Installation and maintenance of security systems',
        type: 'INSTALLATION',
        basePrice: 2000.00,
        durationMinutes: 360,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Network Infrastructure',
        description: 'Data network setup and configuration',
        type: 'INSTALLATION',
        basePrice: 1800.00,
        durationMinutes: 360,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Technical Consultation',
        description: 'Expert consultation for facility management',
        type: 'CONSULTATION',
        basePrice: 150.00,
        durationMinutes: 60,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Emergency Response',
        description: '24/7 emergency technical support',
        type: 'EMERGENCY',
        basePrice: 500.00,
        durationMinutes: 120,
        isActive: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Plumbing Services',
        description: 'Commercial and industrial plumbing solutions',
        type: 'REPAIR',
        basePrice: 200.00,
        durationMinutes: 90,
        isActive: true,
      },
    }),
  ]);

  // Create 30 Bookings with payments and workflows
  console.log('📅 Creating bookings...');
  const bookings: any[] = [];
  for (let i = 0; i < 30; i++) {
    const client = randomElement(clients);
    const service = randomElement(services);
    const technician = randomElement(technicians);
    const status = randomElement(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const);
    const scheduledDate = randomDate(new Date('2024-01-01'), new Date('2025-12-31'));

    const booking = await prisma.booking.create({
      data: {
        clientId: client.clientProfile.id,
        serviceId: service.id,
        technicianId: technician.technicianProfile.id,
        scheduledDate,
        durationMinutes: service.durationMinutes,
        status,
        address: client.clientProfile.address,
        city: client.clientProfile.city,
        notes: `Service request #${i + 1} - ${service.name}`,
        totalAmount: service.basePrice,
        finalAmount: service.basePrice,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });
    bookings.push(booking);

    // Create workflow steps for completed bookings
    if (status === 'COMPLETED') {
      for (const step of workflowSteps) {
        await prisma.workflowStep.create({
          data: {
            bookingId: booking.id,
            serviceId: service.id,
            technicianId: technician.technicianProfile.id,
            stepOrder: step.order,
            stepName: step.name,
            stepDescription: step.description,
            status: 'COMPLETED',
            startedAt: new Date(scheduledDate.getTime() + (step.order - 1) * 3600000),
            completedAt: new Date(scheduledDate.getTime() + step.order * 3600000),
          },
        });
      }
    }
  }

  // Create 20 Payments
  console.log('💳 Creating payments...');
  const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');
  for (let i = 0; i < 20; i++) {
    const booking = completedBookings[i % completedBookings.length] || randomElement(bookings);
    const client = randomElement(clients);
    
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId: client.id,
        amount: booking.finalAmount,
        currency: 'usd',
        status: randomElement(['PAID', 'PAID', 'PAID', 'PENDING', 'FAILED'] as const),
        paymentMethod: randomElement(['credit_card', 'bank_transfer', 'cash']),
        paidAt: randomElement(['PAID'] as const) === 'PAID' ? new Date() : null,
      },
    });
  }

  // Create 15 Technical Reports
  console.log('📋 Creating technical reports...');
  for (let i = 0; i < 15; i++) {
    const booking = randomElement(completedBookings);
    const technician = randomElement(technicians);
    
    await prisma.technicalReport.create({
      data: {
        bookingId: booking.id,
        technicianId: technician.technicianProfile.id,
        reportNumber: `TR-${String(i + 1).padStart(6, '0')}`,
        findings: randomElement([
          'System operating within normal parameters after maintenance',
          'Replaced faulty component and verified system functionality',
          'Adjusted calibration settings for optimal performance',
          'Cleaned and serviced all components successfully',
          'Identified and resolved issue with main control unit',
        ]),
        workPerformed: randomElement([
          'Standard preventive maintenance procedure',
          'Complete system diagnostic and repair',
          'Component replacement and testing',
          'System optimization and calibration',
          'Emergency repair service',
        ]),
        recommendations: randomElement([
          'Schedule next maintenance in 6 months',
          'Monitor system performance closely',
          'Consider upgrade to newer model',
          'No further action required at this time',
          'Replace filters quarterly',
        ]),
        startTime: new Date(booking.scheduledDate),
        endTime: new Date(booking.scheduledDate.getTime() + 7200000),
        laborHours: randomInt(1, 8),
      },
    });
  }

  // Create 10 Quality Controls
  console.log('✅ Creating quality controls...');
  for (let i = 0; i < 10; i++) {
    const booking = randomElement(completedBookings);
    
    await prisma.qualityControl.create({
      data: {
        bookingId: booking.id,
        inspectorName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
        inspectionDate: new Date(),
        safetyCheck: Math.random() > 0.1,
        functionalityCheck: Math.random() > 0.05,
        cleanlinessCheck: Math.random() > 0.1,
        overallRating: randomInt(3, 5),
        passed: Math.random() > 0.15,
        findings: Math.random() > 0.5 ? 'All systems operating correctly' : null,
        followUpRequired: Math.random() > 0.8,
      },
    });
  }

  // Create 10 SOS Requests
  console.log('🚨 Creating SOS requests...');
  for (let i = 0; i < 10; i++) {
    const client = randomElement(clients);
    
    await prisma.sOSRequest.create({
      data: {
        sosNumber: `SOS-${String(i + 1).padStart(6, '0')}`,
        userId: client.id,
        priority: randomElement(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const),
        status: randomElement(['RECEIVED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const),
        issueType: randomElement(issueTypes),
        description: randomElement([
          'Equipment experiencing critical failure',
          'Urgent maintenance required',
          'System showing error codes',
          'Safety concern reported',
          'Immediate assistance needed',
        ]),
        location: `Floor ${randomInt(1, 20)}, ${randomElement(cities)} Office`,
        phone: client.clientProfile.phone,
        assignedTo: Math.random() > 0.3 ? randomElement(technicians).technicianProfile.firstName : null,
        resolvedAt: Math.random() > 0.5 ? new Date() : null,
      },
    });
  }

  // Create Audit Logs
  console.log('📝 Creating audit logs...');
  const actions = ['LOGIN', 'LOGOUT', 'BOOKING_CREATED', 'BOOKING_UPDATED', 'PAYMENT_PROCESSED', 'REPORT_GENERATED', 'USER_CREATED'];
  for (let i = 0; i < 20; i++) {
    const user = randomElement([adminUser, ...clients, ...technicians]);
    
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: randomElement(actions),
        entityType: randomElement(['User', 'Booking', 'Payment', 'Report']),
        entityId: randomElement(bookings)?.id,
        ipAddress: `192.168.${randomInt(1, 255)}.${randomInt(1, 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   - 1 Admin user: admin@technova.demo`);
  console.log(`   - 1 Manager user: manager@technova.demo`);
  console.log(`   - 10 Technicians`);
  console.log(`   - 50 Clients`);
  console.log(`   - 10 Services`);
  console.log(`   - 30 Bookings`);
  console.log(`   - 20 Payments`);
  console.log(`   - 15 Technical Reports`);
  console.log(`   - 10 Quality Controls`);
  console.log(`   - 10 SOS Requests`);
  console.log(`   - 20 Audit Logs`);
  console.log(`\n🔑 Demo Password: ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
