import React from 'react';

interface BadgeProps {
  variant?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'default' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const styles = {
    pending: 'text-amber-800 bg-amber-50/80 border-amber-200/60',
    confirmed: 'text-sky-800 bg-sky-50/80 border-sky-200/60',
    completed: 'text-emerald-800 bg-emerald-50/80 border-emerald-200/60',
    cancelled: 'text-rose-800 bg-rose-50/80 border-rose-200/60',
    no_show: 'text-slate-700 bg-slate-100 border-slate-200',
    default: 'text-slate-800 bg-slate-100 border-slate-200',
    success: 'text-emerald-800 bg-emerald-50/80 border-emerald-200/60',
    warning: 'text-amber-800 bg-amber-50/80 border-amber-200/60',
    info: 'text-sky-800 bg-sky-50/80 border-sky-200/60',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold neo-pill ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
