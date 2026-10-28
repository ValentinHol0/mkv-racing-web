import React from 'react';
import styles from './Button.module.css';

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
  const variantClass = styles[`variant_${variant}`] || styles.variant_primary;
  const sizeClass = styles[`size_${size}`] || styles.size_md;
  const widthClass = fullWidth ? styles.fullWidth : '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${styles.button} ${sizeClass} ${variantClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
