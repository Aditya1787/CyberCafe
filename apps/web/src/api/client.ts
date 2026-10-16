import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { directSupabase } from './directSupabase.js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://tizmvrrsccqhrfxesazn.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpem12cnJzY2NxaHJmeGVzYXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNDAxMDcsImV4cCI6MjEwNzcxNjEwN30.ezupfIbMq21nAMD1tGKzy8BRcbXGnyeuZqRZCjTr85A';

export const isSupabaseFrontendConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('placeholder')
);

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * Direct Database / Supabase API Request Router
 * Bypasses need for Express backend - executes directly against Supabase!
 */
export async function apiRequest<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const urlPath = endpoint.startsWith('http') ? new URL(endpoint).pathname : endpoint;
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : undefined;

  // Extract Query parameters
  const [cleanPath, queryString] = urlPath.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. Categories
  if (cleanPath === '/service-categories' || cleanPath === '/api/service-categories') {
    const data = await directSupabase.getCategories();
    return { data } as unknown as T;
  }

  // 2. Services list
  if (cleanPath === '/services' || cleanPath === '/api/services') {
    const featured = params.get('featured') === 'true';
    const category = params.get('category') || undefined;
    const search = params.get('search') || undefined;
    const limit = params.get('limit') ? parseInt(params.get('limit')!, 10) : undefined;

    const res = await directSupabase.getServices({ featured, category, search, limit });
    return res as unknown as T;
  }

  // 3. Service Detail
  if (cleanPath.startsWith('/services/') || cleanPath.startsWith('/api/services/')) {
    const slug = cleanPath.replace(/^\/(api\/)?services\//, '');
    const data = await directSupabase.getServiceBySlug(slug);
    return { data } as unknown as T;
  }

  // 4. Availability
  if (cleanPath === '/availability' || cleanPath === '/api/availability') {
    const date = params.get('date') || new Date().toISOString().split('T')[0];
    const data = await directSupabase.getAvailability(date);
    return { data } as unknown as T;
  }

  // 5. Appointments
  if (cleanPath === '/appointments' || cleanPath === '/api/appointments') {
    if (method === 'POST') {
      const res = await directSupabase.bookAppointment(body);
      return res as unknown as T;
    }
  }

  // 6. Appointment Lookup
  if (cleanPath === '/appointments/lookup' || cleanPath === '/api/appointments/lookup') {
    const res = await directSupabase.lookupAppointment(body.booking_reference, body.phone);
    return res as unknown as T;
  }

  // 7. Feedback
  if (cleanPath === '/feedback' || cleanPath === '/api/feedback') {
    if (method === 'POST') {
      const res = await directSupabase.submitFeedback(body);
      return res as unknown as T;
    }
  }

  if (cleanPath === '/feedback/public' || cleanPath === '/api/feedback/public') {
    const data = await directSupabase.getPublicFeedback();
    return { data } as unknown as T;
  }

  // 8. Settings
  if (cleanPath === '/settings' || cleanPath === '/api/settings') {
    const data = await directSupabase.getSettings();
    return { data } as unknown as T;
  }

  // 9. Admin Dashboard
  if (cleanPath === '/admin/dashboard' || cleanPath === '/api/admin/dashboard') {
    const data = await directSupabase.getDashboardMetrics();
    return { data } as unknown as T;
  }

  // 10. Admin Appointments
  if (cleanPath === '/admin/appointments' || cleanPath === '/api/admin/appointments') {
    const status = params.get('status') || undefined;
    const date = params.get('date') || undefined;
    const search = params.get('search') || undefined;
    const limit = params.get('limit') ? parseInt(params.get('limit')!, 10) : undefined;
    const page = params.get('page') ? parseInt(params.get('page')!, 10) : undefined;

    const res = await directSupabase.getAdminAppointments({ status, date, search, limit, page });
    return res as unknown as T;
  }

  if (cleanPath.match(/^\/(api\/)?admin\/appointments\/[^/]+\/status$/)) {
    const id = cleanPath.split('/')[cleanPath.split('/').length - 2];
    const res = await directSupabase.updateAppointmentStatus(id, body.status);
    return { data: res } as unknown as T;
  }

  // 11. Admin Feedback
  if (cleanPath === '/admin/feedback' || cleanPath === '/api/admin/feedback') {
    const moderation_status = params.get('moderation_status') || undefined;
    const category = params.get('category') || undefined;
    const res = await directSupabase.getAdminFeedback({ moderation_status, category });
    return res as unknown as T;
  }

  if (cleanPath.match(/^\/(api\/)?admin\/feedback\/[^/]+$/) && method === 'PATCH') {
    const id = cleanPath.split('/').pop()!;
    const res = await directSupabase.updateFeedback(id, body);
    return { data: res } as unknown as T;
  }

  if (cleanPath.match(/^\/(api\/)?admin\/feedback\/[^/]+\/notes$/) && method === 'PATCH') {
    const id = cleanPath.split('/')[cleanPath.split('/').length - 2];
    const res = await directSupabase.updateFeedback(id, body);
    return { data: res } as unknown as T;
  }

  // 12. Admin Services & Settings
  if (cleanPath === '/admin/services' || cleanPath === '/api/admin/services') {
    const res = await directSupabase.getServices({ limit: 100 });
    return res as unknown as T;
  }

  if (cleanPath === '/admin/settings' || cleanPath === '/api/admin/settings') {
    const data = await directSupabase.getSettings();
    return { data } as unknown as T;
  }

  if (cleanPath === '/admin/availability/hours' || cleanPath === '/api/admin/availability/hours') {
    return { data: [] } as unknown as T;
  }

  if (cleanPath === '/admin/availability/blocked-dates' || cleanPath === '/api/admin/availability/blocked-dates') {
    return { data: [] } as unknown as T;
  }

  // Fallback: If unknown, try native fetch in case a remote API URL is specified
  try {
    const targetUrl = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(targetUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      },
    });
    if (response.headers.get('content-type')?.includes('text/csv')) {
      const text = await response.text();
      return text as unknown as T;
    }
    return (await response.json()) as T;
  } catch {
    return { success: true, data: [] } as unknown as T;
  }
}
