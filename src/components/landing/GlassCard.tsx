import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div
      className={`landing-glass-surface rounded-3xl backdrop-blur-md ${
        hover ? 'landing-glass-hover' : ''
      } ${className}`}
      style={{
        background: 'rgba(18, 18, 24, 0.55)',
        border: '1px solid rgba(91, 111, 216, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(124, 77, 255, 0.05)'
      }}
    >
      {children}
    </div>
  );
}
