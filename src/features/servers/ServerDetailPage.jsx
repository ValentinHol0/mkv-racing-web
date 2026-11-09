import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ArrowLeft } from 'lucide-react';
import { Alert } from '../../components/common/Alert';
import { useServer } from '../../hooks/useRacing';
import { useAuth } from '../../hooks/useAuth';
import { JoinServerModal } from './JoinServerModal';
import styles from './ServerDetailPage.module.css';

export function ServerDetailPage() {
  const { serverId } = useParams();
  const navigate = useNavigate();

  const { requireAuth } = useAuth();
  const [isJoinOpen, setJoinOpen] = useState(false);
  // GET /servers/:id з автооновленням; 404 від API показується як помилка
  const { data: server, error, loading } = useServer(serverId);

  const current = server && {
    name: server.name,
    region: server.region,
    status: server.status,
    occupancy: `${server.clients}/${server.maxClients} slots`,
    ping: `${server.ping}ms`,
    tickRate: `${server.tickRate} Hz`,
    bubble: `${server.bubbleRadius} meters`,
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

      {loading && !server && (
        <span className={styles.serverSubtitle}>Loading node telemetry...</span>
      )}
      {error && <Alert>{error.message}</Alert>}

      {current && (
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
            <Button variant="primary" size="lg" onClick={() => requireAuth() && setJoinOpen(true)}>
              Launch Assetto Corsa via Content Manager
            </Button>

            <Button variant="secondary" size="lg" onClick={() => navigate('/garage')}>
              Configure Car in Garage
            </Button>
          </div>
        </div>
      )}

      {isJoinOpen && <JoinServerModal server={server} onClose={() => setJoinOpen(false)} />}
    </div>
  );
}

export default ServerDetailPage;
