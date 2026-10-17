import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-slate disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold',
  };

  const variants = {
    primary:
      'bg-racing-red hover:bg-racing-redHover text-white shadow-lg shadow-racing-red/20 focus:ring-racing-red',
    secondary:
      'bg-cyber-surface hover:bg-cyber-card border border-cyber-border text-slate-200 focus:ring-slate-500',
    steam:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 focus:ring-blue-500 shadow-md',
    outline:
      'border border-racing-red text-racing-red hover:bg-racing-red/10 focus:ring-racing-red',
    ghost: 'text-slate-400 hover:text-white hover:bg-cyber-surface/60 focus:ring-slate-600',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size] || sizes.md} ${
        variants[variant] || variants.primary
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
