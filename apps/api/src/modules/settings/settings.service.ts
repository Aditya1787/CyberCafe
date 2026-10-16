import { getSupabaseAdmin, getSupabaseClient, isSupabaseConfigured } from '../../config/supabase.js';

export async function getPublicSettings() {
  if (!isSupabaseConfigured()) {
    // Return sensible defaults if database offline
    return {
      business_info: {
        name: 'Baba Anandeshwar Internet Cafe',
        contact_person: 'Anurag Mishra',
        category: 'Internet Cafe, Cyber Cafe, Digital Services and Online Application Assistance',
        address: 'Hanspuram, Naubasta, Kanpur, Uttar Pradesh, India',
        city: 'Kanpur',
        state: 'Uttar Pradesh',
        pincode: '208021',
        primary_phone: '6386463054',
        secondary_phone: '9005536781',
        public_email: 'anandeshwarcafe@gmail.com',
        whatsapp_number: '6386463054',
        directions_url: 'https://maps.google.com/?q=Hanspuram+Naubasta+Kanpur',
      },
      website_content: {
        hero_headline: 'Your Trusted Local Partner for Digital & Online Services',
        hero_supporting: 'From government application assistance and document services to travel bookings, printing, and everyday digital needs — get reliable assistance at Baba Anandeshwar Internet Cafe.',
        announcement_banner_enabled: true,
        announcement_text: 'Now accepting advance visit appointments! Avoid waiting in line by booking your slot online.',
        about_text: 'Located in Hanspuram, Naubasta, Kanpur, Baba Anandeshwar Internet Cafe has been assisting local residents, students, and businesses with end-to-end digital services, online application submissions, verified document printing, and banking agent services with speed and transparency.',
      },
      booking_rules: {
        min_notice_hours: 1,
        max_advance_days: 14,
        slot_duration_minutes: 30,
        cancellation_window_hours: 2,
      },
    };
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('business_settings')
    .select('key, value')
    .eq('is_public', true);

  if (error) throw error;

  const settingsMap: Record<string, unknown> = {};
  (data || []).forEach((row) => {
    settingsMap[row.key] = row.value;
  });

  return settingsMap;
}

export async function getAllSettingsAdmin() {
  if (!isSupabaseConfigured()) return {};
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('business_settings')
    .select('*');

  if (error) throw error;

  const settingsMap: Record<string, unknown> = {};
  (data || []).forEach((row) => {
    settingsMap[row.key] = row.value;
  });

  return settingsMap;
}

export async function updateSettingAdmin(key: string, value: Record<string, unknown>, actorId?: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('business_settings')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'key' })
    .select()
    .single();

  if (error) throw error;

  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'UPDATE_BUSINESS_SETTING',
    entity_type: 'business_settings',
    entity_id: key,
    safe_metadata: { updated_keys: Object.keys(value) },
  }]);

  return data;
}
