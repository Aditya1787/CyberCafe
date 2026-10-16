import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000').transform((v) => parseInt(v, 10)),
  FRONTEND_ORIGIN: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(10).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10).optional(),
  BOOKING_LOOKUP_PEPPER: z.string().default('baba_anandeshwar_secret_pepper_2025_secure_key'),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  EMAIL_FROM_ADDRESS: z.string().email().optional().default('notifications@anandeshwarcafe.in'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed:', parsed.error.format());
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export const env = parsed.success ? parsed.data : {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  BOOKING_LOOKUP_PEPPER: process.env.BOOKING_LOOKUP_PEPPER || 'baba_anandeshwar_secret_pepper_2025_secure_key',
  EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY,
  EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || 'notifications@anandeshwarcafe.in',
};
