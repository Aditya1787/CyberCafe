import React from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Fingerprint,
  Vote,
  HeartPulse,
  FileBadge,
  PlaneTakeoff,
  Landmark,
  GraduationCap,
  Printer,
  ArrowRight,
} from 'lucide-react';

const CATEGORIES = [
  { slug: 'pan-card-services', name: 'PAN Card Services', desc: 'New apply, reprint, correction & Aadhaar link', icon: <CreditCard className="w-6 h-6 text-sky-700" />, accent: 'text-sky-700' },
  { slug: 'aadhaar-services', name: 'Aadhaar Assistance', desc: 'e-Aadhaar print, address updates & PVC cards', icon: <Fingerprint className="w-6 h-6 text-teal-700" />, accent: 'text-teal-700' },
  { slug: 'voter-services', name: 'Voter Services', desc: 'New voter card, correction, mobile link & e-EPIC', icon: <Vote className="w-6 h-6 text-indigo-700" />, accent: 'text-indigo-700' },
  { slug: 'health-and-social-welfare', name: 'Health & Welfare', desc: 'Ayushman Bharat card, E-Shram & PM-Kisan', icon: <HeartPulse className="w-6 h-6 text-rose-700" />, accent: 'text-rose-700' },
  { slug: 'ration-and-certificates', name: 'Ration & Certificates', desc: 'Income, Caste, Niwas, Birth & Land receipts', icon: <FileBadge className="w-6 h-6 text-amber-700" />, accent: 'text-amber-700' },
  { slug: 'travel-and-hospitality', name: 'Travel Bookings', desc: 'Train reservations, Flights, Bus & Hotels', icon: <PlaneTakeoff className="w-6 h-6 text-sky-600" />, accent: 'text-sky-600' },
  { slug: 'bills-banking-financial', name: 'Banking & Bills', desc: 'KESCo electricity bills, AEPS withdrawal, PF claims', icon: <Landmark className="w-6 h-6 text-emerald-700" />, accent: 'text-emerald-700' },
  { slug: 'education-jobs-documents', name: 'Jobs & Scholarships', desc: 'SSC, UPSSSC, Scholarships, Resume & Passport', icon: <GraduationCap className="w-6 h-6 text-purple-700" />, accent: 'text-purple-700' },
  { slug: 'printing-and-other-services', name: 'Printing & Xerox', desc: 'Photo print, Color Xerox, Lamination & Binding', icon: <Printer className="w-6 h-6 text-slate-700" />, accent: 'text-slate-700' },
];

export const QuickCategories: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#e9eef6] dark:bg-[#0b111e] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="neo-pill-inset px-3.5 py-1 text-xs uppercase font-bold tracking-widest text-sky-700 dark:text-sky-400">
            Explore By Department
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            All Service Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
            Select a department to view required documents, pricing, guidelines, and book your visit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/services?category=${cat.slug}`}
              className="group neo-card neo-card-hover p-5 sm:p-6 flex items-start gap-4 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl neo-circle flex-shrink-0 group-hover:scale-105 transition-transform">
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors text-base truncate">
                    {cat.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
