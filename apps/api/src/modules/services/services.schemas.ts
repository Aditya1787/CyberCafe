import { z } from 'zod';

export const serviceQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
  page: z.string().optional().default('1').transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('20').transform((v) => Math.min(100, Math.max(1, parseInt(v, 10) || 20))),
  sort: z.enum(['order', 'name_asc', 'name_desc', 'newest']).optional().default('order'),
});

export const serviceCreateSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lower-case alphanumeric with hyphens'),
  short_description: z.string().min(5).max(300),
  description: z.string().min(10),
  service_type: z.enum(['online_assistance', 'physical_service', 'authorized_agent', 'mixed']).default('online_assistance'),
  required_documents: z.array(z.string()).default([]),
  instructions: z.string().optional().nullable(),
  provider_name: z.string().optional().nullable(),
  official_url: z.string().url().optional().nullable().or(z.literal('')),
  price_amount: z.number().min(0).optional().nullable(),
  price_label: z.string().optional().nullable(),
  estimated_duration_minutes: z.number().int().min(1).max(360).optional().nullable(),
  icon: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  booking_enabled: z.boolean().default(true),
  display_order: z.number().int().default(0),
  disclaimer: z.string().optional().nullable(),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();
