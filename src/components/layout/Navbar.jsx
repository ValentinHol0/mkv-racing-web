import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Gauge,
  Server,
  Car,
  LineChart,
  User,
  Terminal,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAuthenticated, user, openAuthModal, logout } = useAppStore();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Gauge },
    { to: '/servers', label: 'Servers', icon: Server },
    { to: '/garage', label: 'Garage', icon: Car },
    { to: '/statistics', label: 'Telemetry', icon: LineChart },
    { to: '/profile', label: 'Pilot Profile', icon: User },
    { to: '/logs', label: 'Console Logs', icon: Terminal },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Logo */}
        <NavLink to="/" className={styles.brand}>
          <div className={styles.brandLogo}>MKV</div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>
              MKV RACING
              <span className={styles.acBadge}>AC</span>
            </span>
            <span className={styles.brandSubtitle}>Telemetry & Infrastructure</span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav className={styles.nav}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <Icon size={16} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Auth CTA / User Profile */}
        <div className={styles.authSection}>
          {isAuthenticated ? (
            <div className={styles.authSection}>
              <div className={styles.pilotInfo}>
                <span className={styles.pilotCallsign}>
                  <ShieldCheck size={14} color="#10b981" />
                  {user?.callsign || user?.name}
                </span>
                <span className={styles.pilotTier}>{user?.tier || 'Level 42 Pro Tier'}</span>
              </div>
              <Badge variant="online" dot>
                ONLINE
              </Badge>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                title="Log out"
                data-testid="logout-btn"
              >
                <LogOut size={14} />
                <span>Exit</span>
              </Button>
            </div>
          ) : (
            <div className={styles.authSection}>
              <Badge variant="warning">GUEST</Badge>
              <Button
                variant="primary"
                size="sm"
                onClick={openAuthModal}
                data-testid="open-auth-btn"
              >
                <LogIn size={14} />
                <span>Pilot Auth</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
