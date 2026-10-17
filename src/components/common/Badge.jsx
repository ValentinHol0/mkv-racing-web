import React from 'react';

export function Badge({ variant = 'default', children, className = '', dot = false, ...props }) {
  const variantStyles = {
    default: 'bg-cyber-card border-cyber-border text-slate-300',
    online: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400',
    danger: 'bg-red-950/60 border-red-500/40 text-red-400',
    warning: 'bg-amber-950/60 border-amber-500/40 text-amber-400',
    cyan: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400',
    tier: 'bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-500/60 text-red-200 font-bold',
  };

  const dotColors = {
    default: 'bg-slate-400',
    online: 'bg-emerald-400 animate-pulse',
    danger: 'bg-red-400',
    warning: 'bg-amber-400',
    cyan: 'bg-cyan-400',
    tier: 'bg-racing-red',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />
      )}
      {children}
    </span>
  );
}
