import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '../common/Button.js';

export const LocationMap: React.FC = () => {
  const directionsUrl =
    'https://www.google.com/maps/place/Baba+Cyber+Cafe+%26+Photo+Copy/@26.3935664,80.3094068,15z/data=!4m15!1m8!3m7!1s0x399c467d62cfd26d:0xa04877de65f55c0d!2sHanspuram,+Naubasta,+Kanpur,+Uttar+Pradesh+208021!3b1!8m2!3d26.3901426!4d80.3199179!16s%2Fg%2F11_p_30tt!3m5!1s0x399c47fec3a8da09:0x7f82135d13837b37!8m2!3d26.3867308!4d80.3139335!16s%2Fg%2F11tkb2396s?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D';

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="neo-card overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Left Details */}
          <div className="p-7 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="neo-pill-inset px-3.5 py-1 text-xs font-bold tracking-widest uppercase text-sky-700">
                Find Us in Kanpur
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 mb-6 tracking-tight">
                Visit Baba Cyber Cafe & Photo Copy
              </h2>

              <div className="space-y-6 text-sm text-slate-600">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl neo-circle text-sky-700 flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Address</h4>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block mt-1 hover:opacity-90 transition-opacity"
                    >
                      <span className="text-sm font-bold text-slate-900 group-hover:text-brand-teal flex items-center gap-1.5 transition-colors">
                        Baba Cyber Cafe & Photo Copy
                        <ExternalLink className="w-3.5 h-3.5 text-brand-teal opacity-75 group-hover:opacity-100" />
                      </span>
                      <p className="mt-0.5 leading-relaxed text-xs sm:text-sm text-slate-600">
                        Hanspuram, Naubasta, Kanpur, Uttar Pradesh — 208021
                      </p>
                    </a>
                    <p className="text-xs text-slate-400 mt-0.5">Click address to open in Google Maps</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl neo-circle text-teal-700 flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Contact Numbers</h4>
                    <p className="mt-0.5 flex flex-wrap gap-3 text-xs sm:text-sm">
                      <a href="tel:6386463054" className="text-sky-700 font-bold hover:underline">
                        6386463054
                      </a>
                      <span className="text-slate-300">&bull;</span>
                      <a href="tel:9005536781" className="text-sky-700 font-bold hover:underline">
                        9005536781
                      </a>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Call during business hours for quick inquiries</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl neo-circle text-amber-700 flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900">Operating Hours</h4>
                    <div className="mt-0.5 text-xs space-y-0.5 text-slate-600">
                      <p><span className="font-semibold text-slate-800">Monday – Saturday:</span> 09:00 AM – 08:00 PM</p>
                      <p><span className="font-semibold text-slate-800">Sunday:</span> 10:00 AM – 03:00 PM</p>
                      <p className="text-amber-700 font-semibold">Daily Lunch Break: 01:30 PM – 02:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-wrap gap-3">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto" leftIcon={<Navigation className="w-4 h-4" />}>
                  Get Directions in Google Maps
                </Button>
              </a>
              <a href="tel:6386463054" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">Call Anurag Mishra</Button>
              </a>
            </div>
          </div>

          {/* Right Map Canvas / Visual Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-sky-400 mb-4 border border-white/10">
                <MapPin className="w-3.5 h-3.5" /> Naubasta &bull; Kanpur
              </div>
              <h3 className="text-2xl font-bold mb-2">Prime Location in South Kanpur</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                Easily accessible from Naubasta Chowk, Yashoda Nagar, and Kidwai Nagar. Dedicated customer seating, document scanning terminals, and high-speed laser printing stations.
              </p>
            </div>

            <div className="relative z-10 mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  Direct GPS Link
                </span>
                <ExternalLink className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-white">Baba Cyber Cafe &amp; Photo Copy</p>
              <p className="text-xs text-slate-300 mt-0.5">Hanspuram, Naubasta, Kanpur, UP</p>
              <p className="text-xs text-slate-300 mt-1">
                Open in your phone's GPS for turn-by-turn navigation.
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full text-center py-2.5 neo-btn-teal text-white text-xs font-bold rounded-xl"
              >
                Launch Google Maps Navigation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
