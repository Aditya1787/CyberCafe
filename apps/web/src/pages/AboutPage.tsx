import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Award, Users, CheckCircle, CalendarCheck, PhoneCall } from 'lucide-react';
import { Button } from '../components/common/Button.js';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-teal dark:text-sky-400">
            About Our Business
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-navy-dark dark:text-white tracking-tight">
            Serving Kanpur with Verified Digital & Application Assistance
          </h1>
          <p className="text-base text-gray-600 dark:text-slate-300 leading-relaxed">
            Baba Anandeshwar Internet Cafe was established with a clear mission: to provide Kanpur citizens, students, and local families with prompt, reliable, and transparent digital services under one roof.
          </p>
        </div>

        {/* Location & Heritage Card */}
        <div className="neo-card p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neo-pill-inset text-brand-teal dark:text-sky-400 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Naubasta &bull; Hanspuram &bull; Kanpur
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              At the Heart of South Kanpur
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Located in Hanspuram, Naubasta, we understand the everyday technological hurdles faced by residents when dealing with government portals, scholarship applications, voter identity issues, and urgent printing requirements.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our operator, <strong className="text-slate-900 dark:text-white">Anurag Mishra</strong>, has cultivated a reputation for patience, accuracy, and rigorous adherence to document guidelines, ensuring citizens do not face repeated form rejections.
            </p>
          </div>

          <div className="bg-gradient-to-br from-brand-navy-dark to-brand-navy text-white p-8 rounded-3xl space-y-6 shadow-xl border border-white/10">
            <h3 className="text-lg font-bold text-amber-400">Our Guiding Commitments</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>No Fake Guarantees:</strong> We clearly communicate government rules without making false approval promises.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Privacy First:</strong> We never collect Aadhaar/PAN copies or OTPs on this website.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Transparent Assistance:</strong> Fixed, affordable assistance rates displayed upfront.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Modern Equipment:</strong> Heavy-duty laser copiers, PVC printers, and fast connectivity.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* What Sets Us Apart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neo-card neo-card-hover p-6 sm:p-7 space-y-2">
            <div className="w-12 h-12 rounded-2xl neo-circle text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Student-Centric Support</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Assisting thousands of students across Kanpur with UP Scholarship forms, SSC exams, UPSC uploads, and college projects.
            </p>
          </div>

          <div className="neo-card neo-card-hover p-6 sm:p-7 space-y-2">
            <div className="w-12 h-12 rounded-2xl neo-circle text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">50 Dedicated Services</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              From AEPS banking withdrawal and KESCo bills to train reservations and PVC cards, everything is organized and structured.
            </p>
          </div>

          <div className="neo-card neo-card-hover p-6 sm:p-7 space-y-2">
            <div className="w-12 h-12 rounded-2xl neo-circle text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Ethical Conduct</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Operated strictly within official portals and statutory guidelines. Official receipts provided for every transaction.
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="p-8 rounded-3xl bg-brand-navy text-white text-center space-y-4">
          <h2 className="text-2xl font-bold">Have Questions or Need Application Guidance?</h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Book an appointment online to skip waiting times or call our helpline numbers for advice on required documents.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/book-appointment">
              <Button variant="gold" leftIcon={<CalendarCheck className="w-4 h-4" />}>
                Book a Visit Slot
              </Button>
            </Link>
            <a href="tel:6386463054">
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10" leftIcon={<PhoneCall className="w-4 h-4" />}>
                Call 6386463054
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
