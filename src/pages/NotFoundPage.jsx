import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <AlertTriangle size={36} color="var(--color-racing-red)" />
        <span className={styles.errorCode}>404</span>
      </div>

      <h1 className={styles.errorTitle}>Off Track — Sector Not Found</h1>
      <p className={styles.errorDesc}>
        The requested telemetry route or server node does not exist in the current MKV Racing
        cluster registry. Return to the pit lane or main operational hub.
      </p>

      <div className={styles.buttonGroup}>
        <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate('/')}>
          <Home size={16} />
          <span>Return To Cockpit</span>
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
