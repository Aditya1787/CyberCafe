import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CalendarCheck, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { Button } from '../common/Button.js';
import { ThemeToggle } from '../common/ThemeToggle.js';
import { useAuth } from '../../context/AuthContext.js';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Services', path: '/services' },
    { label: 'Book Visit', path: '/book-appointment' },
    { label: 'Check Status', path: '/appointment-status' },
    { label: 'Feedback', path: '/feedback' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#e9eef6]/90 dark:bg-[#0b111e]/95 backdrop-blur-md shadow-[0_6px_20px_rgba(163,177,198,0.35)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.6)] py-2.5 border-b border-slate-200/60 dark:border-white/10'
          : 'bg-[#e9eef6] dark:bg-[#0b111e] py-3.5 border-b border-slate-200/50 dark:border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl neo-card flex items-center justify-center text-brand-navy font-bold text-lg shadow-sm group-hover:scale-105 transition-all">
              <span className="text-amber-500 font-extrabold">B</span>
              <span className="text-brand-teal">A</span>
            </div>
            <div>
              <span className="block font-bold text-slate-800 dark:text-white text-base sm:text-lg leading-tight tracking-tight">
                Baba Anandeshwar
              </span>
              <span className="block text-xs font-semibold text-brand-teal tracking-wider uppercase">
                Internet Cafe &bull; Kanpur
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'neo-pill-inset text-brand-teal font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white neo-card-hover'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick CTA Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle size="sm" />

            {isAdmin ? (
              <Link to="/admin">
                <Button variant="outline" size="sm" leftIcon={<ShieldCheck className="w-4 h-4 text-brand-teal" />}>
                  Admin Panel
                </Button>
              </Link>
            ) : (
              <Link to="/admin/login">
                <button className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-3 py-1.5 rounded-xl neo-card-hover transition-all">
                  Staff Login
                </button>
              </Link>
            )}

            <Link to="/book-appointment">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CalendarCheck className="w-4 h-4" />}
              >
                Book a Visit
              </Button>
            </Link>
          </div>

          {/* Mobile menu button & Theme toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle size="sm" />
            <Link to="/book-appointment">
              <Button variant="secondary" size="sm" className="px-3 py-1.5 text-xs font-bold">
                Book
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl neo-btn text-slate-700 dark:text-slate-200 hover:text-brand-teal transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mx-3 mt-2 rounded-2xl neo-card p-4 space-y-2 animate-fadeIn">
          <div className="py-2 mb-2 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <a
              href="https://www.google.com/maps/place/Baba+Cyber+Cafe+%26+Photo+Copy/@26.3935664,80.3094068,15z/data=!4m15!1m8!3m7!1s0x399c467d62cfd26d:0xa04877de65f55c0d!2sHanspuram,+Naubasta,+Kanpur,+Uttar+Pradesh+208021!3b1!8m2!3d26.3901426!4d80.3199179!16s%2Fg%2F11_p_30tt!3m5!1s0x399c47fec3a8da09:0x7f82135d13837b37!8m2!3d26.3867308!4d80.3139335!16s%2Fg%2F11tkb2396s?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-teal transition-colors font-semibold truncate max-w-[200px]"
            >
              Baba Cyber Cafe &amp; Photo Copy
            </a>
            <a href="tel:6386463054" className="flex items-center gap-1 text-brand-teal font-medium flex-shrink-0">
              <PhoneCall className="w-3.5 h-3.5" /> 6386463054
            </a>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl neo-pill-inset mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Theme Mode</span>
            <ThemeToggle size="sm" showLabel />
          </div>

          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'neo-pill-inset text-brand-teal'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white neo-card-hover'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-2.5">
            <Link to="/book-appointment" className="w-full">
              <Button variant="secondary" className="w-full py-3" leftIcon={<CalendarCheck className="w-4 h-4" />}>
                Book a Visit Now
              </Button>
            </Link>
            {isAdmin ? (
              <Link to="/admin" className="w-full">
                <Button variant="outline" className="w-full" leftIcon={<ShieldCheck className="w-4 h-4" />}>
                  Admin Panel
                </Button>
              </Link>
            ) : (
              <Link to="/admin/login" className="w-full text-center py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                Staff & Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
