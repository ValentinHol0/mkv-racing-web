import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Copy } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useCars, useJoinServer } from '../../hooks/useRacing';
import { apiClient } from '../../services/apiClient';
import { localChecksum } from '../../utils/racing';
import styles from './JoinServerModal.module.css';

/**
 * Підключення до сервера. API перевіряє 5 правил допуску:
 * online, вільні слоти, клас авто на сервері, ліцензію пілота, SHA-256 модів.
 */
export function JoinServerModal({ server, onClose, onJoined }) {
  const { user } = useAuth();
  const { byId: cars } = useCars();
  const join = useJoinServer();
  const [outdatedMod, setOutdatedMod] = useState(false);
  const [copied, setCopied] = useState(false);

  const car = cars[user?.selectedCarId];

  const handleJoin = async () => {
    try {
      await join.mutate({
        serverId: server.id,
        carId: car.id,
        checksum: localChecksum(car, outdatedMod),
      });
      onJoined?.();
    } catch {
      /* помилка відображається з join.error */
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(join.data.joinUrl);
    setCopied(true);
  };

  return (
    <Modal isOpen onClose={onClose} title="CONTENT MANAGER HANDSHAKE">
      <div className={styles.content} data-testid="join-modal">
        <div className={styles.row}>
          <span className={styles.label}>SERVER NODE</span>
          <span className={styles.value}>{server.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>FREE SLOTS</span>
          <span className={styles.value}>
            {server.freeSlots} / {server.maxClients}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>ALLOWED CLASSES</span>
          <span className={styles.value}>{server.allowedClasses.join(' · ')}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>SELECTED CAR</span>
          <span className={styles.value}>
            {car ? (
              <>
                {car.name} <Badge variant="tier">CLASS {car.carClass}</Badge>
              </>
            ) : (
              '—'
            )}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>PILOT LICENSE</span>
          <span className={styles.value}>{user?.license}</span>
        </div>

        {!join.data && (
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={outdatedMod}
              onChange={(e) => setOutdatedMod(e.target.checked)}
              data-testid="outdated-mod-checkbox"
            />
            Simulate outdated local mod (SHA-256 mismatch)
          </label>
        )}

        {join.error && (
          <Alert data-testid="join-error">
            <strong>{join.error.code}</strong> — {join.error.message}
          </Alert>
        )}

        {join.data && (
          <>
            <Alert variant="success" data-testid="join-success">
              Access granted ({join.data.license} license). Checksum verified.
            </Alert>
            <div className={styles.uriRow}>
              <input readOnly value={join.data.joinUrl} className={styles.uriInput} />
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                <Copy size={14} />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          {join.data ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => apiClient.launchAcManager(join.data.joinUrl)}
            >
              <ExternalLink size={14} />
              <span>Launch Content Manager</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleJoin}
              disabled={join.loading || !car}
              data-testid="join-submit-btn"
            >
              <ShieldCheck size={14} />
              <span>{join.loading ? 'Verifying...' : 'Verify & Join'}</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default JoinServerModal;
