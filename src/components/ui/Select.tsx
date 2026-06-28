import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-2.5 bg-white border rounded-lg text-secondary-800
              transition-all duration-200 cursor-pointer appearance-none
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 hover:border-gray-300
              ${error ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' : 'border-gray-200 focus:border-primary-500'}
              pr-10
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-error-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
