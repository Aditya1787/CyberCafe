import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(env.SUPABASE_URL && (env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY));
}

/**
 * Public client for client-side/anon operations
 */
export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase URL and Anon/Service Key are not configured in environment.');
  }

  if (!supabaseClient) {
    const key = env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY!;
    supabaseClient = createClient(env.SUPABASE_URL!, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseClient;
}

/**
 * Admin client using Service Role Key (server-only, bypasses RLS)
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured() || !env.SUPABASE_SERVICE_ROLE_KEY) {
    // If only anon key is available in development, fall back with warning
    if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY missing, using SUPABASE_ANON_KEY for admin client.');
      return getSupabaseClient();
    }
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server administrative operations.');
  }

  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseAdminClient;
}
