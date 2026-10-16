import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronRight,
  Clock,
  FileCheck2,
  CalendarCheck,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  PhoneCall,
} from 'lucide-react';
import { apiRequest } from '../api/client.js';
import { Service } from '../types/index.js';
import { Badge } from '../components/common/Badge.js';
import { Button } from '../components/common/Button.js';
import { EmptyState } from '../components/common/EmptyState.js';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery<{ data: Service }>({
    queryKey: ['service-detail', slug],
    queryFn: () => apiRequest(`/services/${slug}`),
    enabled: Boolean(slug),
  });

  const service = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-brand-bg py-20">
        <div className="max-w-md mx-auto px-4">
          <EmptyState
            icon={<HelpCircle className="w-10 h-10 text-brand-navy" />}
            title="Service Not Found"
            description={`We could not find the requested service '${slug}'. It may have been renamed or updated.`}
            actionLabel="Back to Services Directory"
            onAction={() => window.location.assign('/services')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-[#0b111e] py-10 sm:py-16 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-brand-navy">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/services" className="hover:text-brand-navy">Services</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {service.category && (
            <>
              <Link to={`/services?category=${service.category.slug}`} className="hover:text-brand-navy">
                {service.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-gray-900 font-medium truncate">{service.name}</span>
        </nav>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm space-y-8">
          {/* Header Title Section */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">{service.category?.name || 'General Service'}</Badge>
              {service.service_type && (
                <span className="text-[11px] font-semibold text-brand-navy bg-brand-bg px-2.5 py-0.5 rounded-full border border-gray-200 uppercase">
                  {service.service_type.replace('_', ' ')}
                </span>
              )}
              {service.booking_enabled ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Appointment Booking Available
                </span>
              ) : (
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  Walk-in Service Only
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy-dark tracking-tight">
              {service.name}
            </h1>

            <p className="text-base text-gray-600 leading-relaxed max-w-3xl">
              {service.short_description}
            </p>
          </div>

          {/* Key Facts Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-brand-bg/60 border border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block font-medium">Assistance Fee</span>
              <p className="text-lg font-bold text-brand-navy-dark mt-0.5">
                {service.price_amount !== null && service.price_amount !== undefined
                  ? `₹${service.price_amount}`
                  : 'Contact for quote'}
              </p>
              {service.price_label && (
                <span className="text-[11px] text-gray-500 block leading-tight">
                  {service.price_label}
                </span>
              )}
            </div>

            <div>
              <span className="text-xs text-gray-400 block font-medium">Est. Visit Duration</span>
              <p className="text-lg font-bold text-brand-navy-dark mt-0.5 flex items-center gap-1">
                <Clock className="w-4 h-4 text-brand-teal" />
                <span>{service.estimated_duration_minutes ? `~${service.estimated_duration_minutes} min` : 'Varies'}</span>
              </p>
              <span className="text-[11px] text-gray-500 block leading-tight">Average desk time</span>
            </div>

            <div>
              <span className="text-xs text-gray-400 block font-medium">Source / Channel</span>
              <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                {service.provider_name || 'In-House Service'}
              </p>
              {service.official_url && (
                <a
                  href={service.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-brand-teal hover:underline inline-flex items-center gap-0.5 mt-0.5"
                >
                  Official Portal <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div>
              <span className="text-xs text-gray-400 block font-medium">Location</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">Hanspuram, Kanpur</p>
              <span className="text-[11px] text-emerald-600 font-medium">Open Mon – Sun</span>
            </div>
          </div>

          {/* Full Description & Instructions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">About This Service</h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>

            {service.instructions && (
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 space-y-1">
                <h4 className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  Customer Preparation Instructions:
                </h4>
                <p className="leading-relaxed">{service.instructions}</p>
              </div>
            )}
          </div>

          {/* Required Documents Checklist Card */}
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-navy-dark flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-brand-teal" />
                Required Documents Checklist
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                {service.required_documents?.length || 0} items needed
              </span>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Please carry original copies of these documents when you visit our cafe. Do not upload identity credentials or sensitive numbers to our website.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {service.required_documents && service.required_documents.length > 0 ? (
                service.required_documents.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-800"
                  >
                    <CheckCircle className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{doc}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-gray-500 col-span-2">No special documents specified. Bring valid photo ID.</li>
              )}
            </ul>
          </div>

          {/* Government & Legal Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 mb-0.5">Statutory Disclaimer & Disclosure</h4>
              <p>
                {service.disclaimer ||
                  'Baba Anandeshwar Internet Cafe provides application assistance and related services. Government applications, eligibility, fees, approval, and processing times are determined exclusively by the relevant government authority. Please verify the latest requirements through the official source.'}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-brand-teal" />
              <span>Questions? Call us at 6386463054 or 9005536781</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link to="/services" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  Browse Other Services
                </Button>
              </Link>
              {service.booking_enabled ? (
                <Link to={`/book-appointment?service=${service.id}`} className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto shadow-md"
                    leftIcon={<CalendarCheck className="w-4 h-4" />}
                  >
                    Book Appointment For This Service
                  </Button>
                </Link>
              ) : (
                <a
                  href="https://www.google.com/maps/place/Baba+Cyber+Cafe+%26+Photo+Copy/@26.3935664,80.3094068,15z/data=!4m15!1m8!3m7!1s0x399c467d62cfd26d:0xa04877de65f55c0d!2sHanspuram,+Naubasta,+Kanpur,+Uttar+Pradesh+208021!3b1!8m2!3d26.3901426!4d80.3199179!16s%2Fg%2F11_p_30tt!3m5!1s0x399c47fec3a8da09:0x7f82135d13837b37!8m2!3d26.3867308!4d80.3139335!16s%2Fg%2F11tkb2396s?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="primary" className="w-full sm:w-auto">
                    Visit Our Cafe (Walk-in)
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
