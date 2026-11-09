import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import styles from './Alert.module.css';

/** Повідомлення про результат запиту до API (помилка бізнес-правила або успіх). */
export function Alert({ variant = 'error', children, ...props }) {
  const Icon = variant === 'success' ? CheckCircle2 : AlertTriangle;
  return (
    <div role="alert" className={`${styles.alert} ${styles[variant]}`} {...props}>
      <Icon size={14} className={styles.icon} />
      <span>{children}</span>
    </div>
  );
}

export default Alert;
