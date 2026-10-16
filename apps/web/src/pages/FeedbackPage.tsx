import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Star, MessageSquareQuote, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../api/client.js';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { useToast } from '../context/ToastContext.js';

export const FeedbackPage: React.FC = () => {
  const toast = useToast();
  const [displayName, setDisplayName] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<'service_quality' | 'staff_assistance' | 'waiting_time' | 'website_experience' | 'other'>('service_quality');
  const [message, setMessage] = useState('');
  const [publicConsent, setPublicConsent] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiRequest('/feedback', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success('Feedback submitted!', 'Thank you for your valuable review.');
    },
    onError: (err: Error) => {
      toast.error('Submission failed', err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!privacyConsent) {
      toast.error('Privacy consent required', 'Please accept the privacy policy');
      return;
    }

    if (!message.trim()) {
      toast.error('Review message required', 'Please share details of your experience');
      return;
    }

    feedbackMutation.mutate({
      display_name: displayName,
      booking_reference: bookingRef || undefined,
      rating,
      category,
      message,
      public_display_consent: publicConsent,
      privacy_consent: true,
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#e9eef6] py-16">
        <div className="max-w-lg mx-auto px-4">
          <div className="neo-card p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl neo-pill-inset text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-black text-slate-800">
              Thank You for Your Review!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your feedback helps our team at Baba Anandeshwar Internet Cafe maintain high service standards in Kanpur.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/">
                <Button variant="secondary" className="w-full">
                  Return to Home Page
                </Button>
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                  setDisplayName('');
                  setBookingRef('');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 transition-colors"
              >
                Submit another response
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e9eef6] py-8 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-navy font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-bold">Customer Feedback</span>
        </nav>

        {/* Card */}
        <div className="neo-card p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-xs font-extrabold tracking-widest uppercase text-brand-teal">
              We Value Your Voice
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
              Share Your Cafe Experience
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Tell us how we did during your visit to Baba Anandeshwar Internet Cafe in Naubasta, Kanpur.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Overall Rating <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        filled ? 'neo-pill-inset' : 'neo-btn'
                      }`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          filled
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-400 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-xs sm:text-sm font-bold text-slate-700">
                  {rating === 5 && 'Outstanding (5/5)'}
                  {rating === 4 && 'Very Good (4/5)'}
                  {rating === 3 && 'Average (3/5)'}
                  {rating === 2 && 'Needs Improvement (2/5)'}
                  {rating === 1 && 'Poor Experience (1/5)'}
                </span>
              </div>
            </div>

            {/* Customer Display Name & Booking Ref */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Name / Display Name"
                required
                placeholder="e.g. Anuradha S."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Input
                label="Booking Reference (Optional)"
                placeholder="e.g. BAC-2025..."
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                helperText="Helps verify visit experience"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Feedback Focus Area <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as typeof category)}
                className="w-full neo-inset px-4 py-3 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              >
                <option value="service_quality">Service Quality & Speed</option>
                <option value="staff_assistance">Staff Assistance & Politeness</option>
                <option value="waiting_time">Waiting Time & Desk Process</option>
                <option value="website_experience">Online Appointment Booking Experience</option>
                <option value="other">Other Suggestions</option>
              </select>
            </div>

            {/* Review Message */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Review Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                maxLength={1000}
                placeholder="Describe your visit, which service you availed, and how our staff assisted you..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full neo-inset px-4 py-3 text-base sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 resize-y"
              />
              <p className="text-[11px] text-slate-400 mt-1 text-right">{message.length}/1000 characters</p>
            </div>

            {/* Public Consent Checkbox */}
            <div className="space-y-3 pt-3 border-t border-slate-200/60">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={publicConsent}
                  onChange={(e) => setPublicConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-brand-teal focus:ring-brand-teal"
                />
                <span className="text-xs text-slate-600 leading-relaxed font-medium">
                  I grant permission to publish this review on the Baba Anandeshwar Internet Cafe website. (Personal contact details are never shown).
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-brand-teal focus:ring-brand-teal"
                />
                <span className="text-xs text-slate-600 leading-relaxed font-medium">
                  I agree that this feedback represents my genuine opinion and complies with the site's privacy terms. <span className="text-rose-500">*</span>
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                isLoading={feedbackMutation.isPending}
              >
                Submit Customer Review
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
