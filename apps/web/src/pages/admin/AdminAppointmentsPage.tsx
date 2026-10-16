import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { apiRequest, supabase, isSupabaseFrontendConfigured } from '../../api/client.js';
import { Appointment, Service } from '../../types/index.js';
import { Badge } from '../../components/common/Badge.js';
import { Button } from '../../components/common/Button.js';
import { Modal } from '../../components/common/Modal.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminAppointmentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);

  // Selected appointment for detail modal
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  // Real-time synchronization for appointments
  useEffect(() => {
    // 1. In-window & broadcast sync
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (!customEvent.detail || customEvent.detail.entity === 'appointments' || customEvent.detail.entity === 'all') {
        queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      }
    };
    window.addEventListener('baba_cafe_data_sync', handleSync);

    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel('baba_cafe_sync_channel');
        bc.onmessage = (msg) => {
          if (msg.data?.entity === 'appointments' || msg.data?.entity === 'all') {
            queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
          }
        };
      }
    } catch {
      // Ignore
    }

    // 2. Supabase Realtime channel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null;
    if (isSupabaseFrontendConfigured) {
      try {
        channel = supabase
          .channel('realtime_admin_appointments')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'appointments' },
            () => {
              queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
            }
          )
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

  // Fetch appointments query with real-time polling fallback
  const { data, isLoading } = useQuery<{ data: Appointment[]; meta: { total: number; totalPages: number } }>({
    queryKey: ['admin-appointments', search, statusFilter, dateFilter, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (dateFilter) params.set('date', dateFilter);
      params.set('page', String(page));
      params.set('limit', '15');
      return apiRequest(`/admin/appointments?${params.toString()}`);
    },
    refetchInterval: 3000, // Live real-time polling every 3 seconds
  });

  const appointments = data?.data || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawMeta = data?.meta || (data as any)?.pagination;
  const totalPages = rawMeta?.totalPages || Math.ceil((rawMeta?.total || appointments.length) / 15) || 1;
  const totalCount = rawMeta?.total ?? appointments.length;

  // Status Update Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      apiRequest(`/admin/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Status updated successfully');
      setSelectedAppt(null);
    },
    onError: (err: Error) => {
      toast.error('Failed to update status', err.message);
    },
  });

  const handleUpdateStatus = (id: string, status: string) => {
    if (window.confirm(`Are you sure you want to change appointment status to '${status.toUpperCase()}'?`)) {
      updateStatusMutation.mutate({ id, status });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark tracking-tight">
            Appointment Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Total {totalCount} appointment records in database
          </p>
        </div>

        <a href="/api/admin/appointments/export" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export CSV
          </Button>
        </a>
      </div>

      {/* Filter Bar */}
      <div className="neo-card p-4 sm:p-5 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by customer name, phone, or BAC reference..."
            className="w-full pl-11 pr-4 py-2.5 neo-inset text-base sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full md:w-auto neo-inset text-base sm:text-xs px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="w-full md:w-auto">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
            className="w-full md:w-auto neo-inset text-base sm:text-xs px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        {/* Reset */}
        {(search || statusFilter !== 'all' || dateFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter('all'); setDateFilter(''); setPage(1); }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-1.5 neo-btn"
          >
            Reset
          </button>
        )}
      </div>

      {/* Appointments Table */}
      <div className="neo-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200/60 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-4">Booking Ref</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">Service</th>
                <th className="py-4 px-4">Date & Slot</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">Loading appointments...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">No appointments found matching your filters.</td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                      {appt.booking_reference}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {appt.customer_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {appt.customer_phone}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 max-w-[180px] truncate">
                      {appt.service_name_snapshot}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="font-semibold text-gray-900 block">{appt.appointment_date}</span>
                      <span className="text-[11px] text-gray-400">{appt.start_time?.slice(0, 5)} - {appt.end_time?.slice(0, 5)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={appt.status === 'confirmed' ? 'confirmed' : appt.status === 'completed' ? 'completed' : appt.status === 'cancelled' ? 'cancelled' : 'pending'}>
                        {appt.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedAppt(appt)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-brand-navy hover:bg-gray-100 transition-colors"
                        title="View & Edit Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Detail & Status Update Modal */}
      {selectedAppt && (
        <Modal
          isOpen={Boolean(selectedAppt)}
          onClose={() => setSelectedAppt(null)}
          title={`Appointment ${selectedAppt.booking_reference}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Summary Box */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-400 block text-xs">Customer Name:</span>
                <span className="font-bold text-gray-900">{selectedAppt.customer_name}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Contact Phone:</span>
                <span className="font-mono font-bold text-gray-900">{selectedAppt.customer_phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Service:</span>
                <span className="font-bold text-brand-navy">{selectedAppt.service_name_snapshot}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Date & Time:</span>
                <span className="font-semibold text-gray-900">
                  {selectedAppt.appointment_date} at {selectedAppt.start_time?.slice(0, 5)} - {selectedAppt.end_time?.slice(0, 5)}
                </span>
              </div>
              {selectedAppt.customer_notes && (
                <div className="col-span-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-400 block text-xs">Customer Notes:</span>
                  <p className="text-gray-700 italic">{selectedAppt.customer_notes}</p>
                </div>
              )}
            </div>

            {/* Current Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Current Status:</span>
              <Badge variant={selectedAppt.status as any} className="text-xs uppercase px-3 py-1">
                {selectedAppt.status}
              </Badge>
            </div>

            {/* Status Change Action Buttons */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Update Booking Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'confirmed')}
                  disabled={selectedAppt.status === 'confirmed'}
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'completed')}
                  disabled={selectedAppt.status === 'completed'}
                >
                  Completed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'cancelled')}
                  disabled={selectedAppt.status === 'cancelled'}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  onClick={() => handleUpdateStatus(selectedAppt.id, 'no_show')}
                  disabled={selectedAppt.status === 'no_show'}
                >
                  No-Show
                </Button>
              </div>
            </div>

            {/* Print button */}
            <div className="pt-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Print Desk Slip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
