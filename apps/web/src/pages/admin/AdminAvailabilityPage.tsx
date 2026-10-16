import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Calendar, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../api/client.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';
import { useToast } from '../../context/ToastContext.js';

interface BusinessHourRow {
  id: string;
  weekday: number;
  is_open: boolean;
  opening_time: string;
  closing_time: string;
  break_start: string | null;
  break_end: string | null;
  slot_duration_minutes: number;
  max_bookings_per_slot: number;
}

interface BlockedDateRow {
  id: string;
  blocked_date: string;
  reason: string;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AdminAvailabilityPage: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  // Fetch Business Hours
  const { data: hoursData, isLoading: hoursLoading } = useQuery<{ data: BusinessHourRow[] }>({
    queryKey: ['admin-business-hours'],
    queryFn: () => apiRequest('/admin/availability/hours'),
  });

  // Fetch Blocked Dates
  const { data: blockedData, isLoading: blockedLoading } = useQuery<{ data: BlockedDateRow[] }>({
    queryKey: ['admin-blocked-dates'],
    queryFn: () => apiRequest('/admin/availability/blocked-dates'),
  });

  const hours = hoursData?.data || [];
  const blockedDates = blockedData?.data || [];

  // Update Hours Mutation
  const updateHourMutation = useMutation({
    mutationFn: ({ weekday, updates }: { weekday: number; updates: Partial<BusinessHourRow> }) =>
      apiRequest(`/admin/availability/hours/${weekday}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-business-hours'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Operating hours updated');
    },
    onError: (err: Error) => {
      toast.error('Failed to update hours', err.message);
    },
  });

  // Add Blocked Date Mutation
  const addBlockedMutation = useMutation({
    mutationFn: (payload: { blocked_date: string; reason?: string }) =>
      apiRequest('/admin/availability/blocked-dates', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blocked-dates'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      setNewBlockedDate('');
      setNewBlockedReason('');
      toast.success('Blocked date added successfully');
    },
    onError: (err: Error) => {
      toast.error('Failed to block date', err.message);
    },
  });

  // Delete Blocked Date Mutation
  const deleteBlockedMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/admin/availability/blocked-dates/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blocked-dates'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      toast.success('Blocked date removed');
    },
    onError: (err: Error) => {
      toast.error('Failed to remove blocked date', err.message);
    },
  });

  const handleHourToggle = (h: BusinessHourRow) => {
    updateHourMutation.mutate({
      weekday: h.weekday,
      updates: { is_open: !h.is_open },
    });
  };

  const handleHourChange = (weekday: number, field: string, val: unknown) => {
    updateHourMutation.mutate({
      weekday,
      updates: { [field]: val },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy-dark tracking-tight">
          Hours & Booking Availability
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Configure operating times, slot intervals, capacity per time slot, and holiday calendar closures.
        </p>
      </div>

      {/* Weekday Schedule Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <Clock className="w-5 h-5 text-brand-teal" />
          <h2 className="text-lg font-bold text-gray-900">Weekly Operating Hours & Slot Capacity</h2>
        </div>

        <div className="space-y-4">
          {hoursLoading ? (
            <div className="py-8 text-center text-gray-400 text-xs">Loading hours...</div>
          ) : (
            hours.map((h) => (
              <div
                key={h.weekday}
                className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 w-40 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleHourToggle(h)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      h.is_open ? 'bg-brand-teal' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                        h.is_open ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="font-bold text-sm text-gray-900">{WEEKDAYS[h.weekday]}</span>
                </div>

                {h.is_open ? (
                  <div className="flex flex-wrap items-center gap-3 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Open:</span>
                      <input
                        type="time"
                        defaultValue={h.opening_time.slice(0, 5)}
                        onBlur={(e) => handleHourChange(h.weekday, 'opening_time', `${e.target.value}:00`)}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Close:</span>
                      <input
                        type="time"
                        defaultValue={h.closing_time.slice(0, 5)}
                        onBlur={(e) => handleHourChange(h.weekday, 'closing_time', `${e.target.value}:00`)}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Break:</span>
                      <input
                        type="time"
                        defaultValue={h.break_start ? h.break_start.slice(0, 5) : '13:30'}
                        onBlur={(e) => handleHourChange(h.weekday, 'break_start', `${e.target.value}:00`)}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        defaultValue={h.break_end ? h.break_end.slice(0, 5) : '14:30'}
                        onBlur={(e) => handleHourChange(h.weekday, 'break_end', `${e.target.value}:00`)}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500">Slot Cap:</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        defaultValue={h.max_bookings_per_slot || 3}
                        onBlur={(e) => handleHourChange(h.weekday, 'max_bookings_per_slot', parseInt(e.target.value, 10))}
                        className="bg-white border border-gray-200 rounded-lg px-2 py-1 w-14"
                      />
                      <span className="text-gray-400">ppl/slot</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 font-medium">Closed for bookings</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Blocked Dates & Holidays */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <Calendar className="w-5 h-5 text-brand-gold" />
          <h2 className="text-lg font-bold text-gray-900">Blocked Dates & Holiday Closures</h2>
        </div>

        {/* Add new blocked date form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newBlockedDate) {
              addBlockedMutation.mutate({ blocked_date: newBlockedDate, reason: newBlockedReason });
            }
          }}
          className="p-4 rounded-2xl bg-gray-50 border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end text-xs"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Date to Block</label>
            <input
              type="date"
              required
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Closure Reason (e.g. Festival / Maintenance)</label>
            <input
              type="text"
              placeholder="e.g. Diwali Holiday"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2"
            />
          </div>

          <Button variant="secondary" size="sm" type="submit" isLoading={addBlockedMutation.isPending} leftIcon={<Plus className="w-4 h-4" />}>
            Block Date
          </Button>
        </form>

        {/* Blocked Dates List */}
        <div className="space-y-2 text-xs">
          {blockedLoading ? (
            <div className="text-center py-4 text-gray-400">Loading blocked dates...</div>
          ) : blockedDates.length === 0 ? (
            <p className="text-center py-6 text-gray-400">No dates are currently blocked.</p>
          ) : (
            blockedDates.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50/60 border border-rose-100"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-rose-900 font-mono text-sm">{b.blocked_date}</span>
                  <span className="text-rose-700">{b.reason || 'Closed / Holiday'}</span>
                </div>
                <button
                  onClick={() => deleteBlockedMutation.mutate(b.id)}
                  className="p-1 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                  title="Remove block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
