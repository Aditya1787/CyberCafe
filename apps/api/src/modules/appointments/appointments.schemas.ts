import { z } from 'zod';
import { validateAndNormalizeIndianPhone } from '../../utils/phoneValidator.js';

export const createAppointmentSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customer_phone: z.string().refine((val) => {
    const res = validateAndNormalizeIndianPhone(val);
    return res.isValid;
  }, {
    message: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9',
  }),
  customer_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  service_id: z.string().uuid('Please select a valid service'),
  additional_services: z.array(z.string().uuid()).optional().default([]),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be HH:MM or HH:MM:SS'),
  customer_notes: z.string().max(500).optional().nullable(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the privacy notice to proceed with booking' }),
  }),
});

export const lookupAppointmentSchema = z.object({
  booking_reference: z.string().min(6).max(30).trim(),
  customer_phone: z.string().refine((val) => {
    const res = validateAndNormalizeIndianPhone(val);
    return res.isValid;
  }, {
    message: 'Please enter a valid 10-digit Indian mobile number',
  }),
});

export const adminAppointmentsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'all']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  service_id: z.string().uuid().optional(),
  page: z.string().optional().default('1').transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('20').transform((v) => Math.min(100, Math.max(1, parseInt(v, 10) || 20))),
});

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']),
  notes: z.string().optional(),
});
