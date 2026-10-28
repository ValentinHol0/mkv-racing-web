import React, { useState } from 'react';
import {
  Terminal,
  Filter,
  Send,
  Cpu,
  HardDrive,
  Wifi,
} from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import styles from './LogsPage.module.css';

export function LogsPage() {
  const { logs, sendMessage } = useWebSocket();
  const [filter, setFilter] = useState('ALL');
  const [customMsg, setCustomMsg] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'ALL') return true;
    return log.level.toUpperCase() === filter;
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    sendMessage(customMsg);
    setCustomMsg('');
  };

  const getLevelBadge = (lvl) => {
    switch (lvl) {
      case 'INFO':
        return <Badge variant="cyan">INFO</Badge>;
      case 'WARN':
        return <Badge variant="warning">WARN</Badge>;
      case 'CHECKSUM':
        return <Badge variant="online">PASS</Badge>;
      case 'CLIENT':
        return <Badge variant="tier">EXEC</Badge>;
      default:
        return <Badge>{lvl}</Badge>;
    }
  };

  return (
    <div className={styles.pageWrapper} data-testid="logs-page">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.badgeGroup}>
            <Badge variant="cyan">ASSETTOSERVER DAEMON</Badge>
            <Badge variant="online" dot>
              WS 9601 ACTIVE
            </Badge>
          </div>
          <h1 className={styles.pageTitle}>
            <Terminal size={24} color="#e63946" />
            CONSOLE TERMINAL & SYSTEM LOGS
          </h1>
          <p className={styles.pageSubtitle}>
            Real-time UDP/TCP 9601 daemon events, SHA-256 checksum validations, and client connection traffic
          </p>
        </div>

        {/* Filter controls */}
        <div className={styles.filterBar}>
          <Filter size={16} color="#94a3b8" style={{ marginLeft: '4px' }} />
          {['ALL', 'INFO', 'WARN', 'CHECKSUM'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`${styles.filterBtn} ${
                filter === f ? styles.filterBtnActive : ''
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Metrics Strip */}
      <div className={styles.metricsStrip}>
        <div className={styles.metricCard}>
          <div className={styles.metricLeft}>
            <div className={styles.metricIconBox}>
              <Cpu size={20} color="#10b981" />
            </div>
            <div>
              <span className={styles.metricLabel}>SERVER CPU LOAD</span>
              <span className={styles.metricValue}>18.2%</span>
            </div>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--color-emerald)', fontFamily: 'var(--font-mono)' }}>
            Stable
          </span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLeft}>
            <div className={styles.metricIconBox}>
              <HardDrive size={20} color="#06b6d4" />
            </div>
            <div>
              <span className={styles.metricLabel}>RAM CONSUMPTION</span>
              <span className={styles.metricValue}>
                12.6 <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>/ 32 GB</span>
              </span>
            </div>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
            39% Allocated
          </span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricLeft}>
            <div className={styles.metricIconBox}>
              <Wifi size={20} color="#f59e0b" />
            </div>
            <div>
              <span className={styles.metricLabel}>NETWORK BANDWIDTH</span>
              <span className={styles.metricValue}>2.8 MB/s</span>
            </div>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>
            Tick 40Hz
          </span>
        </div>
      </div>

      {/* Terminal Console Stream Window */}
      <div className={styles.terminalWindow}>
        <div className={styles.terminalHeader}>
          <div className={styles.macDots}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
            <span className={styles.terminalTitle}>daemon.log — live stream</span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--color-text-dim)' }}>
            Auto-tail enabled
          </span>
        </div>

        {/* Logs viewport */}
        <div className={styles.logsViewport}>
          {filteredLogs.map((entry) => (
            <div key={entry.id} className={styles.logRow}>
              <span className={styles.logTime}>{entry.time}</span>
              <div style={{ flexShrink: 0 }}>{getLevelBadge(entry.level)}</div>
              <span className={styles.logMessage}>{entry.message}</span>
            </div>
          ))}
        </div>

        {/* Console Command Input */}
        <form onSubmit={handleSend} className={styles.cmdForm}>
          <input
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Type server command (e.g. /kick, /reload, /weather rain)..."
            className={styles.cmdInput}
          />
          <Button type="submit" variant="primary" size="sm">
            <Send size={14} />
            <span>Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
