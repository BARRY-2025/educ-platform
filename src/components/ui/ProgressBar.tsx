import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const colorClasses = {
  primary: 'from-primary-500 to-primary-600',
  accent: 'from-accent-500 to-accent-600',
  success: 'from-success-500 to-success-600',
  warning: 'from-warning-500 to-warning-600',
  error: 'from-error-500 to-error-600',
};

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-secondary-600">{label}</span>
          <span className="text-secondary-900 font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
