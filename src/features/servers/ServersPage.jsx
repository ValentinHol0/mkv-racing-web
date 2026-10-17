import React, { useState } from 'react';
import { Server, Filter, Radio } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ServerCard } from '../dashboard/ServerCard';
import { Badge } from '../../components/common/Badge';
import styles from './ServersPage.module.css';

export function ServersPage() {
  const { servers } = useAppStore();
  const [regionFilter, setRegionFilter] = useState('ALL');

  const filteredServers = servers.filter((srv) => {
    if (regionFilter === 'ALL') return true;
    return srv.region.toUpperCase().includes(regionFilter);
  });

  return (
    <div className={styles.pageWrapper} data-testid="servers-page">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.badgeGroup}>
            <Badge variant="cyan">DAEMON v0.1.77</Badge>
            <Badge variant="online" dot>
              CLUSTER HEALTHY
            </Badge>
          </div>
          <h1 className={styles.pageTitle}>
            <Server size={24} color="#e63946" />
            SERVER CLUSTERS & NETWORK NODES
          </h1>
          <p className={styles.pageSubtitle}>
            Real-time node telemetry, CSP bubble sync (300m), tick rate allocation, and Content
            Manager launcher
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className={styles.filterBar}>
          <Filter size={16} color="#94a3b8" style={{ marginLeft: '4px' }} />
          <button
            onClick={() => setRegionFilter('ALL')}
            className={`${styles.filterBtn} ${
              regionFilter === 'ALL' ? styles.filterBtnActive : ''
            }`}
          >
            All Nodes
          </button>
          <button
            onClick={() => setRegionFilter('JAPAN')}
            className={`${styles.filterBtn} ${
              regionFilter === 'JAPAN' ? styles.filterBtnActive : ''
            }`}
          >
            Japan SRP
          </button>
          <button
            onClick={() => setRegionFilter('GEORGIA')}
            className={`${styles.filterBtn} ${
              regionFilter === 'GEORGIA' ? styles.filterBtnActive : ''
            }`}
          >
            Georgia Tbilisi
          </button>
        </div>
      </div>

      {/* Cluster Overview Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>TOTAL ONLINE PILOTS</span>
          <span className={styles.statValue}>80 / 240</span>
          <span className={styles.statSub} style={{ color: 'var(--color-emerald)' }}>
            Overbooking max capacity active
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>AVERAGE LATENCY</span>
          <span className={`${styles.statValue} ${styles.statValueEmerald}`}>25 ms</span>
          <span className={styles.statSub}>Direct EU/UA peering</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>NETWORK BUBBLE</span>
          <span className={`${styles.statValue} ${styles.statValueCyan}`}>300 m</span>
          <span className={styles.statSub}>CSP dynamic culling</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>INTEGRITY GUARD</span>
          <span className={`${styles.statValue} ${styles.statValueAmber}`}>SHA-256</span>
          <span className={styles.statSub}>Zero checksum mismatches</span>
        </div>
      </div>

      {/* Server List */}
      <div className={styles.serverList}>
        {filteredServers.map((srv) => (
          <ServerCard key={srv.id} server={srv} />
        ))}
      </div>

      {/* Technical Protocol Notes */}
      <div className={styles.protocolCard}>
        <h4 className={styles.protocolTitle}>
          <Radio size={16} color="#e63946" />
          ASSETTO CORSA PROTOCOL HANDOFF ARCHITECTURE
        </h4>
        <p>
          Clicking the &quot;Connect&quot; button invokes the custom client scheme{' '}
          <code style={{ color: 'var(--color-racing-red)', fontWeight: 'bold' }}>
            acmanager://ui/quick/server?...
          </code>
          . This instructs Content Manager to immediately acquire missing track configs, check local
          car hashes against the server manifest, launch the Kunos 64-bit physics core, and connect
          via UDP ports without manual IP entry.
        </p>
      </div>
    </div>
  );
}
