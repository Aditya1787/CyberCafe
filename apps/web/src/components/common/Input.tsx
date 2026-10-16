import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className={`relative neo-inset transition-all ${error ? 'ring-2 ring-rose-400' : ''}`}>
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full bg-transparent px-3.5 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 ${
            leftIcon ? 'pl-10' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
