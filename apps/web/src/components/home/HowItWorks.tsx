import React from 'react';
import { Search, CalendarCheck, CheckCircle2, Store } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: <Search className="w-6 h-6 text-sky-700" />,
    title: 'Browse Available Services',
    desc: 'Explore our directory of 50 services, check required documents checklists, fees, and instructions.',
  },
  {
    step: '02',
    icon: <CalendarCheck className="w-6 h-6 text-teal-700" />,
    title: 'Select Preferred Slot',
    desc: 'Choose your desired date and real-time available time slot based on our operating hours.',
  },
  {
    step: '03',
    icon: <CheckCircle2 className="w-6 h-6 text-amber-700" />,
    title: 'Receive Booking Code',
    desc: 'Get an instant unique reference code (BAC-XXXXXX) to track or confirm your booking.',
  },
  {
    step: '04',
    icon: <Store className="w-6 h-6 text-emerald-700" />,
    title: 'Visit With Documents',
    desc: 'Walk into our cafe at Hanspuram, Naubasta, at your booked time. Our staff will assist you promptly.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="neo-pill-inset px-3.5 py-1 text-xs font-bold tracking-widest uppercase text-sky-700">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            How Appointment Booking Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Save time and plan your visit seamlessly without waiting in queues.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className="neo-card neo-card-hover p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl neo-circle">
                    {s.icon}
                  </div>
                  <span className="neo-pill-inset px-2.5 py-0.5 text-xs font-black text-slate-400">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
