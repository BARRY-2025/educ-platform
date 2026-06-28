import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
  accent: 'bg-accent-100 text-accent-700',
  gray: 'bg-gray-100 text-gray-700',
};

const dotColors: Record<BadgeVariant, string> = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  accent: 'bg-accent-500',
  gray: 'bg-gray-500',
};

export function Badge({ children, variant = 'primary', size = 'sm', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
