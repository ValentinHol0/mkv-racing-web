import React from 'react';
import { Activity, Shield, Terminal, Zap } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Core telemetry specs */}
        <div className={styles.telemetrySpecs}>
          <span className={styles.specItem}>
            <Activity size={14} color="#10b981" />
            Tick Rate: <strong>40 Hz (25ms)</strong>
          </span>
          <span className={styles.specItem}>
            <Zap size={14} color="#06b6d4" />
            Network Bubble: <strong>300m</strong>
          </span>
          <span className={styles.specItem}>
            <Shield size={14} color="#e63946" />
            Pure Engine: <strong>Pure 3.10 Rain FX</strong>
          </span>
          <span className={styles.specItem}>
            <Terminal size={14} color="#f59e0b" />
            Protocol: <strong>acmanager://</strong>
          </span>
        </div>

        {/* Academic and project watermark */}
        <div className={styles.academicInfo}>
          <div>MKV Racing Hub • UzhNU FIT IPZ-2 (2026)</div>
          <div className={styles.subVersions}>
            AssettoServer v0.1.77 • CSP Batched 0.1.77+ • React 18.3.1 (CSS Modules)
          </div>
        </div>
      </div>
    </footer>
  );
}
