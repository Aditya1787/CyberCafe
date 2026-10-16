import { getSupabaseAdmin, getSupabaseClient, isSupabaseConfigured } from '../../config/supabase.js';
import { z } from 'zod';
import {
  adminFeedbackQuerySchema,
  submitFeedbackSchema,
  updateFeedbackModerationSchema,
} from './feedback.schemas.js';

export async function submitFeedback(input: z.infer<typeof submitFeedbackSchema>) {
  if (!isSupabaseConfigured()) {
    throw new Error('Database service is not configured');
  }

  const supabase = getSupabaseClient();

  let appointmentId: string | null = null;
  if (input.booking_reference && input.booking_reference.trim()) {
    const adminSupabase = getSupabaseAdmin();
    const { data: appt } = await adminSupabase
      .from('appointments')
      .select('id')
      .eq('booking_reference', input.booking_reference.trim().toUpperCase())
      .maybeSingle();

    if (appt) appointmentId = appt.id;
  }

  const { data, error } = await supabase
    .from('feedback')
    .insert([{
      display_name: input.display_name.trim(),
      appointment_id: appointmentId,
      rating: input.rating,
      category: input.category,
      message: input.message.trim(),
      public_display_consent: input.public_display_consent,
      moderation_status: 'pending',
      resolution_status: 'unresolved',
      internal_notes: null, // Protected: never set by client
    }])
    .select('id, display_name, rating, category, created_at')
    .single();

  if (error) throw error;
  return data;
}

export async function getPublicApprovedFeedback() {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = getSupabaseClient();
  // Safe public query: only approved feedback with public consent, NO internal notes or private info
  const { data, error } = await supabase
    .from('feedback')
    .select('id, display_name, rating, category, message, created_at')
    .eq('moderation_status', 'approved')
    .eq('public_display_consent', true)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
}

export async function getAdminFeedback(params: z.infer<typeof adminFeedbackQuerySchema>) {
  if (!isSupabaseConfigured()) {
    return { data: [], meta: { page: 1, limit: params.limit, total: 0, totalPages: 0 } };
  }

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('feedback')
    .select('*, appointment:appointments(booking_reference, service_name_snapshot, customer_name)', { count: 'exact' });

  if (params.rating) {
    query = query.eq('rating', params.rating);
  }

  if (params.moderation_status && params.moderation_status !== 'all') {
    query = query.eq('moderation_status', params.moderation_status);
  }

  if (params.resolution_status && params.resolution_status !== 'all') {
    query = query.eq('resolution_status', params.resolution_status);
  }

  query = query.order('created_at', { ascending: false });

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

export async function updateFeedbackModeration(
  id: string,
  input: z.infer<typeof updateFeedbackModerationSchema>,
  actorId?: string
) {
  const supabase = getSupabaseAdmin();
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.moderation_status) updates.moderation_status = input.moderation_status;
  if (input.resolution_status) updates.resolution_status = input.resolution_status;

  const { data, error } = await supabase
    .from('feedback')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'MODERATE_FEEDBACK',
    entity_type: 'feedback',
    entity_id: id,
    safe_metadata: updates,
  }]);

  return data;
}

export async function updateFeedbackInternalNotes(id: string, notes: string, actorId?: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('feedback')
    .update({ internal_notes: notes, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'UPDATE_FEEDBACK_INTERNAL_NOTES',
    entity_type: 'feedback',
    entity_id: id,
    safe_metadata: { note_length: notes.length },
  }]);

  return data;
}

export async function deleteFeedbackAdmin(id: string, actorId?: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('feedback')
    .delete()
    .eq('id', id);

  if (error) throw error;

  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'DELETE_FEEDBACK',
    entity_type: 'feedback',
    entity_id: id,
    safe_metadata: {},
  }]);

  return { success: true };
}
