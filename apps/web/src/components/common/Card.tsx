import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'glass' | 'interactive' | 'neo' | 'neo-sm' | 'neo-inset';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'neo',
  children,
  className = '',
  ...props
}) => {
  const styles: Record<string, string> = {
    neo: 'neo-card p-6',
    'neo-sm': 'neo-card-sm p-4',
    'neo-inset': 'neo-inset p-5',
    white: 'neo-card p-6',
    glass: 'neo-card p-6',
    interactive: 'neo-card neo-card-hover p-6',
  };

  return (
    <div className={`${styles[variant] || styles.neo} ${className}`} {...props}>
      {children}
    </div>
  );
};
