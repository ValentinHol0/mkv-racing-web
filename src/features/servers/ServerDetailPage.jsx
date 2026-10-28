import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ArrowLeft } from 'lucide-react';
import styles from './ServerDetailPage.module.css';

export function ServerDetailPage() {
  const { serverId } = useParams();
  const navigate = useNavigate();

  const serversDb = {
    'srp-tokyo-01': {
      name: 'SHUTO HIGHWAY (C1 / BAYSHORE)',
      region: 'Tokyo, Japan',
      status: 'online',
      occupancy: '48/70 slots',
      ping: '24ms',
      tickRate: '40 Hz',
      bubble: '300 meters',
      port: '9601',
    },
    'SRPT-JPN': {
      name: 'SHUTO HIGHWAY (C1 / BAYSHORE)',
      region: 'Tokyo, Japan',
      status: 'online',
      occupancy: '48/70 slots',
      ping: '24ms',
      tickRate: '40 Hz',
      bubble: '300 meters',
      port: '9601',
    },
    'georgia-tbilisi-02': {
      name: 'GEORGIA TBILISI TRAFFIC',
      region: 'Tbilisi, Georgia',
      status: 'online',
      occupancy: '32/70 slots',
      ping: '26ms',
      tickRate: '30 Hz',
      bubble: '300 meters',
      port: '9600',
    },
    'GTT-GEO': {
      name: 'GEORGIA TBILISI TRAFFIC',
      region: 'Tbilisi, Georgia',
      status: 'online',
      occupancy: '32/70 slots',
      ping: '26ms',
      tickRate: '30 Hz',
      bubble: '300 meters',
      port: '9600',
    },
  };

  const current = serversDb[serverId] || {
    name: `CLUSTER NODE ${(serverId || 'UNKNOWN').toUpperCase()}`,
    region: 'Global Cluster',
    status: 'online',
    occupancy: '24/70 slots',
    ping: '28ms',
    tickRate: '40 Hz',
    bubble: '300 meters',
    port: '9601',
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/servers')}>
          <ArrowLeft size={16} />
          <span>Back to Servers List</span>
        </button>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
          NODE IDENTIFIER: {serverId}
        </span>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.serverTitle}>{current.name}</h1>
            <p className={styles.serverSubtitle}>{current.region}</p>
          </div>
          <Badge variant="online" dot>
            {current.status.toUpperCase()}
          </Badge>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Live Occupancy</span>
            <span className={styles.metricVal}>{current.occupancy}</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Network Latency</span>
            <span className={styles.metricValGreen}>{current.ping}</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Tick Rate & Bubble</span>
            <span className={styles.metricVal}>
              {current.tickRate} / {current.bubble}
            </span>
          </div>
        </div>

        <div className={styles.actionRow}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              window.location.href = `acmanager://servers/join?ip=127.0.0.1&port=${current.port}`;
            }}
          >
            Launch Assetto Corsa via Content Manager
          </Button>

          <Button variant="secondary" size="lg" onClick={() => navigate('/garage')}>
            Configure Car in Garage
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServerDetailPage;
