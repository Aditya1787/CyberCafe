import { getSupabaseAdmin, getSupabaseClient, isSupabaseConfigured } from '../../config/supabase.js';

export interface TimeSlot {
  time: string; // e.g. "09:00"
  endTime: string; // e.g. "09:30"
  available: boolean;
  remainingCapacity: number;
  reason?: string;
}

export interface DayAvailabilityResponse {
  date: string;
  isOpen: boolean;
  reason?: string;
  businessHours?: {
    openingTime: string;
    closingTime: string;
    breakStart?: string | null;
    breakEnd?: string | null;
  };
  slots: TimeSlot[];
}

export async function getAvailabilityForDate(dateStr: string): Promise<DayAvailabilityResponse> {
  const targetDate = new Date(`${dateStr}T00:00:00+05:30`);
  if (isNaN(targetDate.getTime())) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }

  if (!isSupabaseConfigured()) {
    // Return sample sensible availability if Supabase is offline
    return generateFallbackSlots(dateStr, targetDate.getDay());
  }

  const supabase = getSupabaseClient();

  // 1. Check blocked dates
  const { data: blockedDate } = await supabase
    .from('blocked_dates')
    .select('*')
    .eq('blocked_date', dateStr)
    .maybeSingle();

  if (blockedDate) {
    return {
      date: dateStr,
      isOpen: false,
      reason: blockedDate.reason || 'Cafe is closed on this date (Holiday / Scheduled Maintenance)',
      slots: [],
    };
  }

  // 2. Fetch business hours for weekday
  const weekday = targetDate.getDay(); // 0=Sunday, 1=Monday...
  const { data: hours, error: hoursError } = await supabase
    .from('business_hours')
    .select('*')
    .eq('weekday', weekday)
    .maybeSingle();

  if (hoursError) throw hoursError;

  if (!hours || !hours.is_open) {
    return {
      date: dateStr,
      isOpen: false,
      reason: 'Cafe is closed on this day of the week',
      slots: [],
    };
  }

  // 3. Fetch existing appointments on this date
  const { data: appointments, error: apptError } = await supabase
    .from('appointments')
    .select('start_time, status')
    .eq('appointment_date', dateStr)
    .neq('status', 'cancelled');

  if (apptError) throw apptError;

  // Map appointment counts by start_time (HH:MM)
  const slotCountMap = new Map<string, number>();
  (appointments || []).forEach((appt) => {
    const timeKey = appt.start_time.slice(0, 5); // "09:00:00" -> "09:00"
    slotCountMap.set(timeKey, (slotCountMap.get(timeKey) || 0) + 1);
  });

  // 4. Generate all slots
  const slots: TimeSlot[] = [];
  const slotDuration = hours.slot_duration_minutes || 30;
  const maxCap = hours.max_bookings_per_slot || 3;

  const [openHour, openMin] = hours.opening_time.split(':').map(Number);
  const [closeHour, closeMin] = hours.closing_time.split(':').map(Number);

  let currentMinutes = openHour * 60 + openMin;
  const endMinutes = closeHour * 60 + closeMin;

  let breakStartMin: number | null = null;
  let breakEndMin: number | null = null;
  if (hours.break_start && hours.break_end) {
    const [bsh, bsm] = hours.break_start.split(':').map(Number);
    const [beh, bem] = hours.break_end.split(':').map(Number);
    breakStartMin = bsh * 60 + bsm;
    breakEndMin = beh * 60 + bem;
  }

  // Check current time in Asia/Kolkata
  const now = new Date();
  const kolkataNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const isToday = now.toISOString().slice(0, 10) === dateStr;
  const nowMinutes = kolkataNow.getHours() * 60 + kolkataNow.getMinutes();

  while (currentMinutes + slotDuration <= endMinutes) {
    const slotStartH = Math.floor(currentMinutes / 60);
    const slotStartM = currentMinutes % 60;
    const slotEndH = Math.floor((currentMinutes + slotDuration) / 60);
    const slotEndM = (currentMinutes + slotDuration) % 60;

    const timeStr = `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`;
    const endTimeStr = `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`;

    // Check break overlap
    const isBreak = breakStartMin !== null && breakEndMin !== null &&
      currentMinutes >= breakStartMin && currentMinutes < breakEndMin;

    if (!isBreak) {
      const bookedCount = slotCountMap.get(timeStr) || 0;
      const remainingCapacity = Math.max(0, maxCap - bookedCount);

      // If today, check if slot is in the past or within 1 hour notice
      const isPastOrTooSoon = isToday && (currentMinutes <= nowMinutes + 60);

      const available = !isPastOrTooSoon && remainingCapacity > 0;
      let reason: string | undefined;
      if (isPastOrTooSoon) {
        reason = 'Past or within minimum booking notice';
      } else if (remainingCapacity === 0) {
        reason = 'Slot is fully booked';
      }

      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        available,
        remainingCapacity,
        reason,
      });
    }

    currentMinutes += slotDuration;
  }

  return {
    date: dateStr,
    isOpen: true,
    businessHours: {
      openingTime: hours.opening_time.slice(0, 5),
      closingTime: hours.closing_time.slice(0, 5),
      breakStart: hours.break_start?.slice(0, 5),
      breakEnd: hours.break_end?.slice(0, 5),
    },
    slots,
  };
}

