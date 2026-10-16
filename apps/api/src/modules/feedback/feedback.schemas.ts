import { z } from 'zod';

export const submitFeedbackSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  booking_reference: z.string().optional().nullable().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  category: z.enum(['service_quality', 'staff_assistance', 'waiting_time', 'website_experience', 'other']),
  message: z.string().min(5, 'Review message must be at least 5 characters').max(1000),
  public_display_consent: z.boolean().default(false),
  privacy_consent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the privacy policy to submit feedback' }),
  }),
});

export const adminFeedbackQuerySchema = z.object({
  rating: z.string().optional().transform((v) => v ? parseInt(v, 10) : undefined),
  moderation_status: z.enum(['pending', 'approved', 'rejected', 'all']).optional(),
  resolution_status: z.enum(['unresolved', 'in_progress', 'resolved', 'all']).optional(),
  page: z.string().optional().default('1').transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('20').transform((v) => Math.min(100, Math.max(1, parseInt(v, 10) || 20))),
});

export const updateFeedbackModerationSchema = z.object({
  moderation_status: z.enum(['pending', 'approved', 'rejected']).optional(),
  resolution_status: z.enum(['unresolved', 'in_progress', 'resolved']).optional(),
});

export const updateFeedbackNotesSchema = z.object({
  internal_notes: z.string().max(2000),
});
