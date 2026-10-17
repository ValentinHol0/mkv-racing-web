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
    <header className="sticky top-0 z-40 w-full border-b border-cyber-border bg-cyber-slate/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-racing-red to-red-800 flex items-center justify-center font-racing font-bold text-xl text-white shadow-lg shadow-racing-red/20 group-hover:scale-105 transition-transform">
            MKV
          </div>
          <div className="flex flex-col">
            <span className="font-racing font-bold text-lg tracking-wider text-slate-100 flex items-center gap-1.5">
              MKV RACING
              <span className="text-[10px] bg-racing-red/20 text-racing-red border border-racing-red/30 px-1 rounded font-mono">
                AC
              </span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest -mt-1">
              Telemetry & Infrastructure
            </span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono tracking-wider transition-colors ${
                    isActive
                      ? 'bg-cyber-surface text-racing-red border border-racing-red/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-surface/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Auth CTA / User Profile */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-mono font-medium text-slate-200 flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {user?.callsign || user?.name}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {user?.tier || 'Level 42 Pro Tier'}
                </span>
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
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="warning">GUEST</Badge>
              <Button
                variant="primary"
                size="sm"
                onClick={openAuthModal}
                data-testid="open-auth-btn"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Pilot Auth</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
