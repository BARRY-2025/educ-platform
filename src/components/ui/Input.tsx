import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconPosition = 'left', className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-white border rounded-lg text-secondary-800
              placeholder:text-secondary-400 transition-all duration-200
              focus:ring-2 focus:ring-primary-500/20 hover:border-gray-300
              ${icon && iconPosition === 'left' ? 'pl-10 pr-4' : 'px-4'}
              ${icon && iconPosition === 'right' ? 'pr-10 pl-4' : ''}
              py-2.5
              ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : 'border-gray-200 focus:border-primary-500'}
              ${className}
            `}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1.5 mt-1.5 text-error-600 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
