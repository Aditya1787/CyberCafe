import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Search,
  CalendarCheck,
  Clock,
  Phone,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  PhoneCall,
  ChevronRight,
} from 'lucide-react';
import { apiRequest } from '../api/client.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { Badge } from '../components/common/Badge.js';
import { useToast } from '../context/ToastContext.js';

interface StatusResult {
  booking_reference: string;
  customer_name: string;
  customer_phone_masked: string;
  service_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  created_at: string;
}

export const AppointmentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';
  const toast = useToast();

  const [bookingRef, setBookingRef] = useState(initialRef);
  const [phone, setPhone] = useState('');
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null);

  useEffect(() => {
    if (initialRef) setBookingRef(initialRef);
  }, [initialRef]);

  const lookupMutation = useMutation({
    mutationFn: (payload: { booking_reference: string; customer_phone: string }) =>
      apiRequest<{ data: StatusResult }>('/appointments/lookup', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (res) => {
      setStatusResult(res.data);
      toast.success('Record located', `Status: ${res.data.status.toUpperCase()}`);
    },
    onError: (err: Error) => {
      setStatusResult(null);
      toast.error('Lookup failed', err.message);
    },
  });

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef.trim()) {
      toast.error('Reference needed', 'Please enter your booking reference (e.g. BAC-...)');
      return;
    }
    if (!phone.trim()) {
      toast.error('Phone needed', 'Please enter the registered 10-digit mobile number');
      return;
    }

    lookupMutation.mutate({
      booking_reference: bookingRef.trim().toUpperCase(),
      customer_phone: phone.trim(),
    });
  };

  const getStatusBadgeVariant = (status: StatusResult['status']) => {
    switch (status) {
      case 'confirmed': return 'confirmed';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      case 'no_show': return 'no_show';
      default: return 'pending';
    }
  };

  const getStatusDescription = (status: StatusResult['status']) => {
    switch (status) {
      case 'pending':
        return 'Your booking request is received and currently awaiting review by cafe staff. Please arrive with your original documents.';
      case 'confirmed':
        return 'Your appointment is confirmed! Our staff has reserved your desk slot and looks forward to assisting you.';
      case 'completed':
        return 'This visit has been marked as completed. Thank you for choosing Baba Anandeshwar Internet Cafe! Please leave us feedback.';
      case 'cancelled':
        return 'This appointment has been cancelled. If you wish to reschedule, please make a new booking online or call the cafe.';
      case 'no_show':
        return 'This appointment was marked as a no-show. Please call our team if you need to rebook.';
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 mb-6">
          <Link to="/" className="hover:text-brand-navy dark:hover:text-sky-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 dark:text-white font-medium">Check Appointment Status</span>
        </nav>

        {/* Card */}
        <div className="neo-card p-6 sm:p-10 space-y-8">
          <div>
            <span className="neo-pill-inset px-3 py-1 text-xs font-bold tracking-widest uppercase text-sky-700 dark:text-sky-400">
              Booking Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
              Check Appointment Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Enter your booking reference code and registered phone number to verify appointment status.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLookup} className="space-y-4">
            <Input
              label="Booking Reference Number"
              required
              placeholder="e.g. BAC-350237"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
              className="font-mono uppercase font-bold text-sky-900"
            />

            <Input
              label="Registered Mobile Number"
              required
              type="tel"
              placeholder="10-digit mobile (e.g. 9876543210)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              helperText="Second verification factor for security"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={lookupMutation.isPending}
                leftIcon={<Search className="w-4 h-4" />}
              >
                Track Appointment
              </Button>
            </div>
          </form>

          {/* Result Card */}
          {statusResult && (
            <div className="p-6 rounded-2xl neo-inset space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                    Reference Code
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-sky-900">
                    {statusResult.booking_reference}
                  </span>
                </div>
                <Badge variant={getStatusBadgeVariant(statusResult.status)} className="text-xs uppercase px-3 py-1">
                  {statusResult.status}
                </Badge>
              </div>

              {/* Status Explanation Banner */}
              <div className="p-3.5 rounded-xl neo-card-sm text-xs text-slate-700 leading-relaxed font-medium">
                {getStatusDescription(statusResult.status)}
              </div>

              {/* Details table */}
              <div className="text-xs space-y-2.5 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Customer Name:</span>
                  <span className="font-bold text-slate-900">{statusResult.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Verified Phone:</span>
                  <span className="font-mono font-medium text-slate-900">{statusResult.customer_phone_masked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Service:</span>
                  <span className="font-bold text-sky-800">{statusResult.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Scheduled Date:</span>
                  <span className="font-bold text-slate-900">{statusResult.appointment_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Reserved Slot:</span>
                  <span className="font-bold text-slate-900">
                    {statusResult.start_time} – {statusResult.end_time}
                  </span>
                </div>
              </div>

              {/* Help & Support */}
              <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-sky-600" />
                  <span>Need changes? Call 6386463054</span>
                </div>
                {statusResult.status === 'completed' && (
                  <Link to="/feedback" className="text-sky-700 hover:underline font-bold">
                    Leave Feedback &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
