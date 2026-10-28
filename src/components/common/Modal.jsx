import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

export function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalRoot =
    typeof document !== 'undefined' ? document.getElementById('modal-root') || document.body : null;

  if (!modalRoot) return null;

  return createPortal(
    <div role="dialog" aria-modal="true" className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} data-testid="modal-backdrop" />

      <div className={styles.dialog}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button onClick={onClose} aria-label="Close modal" className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    modalRoot
  );
}
