import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Users,
  Layers,
  ArrowRight,
  TrendingUp,
  Download,
  Sliders,
} from 'lucide-react';
import { apiRequest, supabase, isSupabaseFrontendConfigured } from '../../api/client.js';
import { DashboardMetrics } from '../../types/index.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Real-time synchronization for dashboard
  useEffect(() => {
    const handleSync = () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    };
    window.addEventListener('baba_cafe_data_sync', handleSync);

    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('baba_cafe_sync_channel');
        bc.onmessage = () => {
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
        };
      }
    } catch {
      // Ignore
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null;
    if (isSupabaseFrontendConfigured) {
      try {
        channel = supabase
          .channel('realtime_admin_dashboard')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => {
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
          })
          .subscribe();
      } catch {
        // Ignore
      }
    }

    return () => {
      window.removeEventListener('baba_cafe_data_sync', handleSync);
      if (bc) bc.close();
      if (channel) supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data, isLoading } = useQuery<{ data: DashboardMetrics }>({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiRequest('/admin/dashboard'),
    refetchInterval: 3000, // Live refresh every 3s
  });

  const m = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Appointments', value: m?.totalAppointments || 0, icon: <Calendar className="w-5 h-5 text-brand-navy" />, bg: 'bg-blue-50' },
    { label: 'Appointments Today', value: m?.appointmentsToday || 0, icon: <Clock className="w-5 h-5 text-brand-teal" />, bg: 'bg-teal-50' },
    { label: 'Pending Verification', value: m?.pendingAppointments || 0, icon: <Clock className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Confirmed Bookings', value: m?.confirmedAppointments || 0, icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Completed Visits', value: m?.completedAppointments || 0, icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />, bg: 'bg-indigo-50' },
    { label: 'Cancelled Bookings', value: m?.cancelledAppointments || 0, icon: <XCircle className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50' },
    { label: 'Total Feedback', value: m?.totalFeedback || 0, icon: <Users className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Average Rating', value: `${m?.averageRating || 0} / 5`, icon: <Star className="w-5 h-5 text-amber-500 fill-amber-500" />, bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time business performance metrics for Baba Anandeshwar Internet Cafe
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/appointments">
            <Button variant="secondary" size="sm" leftIcon={<CalendarCheck className="w-4 h-4" />}>
              Manage Appointments
            </Button>
          </Link>
          <a href="/api/admin/appointments/export" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Export CSV
            </Button>
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="neo-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl neo-pill-inset flex items-center justify-center flex-shrink-0">
              {stat.icon}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold truncate block">{stat.label}</span>
              <span className="text-lg sm:text-2xl font-black text-slate-800 mt-0.5 block">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 7-Day Trend Bar Visualizer */}
      <div className="neo-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl neo-pill-inset flex items-center justify-center text-brand-teal">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">7-Day Appointment Trend</h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Live Database</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-4 pt-4 border-t border-slate-200/60 items-end h-44">
          {(m?.trend7Days || []).map((day, idx) => {
            const maxVal = Math.max(...(m?.trend7Days || []).map(d => d.total), 5);
            const heightPercent = Math.min(100, Math.round((day.total / maxVal) * 100));

            return (
              <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 group">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.total}
                </span>
                <div className="w-full neo-inset rounded-xl overflow-hidden flex flex-col justify-end h-32 p-1">
                  <div
                    style={{ height: `${Math.max(12, heightPercent)}%` }}
                    className="w-full bg-gradient-to-t from-brand-navy to-brand-teal rounded-lg transition-all"
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 truncate w-full text-center">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Appointments & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 neo-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Recent Bookings</h3>
            <Link to="/admin/appointments" className="text-xs text-brand-teal hover:underline font-bold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {(m?.recentAppointments || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center font-medium">No bookings recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-200/60 overflow-x-auto text-xs">
              {(m?.recentAppointments || []).map((appt) => (
                <div key={appt.id} className="py-3 flex items-center justify-between gap-3 min-w-[280px]">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block truncate">{appt.customer_name}</span>
                    <span className="text-slate-400 font-mono text-[11px] font-semibold">{appt.booking_reference}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-slate-700 font-semibold block truncate max-w-[140px] sm:max-w-[200px]">{appt.service_name_snapshot}</span>
                    <span className="text-slate-400 text-[11px]">{appt.appointment_date} at {appt.start_time?.slice(0, 5)}</span>
                  </div>
                  <Badge variant={appt.status === 'confirmed' ? 'confirmed' : appt.status === 'completed' ? 'completed' : 'pending'}>
                    {appt.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Services */}
        <div className="neo-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Top Requested</h3>
            <Link to="/admin/services" className="text-xs text-brand-teal hover:underline font-bold">
              Catalogue
            </Link>
          </div>

          {(m?.topServices || []).length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center font-medium">No service requests yet.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {(m?.topServices || []).map((svc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl neo-card-sm">
                  <span className="font-semibold text-slate-800 truncate mr-2">{svc.name}</span>
                  <span className="neo-pill-inset text-brand-teal font-extrabold text-[11px] px-2.5 py-0.5 flex-shrink-0">
                    {svc.count} visits
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