function generateFallbackSlots(dateStr: string, weekday: number): DayAvailabilityResponse {
  if (weekday === 0) {
    // Sunday half day
    return {
      date: dateStr,
      isOpen: true,
      businessHours: { openingTime: '10:00', closingTime: '15:00' },
      slots: [
        { time: '10:00', endTime: '10:30', available: true, remainingCapacity: 2 },
        { time: '10:30', endTime: '11:00', available: true, remainingCapacity: 2 },
        { time: '11:00', endTime: '11:30', available: true, remainingCapacity: 2 },
        { time: '11:30', endTime: '12:00', available: true, remainingCapacity: 2 },
        { time: '12:00', endTime: '12:30', available: true, remainingCapacity: 2 },
        { time: '12:30', endTime: '13:00', available: true, remainingCapacity: 2 },
        { time: '13:00', endTime: '13:30', available: true, remainingCapacity: 2 },
        { time: '13:30', endTime: '14:00', available: true, remainingCapacity: 2 },
        { time: '14:00', endTime: '14:30', available: true, remainingCapacity: 2 },
      ],
    };
  }

  return {
    date: dateStr,
    isOpen: true,
    businessHours: { openingTime: '09:00', closingTime: '20:00', breakStart: '13:30', breakEnd: '14:30' },
    slots: [
      { time: '09:00', endTime: '09:30', available: true, remainingCapacity: 3 },
      { time: '09:30', endTime: '10:00', available: true, remainingCapacity: 3 },
      { time: '10:00', endTime: '10:30', available: true, remainingCapacity: 3 },
      { time: '10:30', endTime: '11:00', available: true, remainingCapacity: 3 },
      { time: '11:00', endTime: '11:30', available: true, remainingCapacity: 3 },
      { time: '11:30', endTime: '12:00', available: true, remainingCapacity: 3 },
      { time: '12:00', endTime: '12:30', available: true, remainingCapacity: 3 },
      { time: '12:30', endTime: '13:00', available: true, remainingCapacity: 3 },
      { time: '13:00', endTime: '13:30', available: true, remainingCapacity: 3 },
      { time: '14:30', endTime: '15:00', available: true, remainingCapacity: 3 },
      { time: '15:00', endTime: '15:30', available: true, remainingCapacity: 3 },
      { time: '15:30', endTime: '16:00', available: true, remainingCapacity: 3 },
      { time: '16:00', endTime: '16:30', available: true, remainingCapacity: 3 },
      { time: '16:30', endTime: '17:00', available: true, remainingCapacity: 3 },
      { time: '17:00', endTime: '17:30', available: true, remainingCapacity: 3 },
      { time: '17:30', endTime: '18:00', available: true, remainingCapacity: 3 },
      { time: '18:00', endTime: '18:30', available: true, remainingCapacity: 3 },
      { time: '18:30', endTime: '19:00', available: true, remainingCapacity: 3 },
      { time: '19:00', endTime: '19:30', available: true, remainingCapacity: 3 },
    ],
  };
}

export async function getBusinessHoursAdmin() {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('business_hours')
    .select('*')
    .order('weekday', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateBusinessHoursAdmin(weekday: number, updates: Record<string, unknown>, actorId?: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('business_hours')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('weekday', weekday)
    .select()
    .single();

  if (error) throw error;

  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'UPDATE_BUSINESS_HOURS',
    entity_type: 'business_hours',
    entity_id: String(weekday),
    safe_metadata: updates,
  }]);

  return data;
}

export async function getBlockedDatesAdmin() {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('*')
    .order('blocked_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createBlockedDateAdmin(blockedDate: string, reason?: string, actorId?: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('blocked_dates')
    .insert([{ blocked_date: blockedDate, reason }])
    .select()
    .single();

  if (error) throw error;

  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'CREATE_BLOCKED_DATE',
    entity_type: 'blocked_dates',
    entity_id: data.id,
    safe_metadata: { blocked_date: blockedDate, reason },
  }]);

  return data;
}

export async function deleteBlockedDateAdmin(id: string, actorId?: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('blocked_dates')
    .delete()
    .eq('id', id);

  if (error) throw error;

  await supabase.from('audit_logs').insert([{
    actor_user_id: actorId || null,
    action: 'DELETE_BLOCKED_DATE',
    entity_type: 'blocked_dates',
    entity_id: id,
    safe_metadata: {},
  }]);

  return { success: true };
}
