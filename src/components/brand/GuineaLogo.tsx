import React from 'react';

interface GuineaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizes = {
  sm: { box: 'w-9 h-9', icon: 'w-5 h-5', text: 'text-sm' },
  md: { box: 'w-11 h-11', icon: 'w-6 h-6', text: 'text-base' },
  lg: { box: 'w-16 h-16', icon: 'w-9 h-9', text: 'text-xl' },
};

export function GuineaLogo({ size = 'md', showLabel = false, className = '' }: GuineaLogoProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${s.box} rounded-xl overflow-hidden shadow-lg flex shrink-0 ring-2 ring-white/20`}>
        <div className="flex-1 bg-guinea-red" />
        <div className="flex-1 bg-guinea-yellow" />
        <div className="flex-1 bg-guinea-green" />
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className={`font-bold text-white leading-tight ${s.text}`}>EduGuinée</span>
          <span className="text-xs text-white/70">République de Guinée</span>
        </div>
      )}
    </div>
  );
}
