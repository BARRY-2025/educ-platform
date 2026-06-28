import React from 'react';
import { User } from 'lucide-react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const iconSizes: Record<AvatarSize, number> = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 28,
};

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-semibold
        bg-gradient-to-br from-primary-500 to-accent-500 text-white
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {initials ? initials : <User size={iconSizes[size]} />}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: { src?: string; name?: string }[];
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ avatars, max = 3, size = 'sm' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, i) => (
        <Avatar key={i} {...avatar} size={size} className="ring-2 ring-white" />
      ))}
      {remaining > 0 && (
        <div
          className={`
            rounded-full flex items-center justify-center font-medium
            bg-secondary-200 text-secondary-600 ring-2 ring-white
            ${sizeClasses[size]}
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
