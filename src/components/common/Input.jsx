import React from 'react';

export function Input({
  label,
  error,
  id,
  type = 'text',
  className = '',
  wrapperClassName = '',
  icon: Icon,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-mono font-medium text-slate-300 tracking-wider uppercase"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full bg-cyber-slate border ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-cyber-border focus:border-racing-red'
          } rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-racing-red transition-all ${
            Icon ? 'pl-9' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-400 font-mono mt-0.5">{error}</span>}
    </div>
  );
}
