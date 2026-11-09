import React, { useState } from 'react';
import { LineChart, Timer, Activity, ShieldCheck, Flag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useCars, useMyStats, useServers, useSubmitLap } from '../../hooks/useRacing';
import { formatLapTime, parseLapTime } from '../../utils/racing';
import styles from './StatisticsPage.module.css';

export function StatisticsPage() {
  const { telemetry } = useAppStore();
  const { user, isAuthenticated, requireAuth } = useAuth();
  const { data: stats } = useMyStats();
  const { data: servers } = useServers();
  const { byId: cars } = useCars();

  // Форма зарахування кола
  const [serverId, setServerId] = useState('srp-tokyo-01');
  const [lapText, setLapText] = useState('');
  const [incidents, setIncidents] = useState('0');
  const [formError, setFormError] = useState(null);
  const submitLap = useSubmitLap({ onSuccess: () => setLapText('') });
  const server = servers.find((s) => s.id === serverId);
  const raceCar = cars[user?.selectedCarId];

  const handleSubmitLap = (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    const timeMs = parseLapTime(lapText);
    if (timeMs == null) return setFormError('Lap time format: m:ss.mmm (e.g. 3:47.905)');
    setFormError(null);
    submitLap
      .mutate({ serverId, carId: user.selectedCarId, timeMs, incidents: Number(incidents) })
      .catch(() => {});
  };

  const result = submitLap.data;

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
          <span className={styles.kpiValue}>{formatLapTime(stats?.bestLap?.timeMs)}</span>
          <span className={styles.kpiSub} style={{ color: 'var(--color-emerald)' }}>
            {stats?.bestLap
              ? `Personal Record • ${cars[stats.bestLap.carId]?.name ?? stats.bestLap.carId}`
              : isAuthenticated
                ? 'No valid laps on Shuto yet'
                : 'Sign in to see your records'}
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>PEAK LATERAL G</span>
          <span className={`${styles.kpiValue} ${styles.kpiValueCyan}`}>1.68 G</span>
          <span className={styles.kpiSub}>Rainbow Bridge entry curve</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>SAFETY RATING INDEX</span>
          <span className={`${styles.kpiValue} ${styles.kpiValueEmerald}`}>
            {user ? `${user.safetyScore}%` : '—'}
          </span>
          <span className={styles.kpiSub}>
            {stats
              ? `${stats.validLaps} valid of ${stats.totalLaps} logged laps`
              : '−0.4% per incident'}
          </span>
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

        {/* Lap submission: перевірка anti-cheat і нарахування рейтингу на сервері */}
        <form className={styles.panelCard} onSubmit={handleSubmitLap}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>
              <Flag size={16} color="#f59e0b" />
              Submit Lap to Leaderboard
            </h3>
            <Badge variant="tier">{user ? `${user.rating} RP` : 'GUEST'}</Badge>
          </div>

          <div className={styles.sectorItem}>
            <div>
              <span className={styles.sectorName}>Server Node</span>
              <span className={styles.sectorSub}>
                {server
                  ? `Valid range ${formatLapTime(server.lapLimitsMs.min)} – ${formatLapTime(server.lapLimitsMs.max)}`
                  : '—'}
              </span>
            </div>
            <select
              value={serverId}
              onChange={(e) => {
                setServerId(e.target.value);
                submitLap.reset();
              }}
              className={styles.select}
            >
              {servers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.region}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.sectorItem}>
            <div>
              <span className={styles.sectorName}>Race Car</span>
              <span className={styles.sectorSub}>Change it in the Garage</span>
            </div>
            <span className={styles.sectorTime}>{raceCar?.name ?? '—'}</span>
          </div>

          <Input
            id="lap-time-input"
            label="Lap Time (m:ss.mmm)"
            placeholder="3:47.905"
            value={lapText}
            onChange={(e) => setLapText(e.target.value)}
            data-testid="lap-time-input"
          />
          <Input
            id="lap-incidents-input"
            label="Incidents (contacts / off-tracks)"
            type="number"
            min="0"
            value={incidents}
            onChange={(e) => setIncidents(e.target.value)}
          />

          {(formError || submitLap.error) && <Alert>{formError ?? submitLap.error.message}</Alert>}
          {result && (
            <Alert variant="success">
              {result.valid
                ? `Lap ${formatLapTime(result.lap.timeMs)} counted: +${result.ratingDelta} RP`
                : `Lap invalidated (too many incidents): ${result.ratingDelta} RP`}
              {result.isServerRecord
                ? ' • NEW SERVER RECORD'
                : result.isPersonalBest
                  ? ' • personal best'
                  : ''}
            </Alert>
          )}

          <Button type="submit" variant="primary" size="md" disabled={submitLap.loading}>
            <Flag size={16} />
            <span>{submitLap.loading ? 'Validating Lap...' : 'Submit Lap'}</span>
          </Button>
          <span className={styles.sectorSub}>
            +10 RP clean lap • +25 personal best • +50 server record • 3+ incidents = invalid (−5
            RP)
          </span>
        </form>
      </div>
    </div>
  );
}
