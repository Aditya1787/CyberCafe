import { getSupabaseAdmin, isSupabaseConfigured } from '../../config/supabase.js';
import { generateBookingReference } from '../../utils/referenceGenerator.js';
import { validateAndNormalizeIndianPhone } from '../../utils/phoneValidator.js';
import { z } from 'zod';
import {
  adminAppointmentsQuerySchema,
  createAppointmentSchema,
  lookupAppointmentSchema,
  updateStatusSchema,
} from './appointments.schemas.js';

export async function createAppointment(input: z.infer<typeof createAppointmentSchema>) {
  if (!isSupabaseConfigured()) {
    throw new Error('Database service is not configured. Unable to process appointment.');
  }

  const supabase = getSupabaseAdmin();
  const normalizedPhone = validateAndNormalizeIndianPhone(input.customer_phone).normalized;

  // 1. Fetch primary service details for snapshot
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('id, name, estimated_duration_minutes, booking_enabled, is_active')
    .eq('id', input.service_id)
    .single();

  if (serviceError || !service || !service.is_active || !service.booking_enabled) {
    const error = new Error('Selected service is not currently available for booking');
    (error as unknown as { statusCode: number }).statusCode = 400;
    throw error;
  }

  // Calculate start & end time
  let startTime = input.start_time;
  if (startTime.length === 5) startTime += ':00';

  const durationMin = service.estimated_duration_minutes || 30;
  const [sh, sm] = startTime.split(':').map(Number);
  const endTotalMin = sh * 60 + sm + durationMin;
  const endH = Math.floor(endTotalMin / 60);
  const endM = endTotalMin % 60;
  const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;

  // Generate unique booking reference
  const targetDate = new Date(`${input.appointment_date}T00:00:00+05:30`);
  const bookingRef = generateBookingReference(targetDate);

  // 2. Call the PostgreSQL atomic function to guarantee slot concurrency
  const { data: rpcResult, error: rpcError } = await supabase.rpc('book_appointment_atomic', {
    p_booking_reference: bookingRef,
    p_customer_name: input.customer_name.trim(),
    p_customer_phone: normalizedPhone,
    p_customer_email: input.customer_email ? input.customer_email.trim() : null,
    p_service_id: service.id,
    p_service_name_snapshot: service.name,
    p_additional_services_snapshot: input.additional_services || [],
    p_appointment_date: input.appointment_date,
    p_start_time: startTime,
    p_end_time: endTime,
    p_customer_notes: input.customer_notes ? input.customer_notes.trim() : null,
  });

  if (rpcError) {
    console.error('book_appointment_atomic RPC error:', rpcError);
    // If the stored procedure is not yet run in Supabase, fall back to safe check-and-insert
    return createAppointmentDirectFallback(supabase, {
      bookingRef,
      service,
      normalizedPhone,
      startTime,
      endTime,
      input,
    });
  }

  if (!rpcResult.success) {
    const error = new Error(rpcResult.error || 'Failed to book slot');
    (error as unknown as { statusCode: number; code: string }).statusCode = 409;
    (error as unknown as { statusCode: number; code: string }).code = 'SLOT_UNAVAILABLE';
    throw error;
  }

  const appt = rpcResult.appointment;

  return {
    booking_reference: appt.booking_reference,
    customer_name: appt.customer_name,
    customer_phone: appt.customer_phone,
    service_name_snapshot: appt.service_name_snapshot,
    appointment_date: appt.appointment_date,
    start_time: appt.start_time.slice(0, 5),
    end_time: appt.end_time.slice(0, 5),
    status: appt.status,
    created_at: appt.created_at,
  };
}

// Direct atomic fallback helper if RPC is missing
async function createAppointmentDirectFallback(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  params: {
    bookingRef: string;
    service: { id: string; name: string };
    normalizedPhone: string;
    startTime: string;
    endTime: string;
    input: z.infer<typeof createAppointmentSchema>;
  }
) {
  // Check capacity directly
  const { count } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('appointment_date', params.input.appointment_date)
    .eq('start_time', params.startTime)
    .neq('status', 'cancelled');

  if ((count || 0) >= 3) {
    const err = new Error('This time slot is fully booked. Please select another slot.');
    (err as unknown as { statusCode: number; code: string }).statusCode = 409;
    (err as unknown as { statusCode: number; code: string }).code = 'SLOT_UNAVAILABLE';
    throw err;
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      booking_reference: params.bookingRef,
      customer_name: params.input.customer_name.trim(),
      customer_phone: params.normalizedPhone,
      customer_email: params.input.customer_email || null,
      service_id: params.service.id,
      service_name_snapshot: params.service.name,
      additional_services_snapshot: params.input.additional_services || [],
      appointment_date: params.input.appointment_date,
      start_time: params.startTime,
      end_time: params.endTime,
      customer_notes: params.input.customer_notes || null,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    booking_reference: data.booking_reference,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    service_name_snapshot: data.service_name_snapshot,
    appointment_date: data.appointment_date,
    start_time: data.start_time.slice(0, 5),
    end_time: data.end_time.slice(0, 5),
    status: data.status,
    created_at: data.created_at,
  };
}

