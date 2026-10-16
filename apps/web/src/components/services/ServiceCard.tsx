import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CalendarCheck, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { Service } from '../../types/index.js';
import { Button } from '../common/Button.js';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="neo-card neo-card-hover rounded-3xl p-6 flex flex-col justify-between group">
      <div>
        {/* Category & Booking Status */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full neo-pill-inset text-slate-700 dark:text-sky-300">
            {service.category?.name || 'Digital Service'}
          </span>
          {service.booking_enabled ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full neo-pill">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Booking Open
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full neo-pill">
              Walk-in Only
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/services/${service.slug}`} className="block group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-snug line-clamp-1">
            {service.name}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
          {service.short_description}
        </p>

        {/* Meta badges: Duration & Documents */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/50 dark:border-white/10 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          {service.estimated_duration_minutes && (
            <div className="flex items-center gap-1.5 neo-pill-inset px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>~{service.estimated_duration_minutes} mins</span>
            </div>
          )}
          {service.required_documents && service.required_documents.length > 0 && (
            <div className="flex items-center gap-1.5 neo-pill-inset px-2.5 py-1 rounded-lg">
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{service.required_documents.length} docs</span>
            </div>
          )}
        </div>

        {/* Pricing info */}
        {service.price_amount !== undefined && service.price_amount !== null && (
          <div className="mt-3.5 flex items-baseline gap-2">
            <span className="text-base font-black text-slate-900 dark:text-white">
              ₹{service.price_amount}
            </span>
            {service.price_label && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ({service.price_label})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-200/50 flex items-center gap-2.5">
        <Link to={`/services/${service.slug}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs">
            Details
          </Button>
        </Link>
        {service.booking_enabled && (
          <Link to={`/book-appointment?service=${service.id}`} className="flex-1">
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              leftIcon={<CalendarCheck className="w-3.5 h-3.5" />}
            >
              Book Slot
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
