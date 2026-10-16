import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'neo-btn-primary font-semibold',
    secondary: 'neo-btn-teal font-semibold',
    outline: 'neo-btn text-slate-700 hover:text-brand-navy',
    ghost: 'text-slate-600 hover:text-brand-navy hover:bg-slate-200/50',
    danger: 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-[4px_4px_12px_#cad5e3,-3px_-3px_8px_#ffffff]',
    gold: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-[4px_4px_12px_#cad5e3,-3px_-3px_8px_#ffffff]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
