# TECHNOVA 360 Backend (DEMO/SANDBOX)

⚠️ **ADVERTENCIA**: Este es un sistema DEMO/SANDBOX con datos ficticios únicamente.

## Resumen

Backend completo para TECHNOVA 360 construido con NestJS, PostgreSQL, y Prisma ORM.

## Stack Tecnológico

- **Runtime**: Node.js + TypeScript
- **Framework**: NestJS
- **Base de Datos**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Autenticación**: Supabase Auth + JWT
- **Pagos**: Stripe (TEST MODE)
- **Documentación**: Swagger/OpenAPI

## Estructura del Proyecto

```
backend/
├── prisma/
│   ├── schema.prisma      # Schema de base de datos
│   └── seed.ts            # Seed con 100 registros demo
├── src/
│   ├── auth/              # Módulo de autenticación
│   ├── users/             # Módulo de usuarios
│   ├── bookings/          # Módulo de reservas
│   ├── services/          # Módulo de servicios
│   ├── payments/          # Módulo de pagos (Stripe)
│   ├── workflows/         # Módulo de flujos de trabajo
│   ├── reports/           # Módulo de reportes técnicos
│   ├── admin/             # Módulo de administración
│   ├── sos/               # Módulo de SOS/emergencias
│   └── prisma/            # Servicio de Prisma
├── .env.example            # Variables de entorno ejemplo
├── package.json
└── tsconfig.json
```

## Configuración

### 1. Variables de Entorno

Copiar `.env.example` a `.env` y completar:

```bash
# DATABASE (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:password@host:5432/technova360_demo"

# SUPABASE
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"

# STRIPE (TEST)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 2. Instalar Dependencias

```bash
cd backend
npm install
```

### 3. Generar Prisma Client

```bash
npx prisma generate
```

### 4. Ejecutar Migraciones

```bash
npx prisma migrate dev --name init
```

### 5. Ejecutar Seed

```bash
npm run prisma:seed
```

### 6. Iniciar Servidor

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Endpoints API

### Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `POST /api/v1/auth/supabase` - Login con Supabase

### Usuarios
- `GET /api/v1/users` - Listar usuarios (Admin)
- `GET /api/v1/users/:id` - Obtener usuario
- `PATCH /api/v1/users/:id` - Actualizar usuario

### Reservas
- `POST /api/v1/bookings` - Crear reserva
- `GET /api/v1/bookings` - Listar reservas
- `GET /api/v1/bookings/:id` - Obtener reserva
- `PATCH /api/v1/bookings/:id` - Actualizar reserva
- `GET /api/v1/bookings/stats` - Estadísticas

### Servicios
- `GET /api/v1/services` - Listar servicios
- `GET /api/v1/services/:id` - Obtener servicio

### Pagos
- `POST /api/v1/payments/create-intent/:bookingId` - Crear PaymentIntent
- `POST /api/v1/payments/webhook` - Stripe Webhook
- `GET /api/v1/payments` - Listar pagos
- `GET /api/v1/payments/stats` - Estadísticas

### Workflows
- `GET /api/v1/workflows/booking/:bookingId` - Pasos de workflow
- `PATCH /api/v1/workflows/:id` - Actualizar paso

### Reportes
- `POST /api/v1/reports` - Crear reporte técnico
- `GET /api/v1/reports` - Listar reportes

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/audit-logs` - Logs de auditoría

### SOS
- `POST /api/v1/sos` - Crear solicitud SOS
- `GET /api/v1/sos` - Listar solicitudes
- `PATCH /api/v1/sos/:id` - Actualizar estado
- `GET /api/v1/sos/stats` - Estadísticas SOS

## Roles y Permisos

| Rol | Permisos |
|-----|----------|
| ADMIN | Acceso total al sistema |
| MANAGER | Gestión de reservas, técnicos, reportes |
| TECHNICIAN | Reportes, actualización de workflows |
| CLIENT | Crear reservas, ver sus reservas |

## Usuarios Demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| ADMIN | admin@technova.demo | demo123456 |
| MANAGER | manager@technova.demo | demo123456 |
| TECHNICIAN | tecnico1@technova.demo | demo123456 |
| CLIENT | cliente1@demo.com | demo123456 |

## Stripe Test Cards

| Número | Resultado |
|--------|-----------|
| 4242 4242 4242 4242 | Pago exitoso |
| 4000 0000 0000 9995 | Pago fallido |
| 4000 0000 0000 3220 | 3D Secure |

## Despliegue

### Render (Backend)
1. Conectar repositorio
2. Configurar variables de entorno
3. Build command: `npm run build`
4. Start command: `npm run start:prod`

### Supabase (DB + Auth)
1. Crear proyecto en Supabase
2. Configurar DATABASE_URL
3. Ejecutar migraciones
4. Configurar Supabase Auth

## Licencia

MIT - Demo/Sandbox Only
