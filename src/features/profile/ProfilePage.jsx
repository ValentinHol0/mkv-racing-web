import React from 'react';
import { ShieldCheck, CheckCircle, Car, Key } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { user, isAuthenticated, openAuthModal } = useAppStore();

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

  const careerFleet = [
    { car: 'Toyota Supra MKV (A90)', distance: '6,420 km', topSpeed: '335 km/h', wins: 28 },
    { car: 'Porsche 911 GT3 RS (992)', distance: '4,110 km', topSpeed: '296 km/h', wins: 19 },
    { car: 'BMW M5 CS (F90)', distance: '2,890 km', topSpeed: '305 km/h', wins: 12 },
    { car: 'Audi R8 V10 Performance', distance: '1,400 km', topSpeed: '331 km/h', wins: 6 },
  ];

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
            <span className={styles.capsuleLabel}>PACE INDEX</span>
            <span className={styles.capsuleValue} style={{ color: 'var(--color-cyan)' }}>
              {activePilot.paceScore || 94.2}%
            </span>
          </div>
          <div className={styles.capsuleDivider} />
          <div className={styles.capsuleItem}>
            <span className={styles.capsuleLabel}>TOTAL LOGGED</span>
            <span className={styles.capsuleValue} style={{ color: 'var(--color-amber)' }}>
              14,820 <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>km</span>
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
              <Button variant="steam" size="sm" fullWidth onClick={openAuthModal}>
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
            {careerFleet.map((row, i) => (
              <div key={i} className={styles.fleetRow}>
                <div>
                  <h4 className={styles.carName}>{row.car}</h4>
                  <span className={styles.carTopSpeed}>Top Speed: {row.topSpeed}</span>
                </div>
                <div className={styles.fleetRight}>
                  <span className={styles.fleetDist}>{row.distance}</span>
                  <span className={styles.fleetWins}>{row.wins} Podium Finishes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