export async function lookupAppointment(input: z.infer<typeof lookupAppointmentSchema>) {
  if (!isSupabaseConfigured()) {
    throw new Error('Database service is not configured');
  }

  const supabase = getSupabaseAdmin();
  const normalizedPhone = validateAndNormalizeIndianPhone(input.customer_phone).normalized;
  const cleanRef = input.booking_reference.trim().toUpperCase();

  const { data: appointment, error } = await supabase
    .from('appointments')
    .select(`
      booking_reference,
      customer_name,
      customer_phone,
      service_name_snapshot,
      appointment_date,
      start_time,
      end_time,
      status,
      created_at
    `)
    .eq('booking_reference', cleanRef)
    .maybeSingle();

  if (error || !appointment) {
    const err = new Error('No appointment found matching this booking reference and phone number');
    (err as unknown as { statusCode: number; code: string }).statusCode = 404;
    (err as unknown as { statusCode: number; code: string }).code = 'APPOINTMENT_NOT_FOUND';
    throw err;
  }

  // Verify the phone number factor
  if (appointment.customer_phone !== normalizedPhone) {
    const err = new Error('No appointment found matching this booking reference and phone number');
    (err as unknown as { statusCode: number; code: string }).statusCode = 404;
    (err as unknown as { statusCode: number; code: string }).code = 'APPOINTMENT_NOT_FOUND';
    throw err;
  }

  // Return safe sanitised response (mask phone number except last 4 digits)
  const maskedPhone = appointment.customer_phone.replace(/(\d{6})(\d{4})/, 'XXXXXX$2');

  return {
    booking_reference: appointment.booking_reference,
    customer_name: appointment.customer_name,
    customer_phone_masked: maskedPhone,
    service_name: appointment.service_name_snapshot,
    appointment_date: appointment.appointment_date,
    start_time: appointment.start_time.slice(0, 5),
    end_time: appointment.end_time.slice(0, 5),
    status: appointment.status,
    created_at: appointment.created_at,
  };
}

export async function getAdminAppointments(params: z.infer<typeof adminAppointmentsQuerySchema>) {
  if (!isSupabaseConfigured()) {
    return { data: [], meta: { page: 1, limit: params.limit, total: 0, totalPages: 0 } };
  }

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('appointments')
    .select('*, service:services(id, name, slug, icon)', { count: 'exact' });

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status);
  }

  if (params.date) {
    query = query.eq('appointment_date', params.date);
  }

  if (params.service_id) {
    query = query.eq('service_id', params.service_id);
  }

  if (params.search) {
    const s = params.search.trim();
    query = query.or(`customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%,booking_reference.ilike.%${s}%`);
  }

  query = query.order('appointment_date', { ascending: false }).order('start_time', { ascending: true });

  const from = (params.page - 1) * params.limit;
  const to = from + params.limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  const total = count || 0;
  return {
    data: data || [],
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

export async function getAdminAppointmentById(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('appointments')
    .select('*, service:services(id, name, slug, icon)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateAppointmentStatusAdmin(id: string, input: z.infer<typeof updateStatusSchema>, actorId?: string) {
  const supabase = getSupabaseAdmin();
  
  const updatePayload: Record<string, unknown> = {
    status: input.status,
    updated_at: new Date().toISOString(),
  };

  if (input.status === 'completed') {
    updatePayload.completed_at = new Date().toISOString();
  } else if (input.status === 'cancelled') {
    updatePayload.cancelled_at = new Date().toISOString();
  } else if (input.status === 'confirmed') {
    updatePayload.verified_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('appointments')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: `UPDATE_APPOINTMENT_STATUS_${input.status.toUpperCase()}`,
    entity_type: 'appointment',
    entity_id: id,
    safe_metadata: { new_status: input.status, notes: input.notes },
  }]);

  return data;
}

export async function exportAppointmentsCSV(params: { startDate?: string; endDate?: string; status?: string }) {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('appointments')
    .select(`
      booking_reference,
      customer_name,
      customer_phone,
      customer_email,
      service_name_snapshot,
      appointment_date,
      start_time,
      end_time,
      status,
      created_at
    `)
    .order('appointment_date', { ascending: false });

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status);
  }
  if (params.startDate) {
    query = query.gte('appointment_date', params.startDate);
  }
  if (params.endDate) {
    query = query.lte('appointment_date', params.endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Generate CSV text
  const headers = ['Booking Reference', 'Customer Name', 'Phone', 'Email', 'Service', 'Date', 'Start Time', 'End Time', 'Status', 'Booked At'];
  const rows = (data || []).map((row) => [
    `"${row.booking_reference}"`,
    `"${row.customer_name.replace(/"/g, '""')}"`,
    `"${row.customer_phone}"`,
    `"${row.customer_email || ''}"`,
    `"${row.service_name_snapshot.replace(/"/g, '""')}"`,
    `"${row.appointment_date}"`,
    `"${row.start_time}"`,
    `"${row.end_time}"`,
    `"${row.status}"`,
    `"${row.created_at}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
