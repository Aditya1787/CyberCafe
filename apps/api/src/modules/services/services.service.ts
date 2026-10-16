import { getSupabaseAdmin, getSupabaseClient, isSupabaseConfigured } from '../../config/supabase.js';
import { z } from 'zod';
import { serviceCreateSchema, serviceQuerySchema, serviceUpdateSchema } from './services.schemas.js';
import { SEED_CATEGORIES, SEED_SERVICES } from './catalogData.js';

export async function getActiveCategories() {
  if (!isSupabaseConfigured()) {
    return SEED_CATEGORIES.filter((c) => c.is_active);
  }
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.warn('Falling back to local categories:', error.message);
    return SEED_CATEGORIES.filter((c) => c.is_active);
  }
  return data || [];
}

export async function getPublicServices(params: z.infer<typeof serviceQuerySchema>) {
  if (!isSupabaseConfigured()) {
    return filterAndPaginateSeedServices(params);
  }
  const supabase = getSupabaseClient();
  let query = supabase
    .from('services')
    .select(`
      id,
      category_id,
      name,
      slug,
      short_description,
      description,
      service_type,
      required_documents,
      instructions,
      provider_name,
      official_url,
      price_amount,
      price_label,
      estimated_duration_minutes,
      icon,
      is_featured,
      booking_enabled,
      display_order,
      disclaimer,
      category:service_categories(id, name, slug)
    `, { count: 'exact' })
    .eq('is_active', true);

  if (params.category) {
    query = query.eq('category.slug', params.category);
  }

  if (params.featured === 'true') {
    query = query.eq('is_featured', true);
  }

  if (params.search) {
    const s = params.search.trim();
    query = query.or(`name.ilike.%${s}%,short_description.ilike.%${s}%,description.ilike.%${s}%`);
  }

  // Sorting
  if (params.sort === 'name_asc') {
    query = query.order('name', { ascending: true });
  } else if (params.sort === 'name_desc') {
    query = query.order('name', { ascending: false });
  } else if (params.sort === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('display_order', { ascending: true }).order('name', { ascending: true });
  }

  // Pagination
  const from = (params.page - 1) * params.limit;
  const to = from + params.limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) {
    console.warn('Falling back to local services:', error.message);
    return filterAndPaginateSeedServices(params);
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / params.limit);

  return {
    data: data || [],
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
    },
  };
}

function filterAndPaginateSeedServices(params: z.infer<typeof serviceQuerySchema>) {
  let list = SEED_SERVICES.filter((s) => s.is_active);

  if (params.category) {
    list = list.filter((s) => s.category?.slug === params.category || s.category_id === params.category);
  }

  if (params.featured === 'true') {
    list = list.filter((s) => s.is_featured);
  }

  if (params.search) {
    const term = params.search.toLowerCase().trim();
    list = list.filter((s) =>
      s.name.toLowerCase().includes(term) ||
      s.short_description.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      (s.required_documents && s.required_documents.some((d) => d.toLowerCase().includes(term)))
    );
  }

  if (params.sort === 'name_asc') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (params.sort === 'name_desc') {
    list.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    list.sort((a, b) => a.display_order - b.display_order);
  }

  const total = list.length;
  const from = (params.page - 1) * params.limit;
  const paginated = list.slice(from, from + params.limit);

  return {
    data: paginated,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages: Math.ceil(total / params.limit),
    },
  };
}

export async function getServiceBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    return SEED_SERVICES.find((s) => s.slug === slug && s.is_active) || null;
  }
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('services')
    .select(`
      id,
      category_id,
      name,
      slug,
      short_description,
      description,
      service_type,
      required_documents,
      instructions,
      provider_name,
      official_url,
      price_amount,
      price_label,
      estimated_duration_minutes,
      icon,
      is_featured,
      is_active,
      booking_enabled,
      display_order,
      disclaimer,
      category:service_categories(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    return SEED_SERVICES.find((s) => s.slug === slug && s.is_active) || null;
  }
  return data || null;
}

export async function getAllServicesAdmin() {
  if (!isSupabaseConfigured()) return SEED_SERVICES;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      category:service_categories(id, name, slug)
    `)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) return SEED_SERVICES;
  return data || [];
}

export async function createServiceAdmin(input: z.infer<typeof serviceCreateSchema>, actorId?: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('services')
    .insert([input])
    .select()
    .single();

  if (error) throw error;

  // Audit log
  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'CREATE_SERVICE',
    entity_type: 'service',
    entity_id: data.id,
    safe_metadata: { name: data.name, slug: data.slug },
  }]);

  return data;
}

export async function updateServiceAdmin(id: string, input: z.infer<typeof serviceUpdateSchema>, actorId?: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('services')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Audit log
  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'UPDATE_SERVICE',
    entity_type: 'service',
    entity_id: id,
    safe_metadata: { updated_fields: Object.keys(input) },
  }]);

  return data;
}

export async function deactivateServiceAdmin(id: string, actorId?: string) {
  const supabase = getSupabaseAdmin();
  // Safe soft deactivation preserving historical appointments
  const { data, error } = await supabase
    .from('services')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Audit log
  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'DEACTIVATE_SERVICE',
    entity_type: 'service',
    entity_id: id,
    safe_metadata: { name: data.name },
  }]);

  return data;
}
