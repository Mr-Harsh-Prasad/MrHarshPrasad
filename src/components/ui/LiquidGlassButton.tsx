'use client';

import React from 'react';
import MagneticButton from './MagneticButton';

interface LiquidGlassButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function LiquidGlassButton({ href, children, className = '' }: LiquidGlassButtonProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* SVG Filter for Liquid Effect */}
      <svg className="hidden">
        <filter id="liquid-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      
      <MagneticButton href={href} className="relative z-10 overflow-hidden rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-8 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]">
        <span className="relative z-10 flex items-center justify-center gap-2 text-white font-medium tracking-wide">
          {children}
        </span>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ filter: 'url(#liquid-filter)', animation: 'ripple 3s infinite linear' }}
        />
      </MagneticButton>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ripple {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}} />
    </div>
  );
}
