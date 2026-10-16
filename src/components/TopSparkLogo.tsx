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
      <div className={`relative ${sizeClasses.icon} shrink-0 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/30 overflow-visible`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Brand Circular Violet Background */}
          <circle cx="50" cy="50" r="46" fill="#6A22F2" />

          {/* Three Growth Bar Columns with Slanted Tops and Dynamic Bottom Cuts */}
          {/* Bar 1 (Leftmost) */}
          <path d="M34 46 L41 38 L41 64 L34 54 Z" fill="#FFFFFF" />

          {/* Bar 2 (Middle) */}
          <path d="M44 32 L51 24 L51 61 L44 69 Z" fill="#FFFFFF" />

          {/* Bar 3 (Rightmost / Tallest) */}
          <path d="M54 18 L61 10 L61 49 L54 57 Z" fill="#FFFFFF" />

          {/* Dynamic Lightning / Upward Growth Arrow */}
          <path
            d="M17 76 L32 55 L44 74 L62 54 L57 49 L81 43 L73 65 L67 59 L44 87 L30 64 Z"
            fill="#FFFFFF"
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
