// TECHNOVA 360 Backend - Supabase Login DTO (DEMO/SANDBOX)
// ============================================================

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SupabaseLoginDto {
  @ApiProperty({ description: 'Supabase Auth token' })
  @IsString()
  token: string;
}
