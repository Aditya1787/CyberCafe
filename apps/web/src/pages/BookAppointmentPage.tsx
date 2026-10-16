import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  CalendarCheck,
  Clock,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Phone,
  Printer,
  ChevronRight,
  Info,
  Calendar,
} from 'lucide-react';
import { apiRequest } from '../api/client.js';
import { Service, DayAvailability } from '../types/index.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { Badge } from '../components/common/Badge.js';
import { useToast } from '../context/ToastContext.js';

export const BookAppointmentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedServiceId = searchParams.get('service') || '';
  const toast = useToast();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    // Tomorrow as initial default, or today
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Success Confirmation State
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    booking_reference: string;
    customer_name: string;
    customer_phone: string;
    service_name_snapshot: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    status: string;
    created_at: string;
  } | null>(null);

  // Fetch all active booking-enabled services
  const { data: servicesData } = useQuery<{ data: Service[] }>({
    queryKey: ['booking-services'],
    queryFn: () => apiRequest('/services?limit=60'),
    staleTime: 5 * 60 * 1000,
  });

  const services = (servicesData?.data || []).filter((s) => s.booking_enabled);

  // Update selected service if preselected parameter exists
  useEffect(() => {
    if (preselectedServiceId && services.some((s) => s.id === preselectedServiceId)) {
      setSelectedServiceId(preselectedServiceId);
    } else if (!selectedServiceId && services.length > 0) {
      setSelectedServiceId(services[0].id);
    }
  }, [preselectedServiceId, services, selectedServiceId]);

  // Fetch real-time availability for the chosen date
  const { data: availabilityData, isLoading: isAvailabilityLoading } = useQuery<{ data: DayAvailability }>({
    queryKey: ['availability', appointmentDate],
    queryFn: () => apiRequest(`/availability?date=${appointmentDate}`),
    enabled: Boolean(appointmentDate),
    staleTime: 30 * 1000, // 30 sec cache
  });

  const availability = availabilityData?.data;
  const availableSlots = availability?.slots || [];

  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedTimeSlot('');
  }, [appointmentDate]);

  // Booking Mutation
  const bookMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiRequest<{ data: typeof bookingConfirmation }>('/appointments', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: (res) => {
      if (res?.data) {
        setBookingConfirmation(res.data);
        toast.success('Appointment booked successfully!', `Reference: ${res.data.booking_reference}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    onError: (err: Error) => {
      toast.error('Booking failed', err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!privacyConsent) {
      toast.error('Consent required', 'Please accept the privacy notice to proceed');
      return;
    }

    if (!selectedTimeSlot) {
      toast.error('Time slot required', 'Please select an available appointment time slot');
      return;
    }

    const selectedService = services.find((s) => s.id === selectedServiceId);
    const serviceName = selectedService?.name || 'Internet Cafe Consultation';

    const cleanSlot = selectedTimeSlot.slice(0, 5);
    const [slotHour, slotMinute] = cleanSlot.split(':').map(Number);
    const totalMinutes = slotHour * 60 + slotMinute + 30;
    const endHour = Math.floor(totalMinutes / 60) % 24;
    const endMinute = totalMinutes % 60;
    const formattedEndTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
    const formattedStartTime = `${cleanSlot}:00`;

    bookMutation.mutate({
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail?.trim() || undefined,
      service_id: selectedServiceId,
      service_name_snapshot: serviceName,
      appointment_date: appointmentDate,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      customer_notes: customerNotes?.trim() || undefined,
      consent: true,
    });
  };

  // Date constraints: from today up to 14 days ahead
  const todayStr = new Date().toISOString().slice(0, 10);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  const maxDateStr = maxDate.toISOString().slice(0, 10);

  // If Booking is confirmed, render confirmation receipt view
  if (bookingConfirmation) {
    return (
      <div className="min-h-screen py-10 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="neo-card p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl neo-circle text-emerald-600 mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="neo-pill-inset px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
                Appointment Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Your Visit Is Scheduled
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Please save your unique booking reference number. Bring your original documents at your booked time.
              </p>
            </div>

            {/* Reference Card */}
            <div className="neo-inset p-6 space-y-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                Booking Reference Number
              </span>
              <div className="text-2xl sm:text-3xl font-black text-sky-800 tracking-wider select-all font-mono">
                {bookingConfirmation.booking_reference}
              </div>
              <Badge variant="pending" className="text-xs px-3 py-1">
                Status: Pending Cafe Verification
              </Badge>
            </div>

            {/* Booking Details Table */}
            <div className="neo-inset p-4 text-left text-xs sm:text-sm divide-y divide-slate-200/50">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Customer Name:</span>
                <span className="font-bold text-slate-900">{bookingConfirmation.customer_name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Registered Phone:</span>
                <span className="font-bold text-slate-900">{bookingConfirmation.customer_phone}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Service:</span>
                <span className="font-bold text-sky-800">{bookingConfirmation.service_name_snapshot}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500 font-medium">Date & Time:</span>
                <span className="font-bold text-slate-900">
                  {bookingConfirmation.appointment_date} at {bookingConfirmation.start_time} - {bookingConfirmation.end_time}
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center gap-3">
                <span className="text-slate-500 font-medium flex-shrink-0">Cafe Address:</span>
                <a
                  href="https://www.google.com/maps/place/Baba+Cyber+Cafe+%26+Photo+Copy/@26.3935664,80.3094068,15z/data=!4m15!1m8!3m7!1s0x399c467d62cfd26d:0xa04877de65f55c0d!2sHanspuram,+Naubasta,+Kanpur,+Uttar+Pradesh+208021!3b1!8m2!3d26.3901426!4d80.3199179!16s%2Fg%2F11_p_30tt!3m5!1s0x399c47fec3a8da09:0x7f82135d13837b37!8m2!3d26.3867308!4d80.3139335!16s%2Fg%2F11tkb2396s?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-teal text-right hover:underline"
                >
                  Baba Cyber Cafe &amp; Photo Copy, Hanspuram
                </a>
              </div>
            </div>

            {/* Preparation notice */}
            <div className="p-4 rounded-2xl neo-inset text-left text-xs text-amber-900 space-y-1">
              <h4 className="font-bold flex items-center gap-1.5 text-amber-800">
                <Info className="w-4 h-4 text-amber-600" />
                What to bring on your visit:
              </h4>
              <p className="leading-relaxed text-slate-700">
                Please bring original supporting documents and your mobile phone for OTP verification. Report 5 minutes before your scheduled slot.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="outline"
                className="w-full sm:flex-1"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
              <Link to={`/appointment-status?ref=${bookingConfirmation.booking_reference}`} className="w-full sm:flex-1">
                <Button variant="secondary" className="w-full">
                  Check Booking Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-sky-700 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold">Book Appointment</span>
        </nav>

        {/* Form Container */}
        <div className="neo-card p-5 sm:p-10">
          <div className="border-b border-slate-200/60 pb-6 mb-8">
            <span className="neo-pill-inset px-3 py-1 text-xs font-bold tracking-widest uppercase text-sky-700">
              Advance Visit Reservation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Book Your Cafe Appointment
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Choose your service, preferred date, and real-time available time slot. Avoid waiting in queues.
            </p>
          </div>

          {/* Privacy & No-Sensitive-Data Banner */}
          <div className="p-4 rounded-2xl neo-inset flex items-start gap-3 text-xs text-slate-800 mb-8 leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">Privacy Notice & Security Guarantee</h4>
              <p className="text-slate-600">
                We only collect your name, phone number, and service preference to schedule your visit. <strong>Never</strong> disclose Aadhaar numbers, PAN numbers, OTPs, or bank passwords on this website. Bring your documents in person.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Step 1: Contact Details */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full neo-circle text-sky-700 text-xs font-bold">1</span>
                Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  label="Mobile Number"
                  required
                  type="tel"
                  placeholder="10-digit mobile (e.g. 9876543210)"
                  helperText="Used for booking verification factor and status lookup"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <Input
                label="Email Address (Optional)"
                type="email"
                placeholder="e.g. ramesh@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            {/* Step 2: Service Selection */}
            <div className="space-y-4 pt-4 border-t border-slate-200/60">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full neo-circle text-sky-700 text-xs font-bold">2</span>
                Select Service
              </h2>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Primary Service <span className="text-rose-500">*</span>
                </label>
                <div className="neo-inset p-1">
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 focus:outline-none rounded-xl"
                    required
                  >
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.name} {svc.price_amount ? `(₹${svc.price_amount})` : ''} — {svc.category?.name || ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Date & Real-time Available Time Slots */}
            <div className="space-y-4 pt-4 border-t border-slate-200/60">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full neo-circle text-sky-700 text-xs font-bold">3</span>
                Select Visit Date & Time Slot
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Appointment Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="neo-inset p-1">
                    <input
                      type="date"
                      min={todayStr}
                      max={maxDateStr}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-transparent px-3 py-2 sm:py-2.5 text-base sm:text-sm text-slate-900 focus:outline-none rounded-xl"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Bookings open up to 14 days in advance</p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Operating Hours on Selected Date
                  </label>
                  <div className="p-3 rounded-2xl neo-inset text-xs text-slate-700 flex items-center justify-between">
                    {availability?.isOpen ? (
                      <>
                        <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                          <Clock className="w-4 h-4" /> Open
                        </span>
                        <span className="font-semibold text-slate-800">
                          {availability.businessHours?.openingTime} – {availability.businessHours?.closingTime}
                        </span>
                      </>
                    ) : (
                      <span className="text-rose-600 font-bold">
                        {availability?.reason || 'Closed on this date'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Slots Selector with Phone Touch Grid */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Available Slots <span className="text-rose-500">*</span>
                </label>

                {isAvailabilityLoading ? (
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-14 neo-card-sm animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : !availability?.isOpen ? (
                  <div className="p-4 rounded-2xl neo-inset text-rose-800 text-xs text-center font-medium">
                    {availability?.reason || 'The cafe is closed on this date. Please pick another date.'}
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 rounded-2xl neo-inset text-slate-600 text-xs text-center font-medium">
                    No available time slots remaining on this date. Please choose a different date.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`p-3 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 min-h-[50px] ${
                            isSelected
                              ? 'neo-btn-teal text-white ring-2 ring-sky-300 ring-offset-2 ring-offset-[#e9eef6] scale-[1.02]'
                              : slot.available
                              ? 'neo-card-sm text-slate-800 hover:text-sky-700'
                              : 'neo-inset text-slate-400 opacity-40 cursor-not-allowed'
                          }`}
                        >
                          <span className="text-xs">{slot.time}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                            {slot.available ? `${slot.remainingCapacity} left` : 'Full'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Non-sensitive Notes */}
            <div className="pt-4 border-t border-slate-200/60">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Additional Notes (Optional)
              </label>
              <div className="neo-inset p-1">
                <textarea
                  rows={2}
                  maxLength={300}
                  placeholder="Mention any specific requirements (do NOT include sensitive personal numbers)"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-base sm:text-sm text-slate-900 focus:outline-none rounded-xl"
                />
              </div>
            </div>

            {/* Privacy Policy Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I consent to Baba Anandeshwar Internet Cafe storing my contact name and phone number for appointment coordination. I understand I must carry required physical documents in person and that approval of applications is governed by relevant official authorities.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full py-3.5 sm:py-3"
                isLoading={bookMutation.isPending}
                leftIcon={<CalendarCheck className="w-5 h-5" />}
              >
                Confirm Appointment Reservation
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
