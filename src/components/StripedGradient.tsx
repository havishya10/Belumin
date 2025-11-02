// Striped gradient background component
import React from 'react';

interface StripedGradientProps {
  className?: string;
  children?: React.ReactNode;
}

export const StripedGradient: React.FC<StripedGradientProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{
        background: 'linear-gradient(180deg, #A8C5AC 0%, #C8E6D0 50%, #F5F1E8 100%)',
      }}
    >
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.3) 10px,
            rgba(255, 255, 255, 0.3) 11px,
            transparent 11px,
            transparent 30px,
            rgba(255, 255, 255, 0.5) 30px,
            rgba(255, 255, 255, 0.5) 32px
          )`,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
