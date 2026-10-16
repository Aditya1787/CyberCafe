import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, CalendarCheck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Hero3D } from '../components/home/Hero3D.js';
import { QuickCategories } from '../components/home/QuickCategories.js';
import { PopularServices } from '../components/home/PopularServices.js';
import { WhyChooseUs } from '../components/home/WhyChooseUs.js';
import { HowItWorks } from '../components/home/HowItWorks.js';
import { PublicReviews } from '../components/home/PublicReviews.js';
import { LocationMap } from '../components/home/LocationMap.js';
import { AppointmentCTA } from '../components/home/AppointmentCTA.js';
import { Button } from '../components/common/Button.js';

export const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-white via-brand-bg/60 to-brand-bg dark:from-[#0f172a] dark:via-[#0c121e] dark:to-[#0b111e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* 3D Interactive Hero Canvas - Upper side on phone responsive (order-1), right column on desktop (lg:order-2) */}
            <div className="order-1 lg:order-2 lg:col-span-5 relative w-full">
              <Hero3D />
            </div>

            {/* Headlines & CTA - Lower side on phone responsive (order-2), left column on desktop (lg:order-1) */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal-dark border border-brand-teal/20 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-teal" />
                <span>Hanspuram, Naubasta, Kanpur &bull; Established Local Support</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-brand-navy-dark tracking-tight leading-[1.15]">
                Your Trusted Local Partner for{' '}
                <span className="text-gradient">Digital & Online Services</span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                From government application assistance and document services to travel bookings, printing, and everyday digital needs — get reliable assistance at Baba Anandeshwar Internet Cafe.
              </p>

              {/* Direct Search Bar - Neomorphic Inset */}
              <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center neo-inset p-1.5 focus-within:ring-2 focus-within:ring-sky-500/40">
                  <div className="pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-5 h-5 text-sky-600" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search PAN, Aadhaar, Scholarships, Police forms..."
                    className="w-full pl-3 pr-28 py-2.5 sm:py-3 bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 sm:py-2.5 neo-btn-primary rounded-xl text-xs sm:text-sm font-semibold tracking-wide"
                  >
                    Find Service
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">Popular:</span>
                  <Link to="/services?search=PAN" className="neo-pill-inset px-2.5 py-1 text-slate-700 hover:text-sky-700 font-medium">PAN Card</Link>
                  <Link to="/services?search=Aadhaar" className="neo-pill-inset px-2.5 py-1 text-slate-700 hover:text-sky-700 font-medium">e-Aadhaar</Link>
                  <Link to="/services?search=Train" className="neo-pill-inset px-2.5 py-1 text-slate-700 hover:text-sky-700 font-medium">Train Tickets</Link>
                  <Link to="/services?search=Ayushman" className="neo-pill-inset px-2.5 py-1 text-slate-700 hover:text-sky-700 font-medium">Ayushman Card</Link>
                </div>
              </form>

              {/* Primary & Secondary CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
                <Link to="/services" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore All Services
                  </Button>
                </Link>
                <Link to="/book-appointment" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" leftIcon={<CalendarCheck className="w-4 h-4" />}>
                    Book an Appointment
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 neo-pill px-3 py-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">50+ Citizen Services</span>
                </div>
                <div className="flex items-center gap-1.5 neo-pill px-3 py-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Document Checklist</span>
                </div>
                <div className="flex items-center gap-1.5 neo-pill px-3 py-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Guaranteed Slots</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Service Categories */}
      <QuickCategories />

      {/* Popular Services Section */}
      <PopularServices />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* How Appointment Works */}
      <HowItWorks />

      {/* Appointment CTA Banner */}
      <AppointmentCTA />

      {/* Customer Reviews (approved only) */}
      <PublicReviews />

      {/* Location Map & Details */}
      <LocationMap />
    </div>
  );
};
