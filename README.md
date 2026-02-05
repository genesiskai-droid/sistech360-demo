# TECHNOVA 360 - Sistema Demo/Sandbox

⚠️ **ADVERTENCIA**: Este es un sistema DEMO/SANDBOX con datos ficticios únicamente. NO usar en producción.

## Resumen

TECHNOVA 360 es un sistema de gestión de servicios técnicos para facility management, construido como DEMO para demostrar arquitectura de software moderna.

## Estructura del Proyecto

```
g:/SISTECH360/
├── frontend/              # React + Vite (EXISTENTE - NO MODIFICAR)
│   ├── components/         # Componentes de UI
│   ├── services/           # Servicios
│   ├── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/                # NestJS + PostgreSQL (NUEVO)
│   ├── prisma/
│   │   ├── schema.prisma   # Schema de DB
│   │   └── seed.ts         # Seed con 100 registros
│   ├── src/
│   │   ├── auth/           # Autenticación
│   │   ├── users/          # Usuarios
│   │   ├── bookings/       # Reservas
│   │   ├── services/       # Servicios
│   │   ├── payments/       # Pagos (Stripe)
│   │   ├── workflows/      # Flujos de trabajo
│   │   ├── reports/        # Reportes técnicos
│   │   ├── admin/          # Administración
│   │   └── sos/            # SOS/Emergencias
│   ├── package.json
│   └── README.md
└── README.md               # Este archivo
```

## Stack Tecnológico

### Frontend (Existente)
- React + TypeScript
- Vite
- Componentes personalizados

### Backend (Nuevo)
- Node.js + TypeScript
- NestJS
- PostgreSQL (Supabase)
- Prisma ORM
- Supabase Auth + JWT
- Stripe (TEST MODE)

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| ADMIN | Acceso total al sistema |
| MANAGER | Gestión de reservas y técnicos |
| TECHNICIAN | Reportes y workflows |
| CLIENT | Crear y gestionar reservas |

## Base de Datos PostgreSQL

### Crear Base de Datos

La base de datos debe crearse manualmente en Supabase:

```sql
-- Conectarse a PostgreSQL de Supabase
-- Crear nueva base de datos para demo
CREATE DATABASE technova360_demo;
```

### Connection String

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/technova360_demo"
```

## Configuración del Backend

```bash
cd backend

# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Ejecutar seed (100 registros demo)
npm run prisma:seed

# Iniciar servidor
npm run start:dev
```

## Usuarios Demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | admin@technova.demo | demo123456 |
| MANAGER | manager@technova.demo | demo123456 |
| TECHNICIAN | tecnico1@technova.demo | demo123456 |
| CLIENT | cliente1@demo.com | demo123456 |

**Total de registros demo**: 100+ registros realistas

## APIs Disponibles

### Autenticación
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/supabase` - Supabase Auth

### Usuarios
- `GET /api/v1/users` - Lista usuarios
- `GET /api/v1/users/:id` - Usuario por ID
- `PATCH /api/v1/users/:id` - Actualizar

### Reservas
- `POST /api/v1/bookings` - Crear reserva
- `GET /api/v1/bookings` - Lista reservas
- `GET /api/v1/bookings/:id` - Reserva por ID
- `GET /api/v1/bookings/stats` - Estadísticas

### Servicios
- `GET /api/v1/services` - Lista servicios

### Pagos
- `POST /api/v1/payments/create-intent/:bookingId` - Crear PaymentIntent
- `POST /api/v1/payments/webhook` - Stripe Webhook
- `GET /api/v1/payments/stats` - Estadísticas

### Workflows
- `GET /api/v1/workflows/booking/:bookingId` - Pasos de workflow
- `PATCH /api/v1/workflows/:id` - Actualizar paso

### Reportes
- `POST /api/v1/reports` - Crear reporte
- `GET /api/v1/reports` - Lista reportes

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard

### SOS
- `POST /api/v1/sos` - Crear SOS
- `GET /api/v1/sos` - Lista SOS
- `GET /api/v1/sos/stats` - Estadísticas

## Stripe Test Cards

| Número de Tarjeta | Resultado |
|-------------------|-----------|
| 4242 4242 4242 4242 | Pago exitoso |
| 4000 0000 0000 9995 | Pago rechazado |
| 4000 0000 0000 3220 | Requiere 3D Secure |

## Despliegue Recomendado

| Componente | Plataforma |
|-----------|------------|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase |
| Auth | Supabase Auth |
| Payments | Stripe (TEST) |

## Documentación API

Swagger UI disponible en: `http://localhost:3000/docs`

## Notas Importantes

1. **SOLO DEMO**: Todos los datos son ficticios
2. **NO PRODUCCIÓN**: No usar para sistemas reales
3. **Stripe en TEST**: Usar tarjetas de prueba únicamente
4. **Dominios .demo**: Todos los emails usan dominio .demo
5. **Seguridad**: Contraseñas hasheadas pero sistema no es seguro

## Licencia

MIT - Demo Only
"# sistech360-demo" 
