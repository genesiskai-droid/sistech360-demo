// TECHNOVA 360 Backend - Roles Decorator (DEMO/SANDBOX)
// ============================================================

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
