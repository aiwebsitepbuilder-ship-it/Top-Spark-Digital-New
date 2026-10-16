import React from 'react';

interface TopSparkLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const TopSparkLogo: React.FC<TopSparkLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-base', gap: 'gap-2.5' },
    md: { icon: 'w-9 h-9', text: 'text-lg', gap: 'gap-3' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', gap: 'gap-3.5' },
  }[size];

  return (
    <div className={`inline-flex items-center ${sizeClasses.gap} select-none ${className}`}>
      {/* Exact circular emblem based on the supplied brand logo */}
      <div className={`relative ${sizeClasses.icon} shrink-0 rounded-full bg-[#6A22F2] flex items-center justify-center shadow-lg shadow-purple-900/30 overflow-hidden`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Three Growth Bar Columns */}
          <rect x="34" y="38" width="7" height="19" rx="1" fill="#FFFFFF" />
          <rect x="45" y="24" width="7" height="33" rx="1" fill="#FFFFFF" />
          <rect x="56" y="13" width="7" height="44" rx="1" fill="#FFFFFF" />

          {/* Upward Growth Lightning Arrow */}
          <path
            d="M21 66 L36 52 L48 63 L68 38"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrowhead Pointing Northeast */}
          <path
            d="M55 36 L72 34 L74 51"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {variant === 'full' && (
        <span
          className={`font-extrabold tracking-[0.16em] uppercase text-white ${sizeClasses.text} whitespace-nowrap`}
          style={{ letterSpacing: '0.16em' }}
        >
          TOP SPARK
        </span>
      )}
    </div>
  );
};
