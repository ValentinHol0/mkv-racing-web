import React from 'react';
import styles from './Input.module.css';

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
    <div className={`${styles.wrapper} ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {Icon && (
          <div className={styles.icon}>
            <Icon size={16} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`${styles.input} ${Icon ? styles.hasIcon : ''} ${
            error ? styles.inputError : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
