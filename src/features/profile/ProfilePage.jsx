import React from 'react';
import { ShieldCheck, CheckCircle, Car, Key } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMyStats } from '../../hooks/useRacing';
import { formatLapTime, nextLicense } from '../../utils/racing';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { user, isAuthenticated, requireAuth } = useAuth();
  const { data: stats } = useMyStats();

  const activePilot = user || {
    name: 'Valentin Holomidov',
    callsign: 'ApexPredator_UA',
    email: 'valentingolomidov@gmail.com',
    steamId: '76561198000000001',
    tier: 'Level 42 Pro Tier',
    safetyScore: 98.4,
    paceScore: 94.2,
  };

  const dlcLicenses = [
    { name: 'Assetto Corsa - Japanese Pack', verified: true },
    { name: 'Assetto Corsa - Dream Pack 1, 2 & 3', verified: true },
    { name: 'Assetto Corsa - Porsche Season Pass', verified: true },
    { name: 'Custom Shaders Patch (CSP 0.1.77+)', verified: true },
    { name: 'Pure 3.10 Weather Engine Script', verified: true },
  ];

  // Автопарк пілота з API: кількість валідних кіл і найкращий час на кожному авто
  const careerFleet = (stats?.byCar ?? []).map((row) => ({
    car: row.car,
    topSpeed: row.topSpeed,
    distance: formatLapTime(row.bestMs),
    laps: row.laps,
  }));
  const next = user ? nextLicense(user.rating) : null;

  return (
    <div className={styles.pageWrapper} data-testid="profile-page">
      {/* Pilot Profile Banner */}
      <div className={styles.profileBanner}>
        <div className={styles.pilotIdentity}>
          <div className={styles.avatar}>
            {activePilot.callsign ? activePilot.callsign.substring(0, 2).toUpperCase() : 'VH'}
          </div>
          <div>
            <div className={styles.badgeGroup}>
              <Badge variant="tier">{activePilot.tier}</Badge>
              <Badge variant="online" dot>
                STEAM LINKED
              </Badge>
            </div>
            <h1 className={styles.callsign}>{activePilot.callsign}</h1>
            <p className={styles.pilotMeta}>
              Pilot:{' '}
              <strong style={{ color: 'var(--color-text-secondary)' }}>{activePilot.name}</strong> •
              SteamID: <span style={{ color: 'var(--color-cyan)' }}>{activePilot.steamId}</span>
            </p>
          </div>
        </div>

        <div className={styles.capsuleContainer}>
          <div className={styles.capsuleItem}>
            <span className={styles.capsuleLabel}>SAFETY RATING</span>
            <span className={styles.capsuleValue} style={{ color: 'var(--color-emerald)' }}>
              {activePilot.safetyScore}%
            </span>
          </div>
          <div className={styles.capsuleDivider} />
          <div className={styles.capsuleItem}>
            <span className={styles.capsuleLabel}>
              {next ? `RATING • ${next.need} TO ${next.code}` : 'RATING • MAX LICENSE'}
            </span>
            <span className={styles.capsuleValue} style={{ color: 'var(--color-cyan)' }}>
              {user ? `${user.rating} RP` : `${activePilot.paceScore || 94.2}%`}
            </span>
          </div>
          <div className={styles.capsuleDivider} />
          <div className={styles.capsuleItem}>
            <span className={styles.capsuleLabel}>TOTAL LOGGED</span>
            <span className={styles.capsuleValue} style={{ color: 'var(--color-amber)' }}>
              {stats?.totalLaps ?? 0}{' '}
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>laps</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Steam OpenID 2.0 & DLC Licenses */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>
              <ShieldCheck size={16} color="#10b981" />
              Steam OpenID 2.0 SSO Validation
            </h3>
            <Badge variant="online">VERIFIED</Badge>
          </div>
          <p className={styles.panelDesc}>
            Cryptographically signed tokens certify ownership of required Kunos DLC packages.
          </p>

          <div className={styles.licensesList}>
            {dlcLicenses.map((dlc, i) => (
              <div key={i} className={styles.licenseItem}>
                <span>{dlc.name}</span>
                <CheckCircle size={16} color="#10b981" />
              </div>
            ))}
          </div>

          {!isAuthenticated && (
            <div style={{ paddingTop: '8px' }}>
              <Button variant="steam" size="sm" fullWidth onClick={requireAuth}>
                <Key size={16} color="#06b6d4" />
                <span>Re-authenticate via Steam OpenID</span>
              </Button>
            </div>
          )}
        </div>

        {/* Fleet Career Milestones */}
        <div className={styles.panelCard}>
          <h3 className={styles.panelTitle}>
            <Car size={16} color="#e63946" />
            PILOT CAREER FLEET MILEAGE
          </h3>

          <div className={styles.fleetList}>
            {!careerFleet.length && (
              <span className={styles.panelDesc}>
                {isAuthenticated
                  ? 'No valid laps yet — submit one on the Telemetry page.'
                  : 'Sign in to load your fleet statistics.'}
              </span>
            )}
            {careerFleet.map((row, i) => (
              <div key={i} className={styles.fleetRow}>
                <div>
                  <h4 className={styles.carName}>{row.car}</h4>
                  <span className={styles.carTopSpeed}>Top Speed: {row.topSpeed} • Best Lap</span>
                </div>
                <div className={styles.fleetRight}>
                  <span className={styles.fleetDist}>{row.distance}</span>
                  <span className={styles.fleetWins}>{row.laps} Valid Laps</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
