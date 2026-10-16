import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, CalendarCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.js';

export const ContactPage: React.FC = () => {
  const directionsUrl =
    'https://www.google.com/maps/place/Baba+Cyber+Cafe+%26+Photo+Copy/@26.3935664,80.3094068,15z/data=!4m15!1m8!3m7!1s0x399c467d62cfd26d:0xa04877de65f55c0d!2sHanspuram,+Naubasta,+Kanpur,+Uttar+Pradesh+208021!3b1!8m2!3d26.3901426!4d80.3199179!16s%2Fg%2F11_p_30tt!3m5!1s0x399c47fec3a8da09:0x7f82135d13837b37!8m2!3d26.3867308!4d80.3139335!16s%2Fg%2F11tkb2396s?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D';

  return (
    <div className="min-h-screen bg-[#e9eef6] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="neo-pill-inset px-3.5 py-1 text-xs font-bold tracking-widest uppercase text-brand-teal">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight">
            Contact & Location Details
          </h1>
          <p className="text-sm text-slate-600">
            Visit our center in Hanspuram, Naubasta, Kanpur or call our team for application assistance.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neo-card p-7 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl neo-circle text-brand-navy flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Physical Address</h3>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block mt-1 hover:opacity-90 transition-opacity"
              >
                <p className="text-sm font-bold text-slate-900 group-hover:text-brand-teal flex items-center gap-1.5 transition-colors">
                  Baba Cyber Cafe &amp; Photo Copy
                  <Navigation className="w-3.5 h-3.5 text-brand-teal" />
                </p>
                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                  Hanspuram, Naubasta,<br />
                  Kanpur, Uttar Pradesh — 208021
                </p>
              </a>
              <p className="text-xs text-brand-teal mt-2 font-medium">Click address to open in Google Maps</p>
            </div>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" size="sm" className="w-full mt-2" leftIcon={<Navigation className="w-3.5 h-3.5" />}>
                Directions in Maps
              </Button>
            </a>
          </div>

          <div className="neo-card p-7 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl neo-circle text-brand-teal flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Direct Phone Lines</h3>
              <div className="text-sm text-slate-600 mt-1 space-y-1">
                <p>
                  Primary: <a href="tel:6386463054" className="text-brand-navy font-bold hover:underline">6386463054</a>
                </p>
                <p>
                  Secondary: <a href="tel:9005536781" className="text-brand-navy font-bold hover:underline">9005536781</a>
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-2">Contact Person: Anurag Mishra</p>
            </div>
            <a href="tel:6386463054" className="block">
              <Button variant="secondary" size="sm" className="w-full mt-2">
                Call Now
              </Button>
            </a>
          </div>

          <div className="neo-card p-7 sm:p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl neo-circle text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">Operating Hours</h3>
              <div className="text-xs text-slate-600 mt-1 space-y-1">
                <p><span className="font-bold text-slate-900">Mon – Sat:</span> 09:00 AM – 08:00 PM</p>
                <p><span className="font-bold text-slate-900">Sunday:</span> 10:00 AM – 03:00 PM</p>
                <p className="text-amber-700 font-semibold pt-1">Lunch Break: 01:30 PM – 02:30 PM</p>
              </div>
            </div>
            <Link to="/book-appointment" className="block">
              <Button variant="primary" size="sm" className="w-full mt-2" leftIcon={<CalendarCheck className="w-3.5 h-3.5" />}>
                Book a Visit Slot
              </Button>
            </Link>
          </div>
        </div>

        {/* Detailed Map & Inquiry Section */}
        <div className="neo-card overflow-hidden p-7 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-800">
                How to Reach Us
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Baba Cyber Cafe &amp; Photo Copy</strong> is situated in Hanspuram, Naubasta, accessible via the main Naubasta Hamirpur Road and adjacent bypass connectors. Ample two-wheeler parking is available in front of the premises.
              </p>
              <div className="p-4 rounded-2xl neo-inset text-xs text-slate-700 space-y-2">
                <p className="font-bold text-brand-navy">Nearby Accessibility:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>5 minutes from Naubasta Chowk</li>
                  <li>Convenient commute from Yashoda Nagar, Kidwai Nagar &amp; Barra</li>
                  <li>Direct auto-rickshaws available from Kanpur Central Station</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white">Direct Email &amp; Navigation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                For corporate bulk printing, school/college project typesetting, or general assistance questions, feel free to email us directly or launch maps navigation.
              </p>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-brand-teal" />
                <a href="mailto:anandeshwarcafe@gmail.com" className="hover:text-brand-teal font-semibold">
                  anandeshwarcafe@gmail.com
                </a>
              </div>
              <div className="pt-2">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="secondary" size="md" className="w-full" leftIcon={<Navigation className="w-4 h-4" />}>
                    Open in Google Maps Navigation
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
