import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy-dark text-white border-t border-white/10 pt-16 pb-24 sm:pb-12 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-gold flex items-center justify-center text-white font-bold text-lg shadow">
                <span className="font-extrabold text-brand-navy-dark">B</span>
                <span>A</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white leading-tight">Baba Anandeshwar</h3>
                <span className="text-xs text-brand-teal tracking-wider uppercase font-semibold">
                  Internet Cafe &bull; Kanpur
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your trusted neighborhood center for online government forms, Aadhaar assistance, PAN cards, train & flight tickets, digital printing, and banking agent services.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> 50+ Verified Digital Services
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/services" className="hover:text-brand-teal transition-colors">
                  Complete Service Directory
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" className="hover:text-brand-teal transition-colors">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link to="/appointment-status" className="hover:text-brand-teal transition-colors">
                  Check Booking Status
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-brand-teal transition-colors">
                  Customer Feedback
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-teal transition-colors">
                  About the Cafe
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-teal transition-colors">
                  Location & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Service Categories</h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/services?category=pan-card-services" className="hover:text-brand-teal transition-colors">
                  PAN Card Services
                </Link>
              </li>
              <li>
                <Link to="/services?category=aadhaar-services" className="hover:text-brand-teal transition-colors">
                  Aadhaar Assistance
                </Link>
              </li>
              <li>
                <Link to="/services?category=voter-services" className="hover:text-brand-teal transition-colors">
                  Voter Card (EPIC)
                </Link>
              </li>
              <li>
                <Link to="/services?category=health-and-social-welfare" className="hover:text-brand-teal transition-colors">
                  Ayushman & E-Shram
                </Link>
              </li>
              <li>
                <Link to="/services?category=ration-and-certificates" className="hover:text-brand-teal transition-colors">
                  UP e-District & Certificates
                </Link>
              </li>
              <li>
                <Link to="/services?category=travel-and-hospitality" className="hover:text-brand-teal transition-colors">
                  Train & Flight Tickets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Operating Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Visit Us</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-teal flex-shrink-0 mt-1" />
                <a
                  href="https://www.google.com/maps/place/Baba+Cyber+Cafe+%26+Photo+Copy/@26.3935664,80.3094068,15z/data=!4m15!1m8!3m7!1s0x399c467d62cfd26d:0xa04877de65f55c0d!2sHanspuram,+Naubasta,+Kanpur,+Uttar+Pradesh+208021!3b1!8m2!3d26.3901426!4d80.3199179!16s%2Fg%2F11_p_30tt!3m5!1s0x399c47fec3a8da09:0x7f82135d13837b37!8m2!3d26.3867308!4d80.3139335!16s%2Fg%2F11tkb2396s?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:text-brand-teal transition-colors"
                >
                  <strong className="block text-white group-hover:text-brand-teal transition-colors font-bold">
                    Baba Cyber Cafe &amp; Photo Copy
                  </strong>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    Hanspuram, Naubasta, Kanpur, Uttar Pradesh — 208021
                  </span>
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:6386463054" className="hover:text-brand-teal transition-colors">6386463054</a>
                  <a href="tel:9005536781" className="hover:text-brand-teal transition-colors">9005536781</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <a href="mailto:anandeshwarcafe@gmail.com" className="hover:text-brand-teal transition-colors">
                  anandeshwarcafe@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p><span className="font-semibold text-white">Mon – Sat:</span> 09:00 AM – 08:00 PM</p>
                  <p><span className="font-semibold text-white">Sunday:</span> 10:00 AM – 03:00 PM</p>
                  <p className="text-gray-400">Lunch Break: 01:30 PM – 02:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Notice Banner */}
        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center md:text-left leading-relaxed max-w-2xl">
            <strong>Important Notice:</strong> Baba Anandeshwar Internet Cafe is an independent service center providing application facilitation, document preparation, and printing. We do not represent any government agency or guarantee approvals.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          &copy; {currentYear} Baba Anandeshwar Internet Cafe. All rights reserved. Built with pride for Kanpur residents.
        </div>
      </div>
    </footer>
  );
};
