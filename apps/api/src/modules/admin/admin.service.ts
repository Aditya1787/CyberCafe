import { getSupabaseAdmin, isSupabaseConfigured } from '../../config/supabase.js';

export async function getDashboardMetrics() {
  if (!isSupabaseConfigured()) {
    return {
      totalAppointments: 0,
      appointmentsToday: 0,
      pendingAppointments: 0,
      confirmedAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      totalFeedback: 0,
      averageRating: 0,
      topServices: [],
      recentAppointments: [],
      trend7Days: [],
    };
  }

  const supabase = getSupabaseAdmin();
  const todayStr = new Date().toISOString().slice(0, 10);

  // 1. Total appointments count
  const { count: totalAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true });

  // 2. Appointments today
  const { count: appointmentsToday } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('appointment_date', todayStr);

  // 3. Status counts
  const { count: pendingAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: confirmedAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'confirmed');

  const { count: completedAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const { count: cancelledAppointments } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'cancelled');

  // 4. Feedback metrics
  const { count: totalFeedback } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true });

  const { data: ratings } = await supabase
    .from('feedback')
    .select('rating');

  let averageRating = 0;
  if (ratings && ratings.length > 0) {
    const sum = ratings.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    averageRating = Number((sum / ratings.length).toFixed(1));
  }

  // 5. Recent 5 appointments
  const { data: recentAppointments } = await supabase
    .from('appointments')
    .select('id, booking_reference, customer_name, customer_phone, service_name_snapshot, appointment_date, start_time, status')
    .order('created_at', { ascending: false })
    .limit(5);

  // 6. Trend over last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

  const { data: trendData } = await supabase
    .from('appointments')
    .select('appointment_date, status')
    .gte('appointment_date', sevenDaysAgoStr)
    .order('appointment_date', { ascending: true });

  const trendMap = new Map<string, { date: string; total: number; completed: number }>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    const dStr = d.toISOString().slice(0, 10);
    trendMap.set(dStr, { date: dStr, total: 0, completed: 0 });
  }

  (trendData || []).forEach((row) => {
    const existing = trendMap.get(row.appointment_date);
    if (existing) {
      existing.total += 1;
      if (row.status === 'completed') existing.completed += 1;
    }
  });

  // 7. Most requested services
  const { data: serviceBookings } = await supabase
    .from('appointments')
    .select('service_name_snapshot');

  const serviceCountMap = new Map<string, number>();
  (serviceBookings || []).forEach((sb) => {
    const name = sb.service_name_snapshot;
    serviceCountMap.set(name, (serviceCountMap.get(name) || 0) + 1);
  });

  const topServices = Array.from(serviceCountMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalAppointments: totalAppointments || 0,
    appointmentsToday: appointmentsToday || 0,
    pendingAppointments: pendingAppointments || 0,
    confirmedAppointments: confirmedAppointments || 0,
    completedAppointments: completedAppointments || 0,
    cancelledAppointments: cancelledAppointments || 0,
    totalFeedback: totalFeedback || 0,
    averageRating,
    topServices,
    recentAppointments: recentAppointments || [],
    trend7Days: Array.from(trendMap.values()),
  };
}

export async function getAuditLogs(limit = 50) {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, actor:profiles(display_name, role)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
