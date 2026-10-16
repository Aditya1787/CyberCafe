import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '../common/Button.js';

export const AppointmentCTA: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-navy-dark via-brand-navy to-brand-teal text-white relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-teal/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-brand-gold mb-4 border border-white/10">
              <Clock className="w-3.5 h-3.5" /> Avoid Waiting In Line
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Complete Your Online Application?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-200 leading-relaxed">
              Book a guaranteed visit slot today. Bring your documents, get dedicated staff guidance, and complete your PAN, Aadhaar, scholarship, or ticket booking in minutes.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Reference Code
              </span>
              <span>&bull;</span>
              <span>Free Consultation Check</span>
              <span>&bull;</span>
              <span>Zero Waiting With Prior Booking</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <Link to="/book-appointment">
              <Button
                variant="gold"
                size="lg"
                leftIcon={<CalendarCheck className="w-5 h-5" />}
                className="shadow-xl"
              >
                Book Appointment Now
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
