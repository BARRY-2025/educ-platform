import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  color?: 'primary' | 'accent' | 'warning' | 'error' | 'success';
  className?: string;
}

const colorClasses = {
  primary: {
    bg: 'from-primary-500 to-primary-600',
    text: 'text-primary-600',
    light: 'bg-primary-50',
  },
  accent: {
    bg: 'from-accent-500 to-accent-600',
    text: 'text-accent-600',
    light: 'bg-accent-50',
  },
  warning: {
    bg: 'from-warning-500 to-warning-600',
    text: 'text-warning-600',
    light: 'bg-warning-50',
  },
  error: {
    bg: 'from-error-500 to-error-600',
    text: 'text-error-600',
    light: 'bg-error-50',
  },
  success: {
    bg: 'from-success-500 to-success-600',
    text: 'text-success-600',
    light: 'bg-success-50',
  },
};

export function StatCard({ title, value, subtitle, icon, trend, color = 'primary', className = '' }: StatCardProps) {
  const colors = colorClasses[color];

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend.value < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value > 0) return 'text-success-600';
    if (trend.value < 0) return 'text-error-600';
    return 'text-secondary-500';
  };

  return (
    <div className={`bg-white rounded-xl shadow-card border border-gray-100 p-6 relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full transform translate-x-8 -translate-y-8">
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${colors.bg}`} />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-500">{title}</p>
            <p className="mt-2 text-3xl font-bold font-heading text-secondary-900">{value}</p>
            {subtitle && <p className="mt-1 text-sm text-secondary-400">{subtitle}</p>}
          </div>
          {icon && (
            <div className={`p-3 rounded-xl ${colors.light}`}>
              <div className={colors.text}>{icon}</div>
            </div>
          )}
        </div>

        {trend && (
          <div className={`mt-4 flex items-center gap-1.5 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{Math.abs(trend.value)}%</span>
            {trend.label && <span className="text-sm text-secondary-500">{trend.label}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
