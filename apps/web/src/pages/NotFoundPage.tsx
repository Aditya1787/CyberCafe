import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search, CalendarCheck } from 'lucide-react';
import { Button } from '../components/common/Button.js';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-brand-bg flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-elevated text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-bg text-brand-teal flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-6xl font-black text-brand-navy-dark tracking-tight">404</span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/services" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto" leftIcon={<Search className="w-4 h-4" />}>
              Browse Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
