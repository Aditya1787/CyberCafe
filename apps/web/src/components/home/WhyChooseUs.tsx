import React from 'react';
import { FileEdit, Layers, CheckSquare, Calendar, Printer, MapPin } from 'lucide-react';

const BENEFITS = [
  {
    icon: <FileEdit className="w-6 h-6 text-sky-700" />,
    title: 'Assistance With Online Applications',
    desc: 'Step-by-step guidance in filling complex government portals, scholarship forms, and exam registration without errors.',
  },
  {
    icon: <Layers className="w-6 h-6 text-teal-700" />,
    title: 'Multiple Services in One Place',
    desc: 'From PAN & Aadhaar printout to train tickets, KESCo electricity bills, and banking agent cash withdrawals under one roof.',
  },
  {
    icon: <CheckSquare className="w-6 h-6 text-amber-700" />,
    title: 'Help With Document Preparation',
    desc: 'Clear document checklists, image/signature resizing to required pixel and KB specs, and format compliance.',
  },
  {
    icon: <Calendar className="w-6 h-6 text-indigo-700" />,
    title: 'Appointment-Based Visits',
    desc: 'Book your preferred visit time online to ensure dedicated staff assistance without waiting in long queues.',
  },
  {
    icon: <Printer className="w-6 h-6 text-emerald-700" />,
    title: 'Printing and Document Support',
    desc: 'High-speed laser photocopies, color printouts, hot thermal lamination, spiral binding, and urgent passport photos.',
  },
  {
    icon: <MapPin className="w-6 h-6 text-rose-700" />,
    title: 'Convenient Local Service in Kanpur',
    desc: 'Centrally located at Hanspuram, Naubasta, Kanpur, with friendly, transparent, and approachable neighborhood support.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="neo-pill-inset px-3.5 py-1 text-xs font-bold tracking-widest uppercase text-sky-700">
            The Anandeshwar Standard
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Why Local Residents Rely On Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Reliable assistance, verified processes, and genuine service for students, families, and professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              className="neo-card neo-card-hover p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                <div className="w-13 h-13 w-12 h-12 rounded-2xl neo-circle mb-5">
                  {b.icon}
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
