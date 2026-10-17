import React from 'react';
import { Server, Users, Activity, CloudRain, ShieldCheck, ExternalLink, Cpu } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import styles from './ServerCard.module.css';

export function ServerCard({ server, onConnect }) {
  if (!server) return null;

  const handleConnect = () => {
    if (onConnect) {
      onConnect(server);
    } else if (typeof window !== 'undefined' && server.joinUrl) {
      window.location.href = server.joinUrl;
    }
  };

  const occupancyRatio = (server.clients / server.maxClients) * 100;

  const getLoadBarColor = () => {
    if (occupancyRatio > 80) return styles.loadRed;
    if (occupancyRatio > 50) return styles.loadYellow;
    return styles.loadGreen;
  };

  return (
    <div data-testid="server-card" className={styles.card}>
      {/* Header Info */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.serverIcon}>
            <Server size={20} />
          </div>
          <div>
            <h4 data-testid="server-name" className={styles.title}>
              {server.name}
            </h4>
            <p className={styles.subtitle}>
              {server.track} • <span className={styles.region}>{server.region}</span>
            </p>
          </div>
        </div>
        <Badge variant="online" dot>
          ONLINE
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>
            <Users size={12} color="#06b6d4" /> SLOTS
          </span>
          <span data-testid="server-clients" className={styles.metricValue}>
            {server.clients}/{server.maxClients}{' '}
            <span className={styles.metricValueSub}>({server.maxSlots || 170})</span>
          </span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>
            <Activity size={12} color="#10b981" /> PING
          </span>
          <span data-testid="server-ping" className={styles.pingValue}>
            {server.ping} ms
          </span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>
            <Cpu size={12} color="#f59e0b" /> TICK RATE
          </span>
          <span className={styles.metricValue}>{server.tickRate} Hz</span>
        </div>

        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>
            <CloudRain size={12} color="#06b6d4" /> WEATHER
          </span>
          <span className={styles.weatherValue}>{server.weather || 'Pure 3.10'}</span>
        </div>
      </div>

      {/* Occupancy bar */}
      <div className={styles.loadContainer}>
        <div className={styles.loadLabels}>
          <span>Server Load</span>
          <span>{Math.round(occupancyRatio)}% Capacity</span>
        </div>
        <div className={styles.loadTrack}>
          <div
            className={`${styles.loadBar} ${getLoadBarColor()}`}
            style={{ width: `${occupancyRatio}%` }}
          />
        </div>
      </div>

      {/* Footer & Connect Action */}
      <div className={styles.footer}>
        <div className={styles.checksumNote}>
          <ShieldCheck size={16} color="#10b981" />
          <span>Checksum SHA-256 Passed</span>
        </div>

        <Button variant="primary" size="sm" onClick={handleConnect} data-testid="connect-button">
          <ExternalLink size={14} />
          <span>Connect (acmanager://)</span>
        </Button>
      </div>
    </div>
  );
}
