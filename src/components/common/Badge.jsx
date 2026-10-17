import React from 'react';
import styles from './Badge.module.css';

export function Badge({ variant = 'default', children, className = '', dot = false, ...props }) {
  const variantClass = styles[`variant_${variant}`] || styles.variant_default;
  const dotClass = styles[`dot_${variant}`] || styles.dot_default;

  return (
    <span className={`${styles.badge} ${variantClass} ${className}`} {...props}>
      {dot && <span className={`${styles.dot} ${dotClass}`} />}
      {children}
    </span>
  );
}
