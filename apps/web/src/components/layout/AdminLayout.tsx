import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck2,
  Layers,
  MessageSquareQuote,
  Clock,
  Sliders,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { Button } from '../common/Button.js';

export const AdminLayout: React.FC = () => {
  const { user, profile, isAdmin, isLoading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  // Not logged in or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-elevated p-8 text-center border border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            You must be logged in as an authorized administrator to access the Baba Anandeshwar management portal.
          </p>
          <div className="flex flex-col gap-2.5">
            <Button variant="primary" onClick={() => navigate('/admin/login')}>
              Log in to Admin Panel
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Return to Website
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { label: 'Appointments', path: '/admin/appointments', icon: <CalendarCheck2 className="w-5 h-5" /> },
    { label: 'Services Catalogue', path: '/admin/services', icon: <Layers className="w-5 h-5" /> },
    { label: 'Customer Feedback', path: '/admin/feedback', icon: <MessageSquareQuote className="w-5 h-5" /> },
    { label: 'Hours & Slots', path: '/admin/availability', icon: <Clock className="w-5 h-5" /> },
    { label: 'Business Settings', path: '/admin/settings', icon: <Sliders className="w-5 h-5" /> },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#e9eef6] flex flex-col lg:flex-row text-slate-800">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-brand-navy-dark text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-teal flex items-center justify-center font-bold text-sm shadow">
            BA
          </div>
          <div>
            <span className="font-bold text-sm block leading-tight">Admin Portal</span>
            <span className="text-[10px] text-brand-teal font-semibold uppercase tracking-wider block">Staff Dashboard</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-navy-dark text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col justify-between shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5">
          {/* Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-teal to-brand-gold flex items-center justify-center font-bold text-white shadow-md">
              <span className="text-brand-navy-dark font-extrabold">B</span>
              <span>A</span>
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight text-white">Baba Anandeshwar</h1>
              <span className="text-xs text-brand-teal font-semibold uppercase tracking-wider">
                Management Portal
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-teal text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold text-xs">
              {profile?.display_name?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.display_name || 'Administrator'}</p>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-semibold uppercase">
                {profile?.role || 'Admin'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between text-xs text-slate-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors font-medium"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full text-xs text-rose-300 hover:text-rose-200 px-2 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
