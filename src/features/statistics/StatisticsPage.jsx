import React from 'react';
import { LineChart, Timer, Activity, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../../components/common/Badge';
import styles from './StatisticsPage.module.css';

export function StatisticsPage() {
  const { telemetry } = useAppStore();

  const sectorSplits = [
    {
      sector: 'Sector 1 (Kasumigaseki Tunnel)',
      delta: '-0.142s',
      time: '42.110s',
      status: 'optimal',
    },
    {
      sector: 'Sector 2 (Shibaura Junction)',
      delta: '+0.080s',
      time: '55.340s',
      status: 'caution',
    },
    {
      sector: 'Sector 3 (Rainbow Bridge S-Curves)',
      delta: '-0.230s',
      time: '1:12.890',
      status: 'optimal',
    },
    {
      sector: 'Sector 4 (Bayshore Wangan Sprint)',
      delta: '-0.410s',
      time: '57.870s',
      status: 'optimal',
    },
  ];

  return (
    <div className={styles.pageWrapper} data-testid="statistics-page">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.badgeGroup}>
            <Badge variant="emerald">CSP TELEMETRY RECORDER</Badge>
            <Badge variant="online" dot>
              LIVE SAMPLING (40Hz)
            </Badge>
          </div>
          <h1 className={styles.pageTitle}>
            <LineChart size={24} color="#e63946" />
            TELEMETRY ANALYTICS & SECTOR TIMINGS
          </h1>
          <p className={styles.pageSubtitle}>
            Lateral G curves, Shuto C1 loop sector splits, and pilot safety rating index
          </p>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>BEST LAP (SHUTO C1)</span>
          <span className={styles.kpiValue}>3:48.210</span>
          <span className={styles.kpiSub} style={{ color: 'var(--color-emerald)' }}>
            Personal Record • Toyota Supra MKV
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>PEAK LATERAL G</span>
          <span className={`${styles.kpiValue} ${styles.kpiValueCyan}`}>1.68 G</span>
          <span className={styles.kpiSub}>Rainbow Bridge entry curve</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>SAFETY RATING INDEX</span>
          <span className={`${styles.kpiValue} ${styles.kpiValueEmerald}`}>98.4%</span>
          <span className={styles.kpiSub}>0 incidents across 14 sessions</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>MAX SPEED LOGGED</span>
          <span className={`${styles.kpiValue} ${styles.kpiValueRed}`}>324 km/h</span>
          <span className={styles.kpiSub}>Bayshore Straight 6th Gear</span>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Shuto C1 Sector Timing Splits */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>
              <Timer size={16} color="#06b6d4" />
              Shuto Expressway C1 Sector Breakdown
            </h3>
            <Badge variant="cyan">GPS GAUGE</Badge>
          </div>

          <div className={styles.sectorsList}>
            {sectorSplits.map((item, index) => (
              <div key={index} className={styles.sectorItem}>
                <div>
                  <span className={styles.sectorName}>{item.sector}</span>
                  <span className={styles.sectorSub}>Benchmark comparison</span>
                </div>
                <div className={styles.sectorRight}>
                  <span className={styles.sectorTime}>{item.time}</span>
                  <span
                    className={
                      item.delta.startsWith('-') ? styles.deltaOptimal : styles.deltaCaution
                    }
                  >
                    {item.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.theoreticalBest}>
            <span>Theoretical Best Time:</span>
            <strong className={styles.theoreticalTime}>3:47.510</strong>
          </div>
        </div>

        {/* Lateral G & Telemetry Curve Display */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>
              <Activity size={16} color="#e63946" />
              Live Lateral G Telemetry Stream
            </h3>
            <Badge variant="online" dot>
              {telemetry.lateralG} G
            </Badge>
          </div>

          {/* Visual G-Force Bar Chart Representation */}
          <div className={styles.gForceGrid}>
            <div>
              <div className={styles.gForceHeader}>
                <span>Left Turn Cornering G</span>
                <span style={{ color: 'var(--color-cyan)', fontWeight: 'bold' }}>
                  {Math.max(0, (telemetry.lateralG - 0.5).toFixed(2))} G
                </span>
              </div>
              <div className={styles.gBarTrack}>
                <div
                  className={styles.gBarCyan}
                  style={{ width: `${Math.min(100, (telemetry.lateralG / 2) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className={styles.gForceHeader}>
                <span>Right Turn Cornering G</span>
                <span style={{ color: 'var(--color-emerald)', fontWeight: 'bold' }}>
                  {Math.max(0, (2 - telemetry.lateralG).toFixed(2))} G
                </span>
              </div>
              <div className={styles.gBarTrack}>
                <div
                  className={styles.gBarEmerald}
                  style={{ width: `${Math.min(100, ((2 - telemetry.lateralG) / 2) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className={styles.gForceHeader}>
                <span>Throttle Telemetry Level</span>
                <span style={{ color: 'var(--color-racing-red)', fontWeight: 'bold' }}>
                  {Math.round((telemetry.speed / 340) * 100)}%
                </span>
              </div>
              <div className={styles.gBarTrack}>
                <div
                  className={styles.gBarRed}
                  style={{ width: `${(telemetry.speed / 340) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className={styles.tireTempFooter}>
            <ShieldCheck size={16} color="#10b981" />
            <span>Tire Temp: FL 88°C • FR 91°C • RL 94°C • RR 93°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}
