import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, CalendarCheck, Search, PhoneCall } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Services', path: '/services', icon: Layers },
    {
      label: 'Book Now',
      path: '/book-appointment',
      icon: CalendarCheck,
      isCenter: true,
    },
    { label: 'Status', path: '/appointment-status', icon: Search },
    { label: 'Call Us', href: 'tel:6386463054', icon: PhoneCall },
  ];

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 neo-bottom-nav px-2 py-1.5 safe-area-pb"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          if (item.isCenter) {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path!}
                className="flex flex-col items-center -mt-5 group"
              >
                <div
                  className={`w-12 h-12 rounded-full neo-btn-teal flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                    isActive ? 'ring-2 ring-sky-300 ring-offset-2 ring-offset-[#e9eef6] dark:ring-offset-[#0b111e]' : ''
                  }`}
                >
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center py-1 px-2 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 active:scale-95 transition-all"
              >
                <div className="w-8 h-8 neo-circle text-slate-600 dark:text-slate-300">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium mt-1">
                  {item.label}
                </span>
              </a>
            );
          }

          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path!}
              className={`flex flex-col items-center justify-center py-1 px-2 transition-all active:scale-95 ${
                isActive ? 'text-sky-600 dark:text-sky-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive ? 'neo-pill-inset text-sky-600 dark:text-sky-400 font-bold' : 'neo-circle'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
