import React from 'react';
import {
  Activity,
  Trophy,
  Navigation,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ServerCard } from './ServerCard';
import { Badge } from '../../components/common/Badge';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const { servers, telemetry } = useAppStore();

  const leaderboard = [
    { rank: 1, pilot: 'ApexPredator_UA', car: 'Toyota Supra MKV', lapTime: '3:48.210' },
    { rank: 2, pilot: 'Midnight_Rider_JP', car: 'Porsche 911 GT3 RS', lapTime: '3:49.004' },
    { rank: 3, pilot: 'GhostRunner_Tbilisi', car: 'BMW M5 CS', lapTime: '3:51.450' },
    { rank: 4, pilot: 'BayshoreDrifter', car: 'Audi R8 V10', lapTime: '3:53.110' },
  ];

  return (
    <div className={styles.pageWrapper} data-testid="dashboard-page">
      {/* Hero Welcome & Live Stream Status */}
      <div className={styles.heroBanner}>
        <div>
          <div className={styles.badgeGroup}>
            <Badge variant="tier">PRO TIER ACTIVE</Badge>
            <Badge variant="online" dot>
              40 Hz TELEMETRY SYNC
            </Badge>
          </div>
          <h1 className={styles.heroTitle}>MKV RACING INFRASTRUCTURE CONTROL</h1>
          <p className={styles.heroSubtitle}>
            Real-time server telemetry, Content Manager 1-click launcher, and live radar tracking
          </p>
        </div>

        {/* Real-time Telemetry Capsule */}
        <div className={styles.telemetryCapsule}>
          <div className={styles.telemetryItem}>
            <span className={styles.capsuleLabel}>LIVE SPEED</span>
            <span className={`${styles.capsuleValue} ${styles.speedValue}`}>
              {telemetry.speed}{' '}
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>km/h</span>
            </span>
          </div>
          <div className={styles.capsuleDivider} />
          <div className={styles.telemetryItem}>
            <span className={styles.capsuleLabel}>LATERAL G</span>
            <span className={`${styles.capsuleValue} ${styles.latGValue}`}>
              {telemetry.lateralG} G
            </span>
          </div>
          <div className={styles.capsuleDivider} />
          <div className={styles.telemetryItem}>
            <span className={styles.capsuleLabel}>ENGINE RPM</span>
            <span className={`${styles.capsuleValue} ${styles.rpmValue}`}>{telemetry.rpm}</span>
          </div>
        </div>
      </div>

      {/* Main Server Cluster Cards */}
      <div>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <Activity size={18} color="#e63946" />
            ACTIVE SERVER CLUSTERS
          </h2>
          <span className={styles.sectionNote}>Auto-ping refresh every 5s</span>
        </div>
        <div className={styles.serverGrid}>
          {servers.map((srv) => (
            <ServerCard key={srv.id} server={srv} />
          ))}
        </div>
      </div>

      {/* Secondary Dashboard Grid: Weather, Radar, Leaderboard */}
      <div className={styles.widgetsGrid}>
        {/* Shuto Weather Widget */}
        <div className={styles.widgetCard}>
          <div>
            <div className={styles.widgetHeader}>
              <h3 className={styles.widgetTitle}>
                <Thermometer size={16} color="#06b6d4" />
                Pure 3.10 Weather Engine
              </h3>
              <Badge variant="cyan">DYNAMIC RAIN</Badge>
            </div>
            <div className={styles.weatherCenter}>
              <div>
                <span className={styles.weatherTemp}>19°C</span>
                <span className={styles.weatherSub}>Track: 18.2°C (Wet Road Surface)</span>
              </div>
              <Droplets size={36} color="rgba(6, 182, 212, 0.8)" />
            </div>
          </div>
          <div className={styles.weatherFooter}>
            <div className={styles.weatherFootItem}>
              <Wind size={14} color="#cbd5e1" /> Wind: 14 km/h SW
            </div>
            <div className={styles.weatherFootItem}>
              <ShieldAlert size={14} color="#f59e0b" /> Grip Coeff: 0.88
            </div>
          </div>
        </div>

        {/* Live Minimap Radar Mockup */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>
              <Navigation size={16} color="#10b981" />
              Live Radar (300m Bubble)
            </h3>
            <Badge variant="online" dot>
              48 BLIPS
            </Badge>
          </div>
          <div className={styles.radarContainer}>
            <div className={styles.radarRing1} />
            <div className={styles.radarRing2} />
            <div className={styles.radarCenterDot} />
            <span className={styles.blip1} />
            <span className={styles.blip2} />
            <span className={styles.radarTrackLabel}>Shuto C1 Outer Loop</span>
          </div>
          <span className={styles.radarFootnote}>Network Bubble: 300m Radius Around Pilot</span>
        </div>

        {/* Online Drivers Leaderboard */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>
              <Trophy size={16} color="#f59e0b" />
              Live Leaderboard (Shuto C1)
            </h3>
            <span className={styles.sectionNote}>Loop Lap</span>
          </div>
          <div className={styles.leaderboardList}>
            {leaderboard.map((item) => (
              <div key={item.rank} className={styles.leaderboardRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className={`${styles.leaderboardRank} ${
                      item.rank === 1 ? styles.leaderboardRankGold : ''
                    }`}
                  >
                    #{item.rank}
                  </span>
                  <span className={styles.leaderboardPilot}>{item.pilot}</span>
                </div>
                <span className={styles.leaderboardLap}>{item.lapTime}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
