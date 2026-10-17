import React from 'react';
import { ShieldCheck, CheckCircle, Car, Key } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

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
    <div className="space-y-6 pb-8" data-testid="profile-page">
      {/* Pilot Profile Banner */}
      <div className="bg-gradient-to-r from-cyber-surface via-cyber-card to-cyber-surface border border-cyber-border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-racing-red to-red-950 border border-racing-red/60 flex items-center justify-center text-3xl font-racing font-bold text-white shadow-xl shadow-racing-red/20">
            {activePilot.callsign ? activePilot.callsign.substring(0, 2).toUpperCase() : 'VH'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="tier">{activePilot.tier}</Badge>
              <Badge variant="online" dot>
                STEAM LINKED
              </Badge>
            </div>
            <h1 className="text-2xl font-racing font-bold text-slate-100 tracking-wide">
              {activePilot.callsign}
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Pilot: <strong className="text-slate-300">{activePilot.name}</strong> • SteamID:{' '}
              <span className="text-cyan-400">{activePilot.steamId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-cyber-slate/90 p-3.5 rounded-xl border border-cyber-border font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">SAFETY RATING</span>
            <span className="text-xl font-racing font-bold text-emerald-400">
              {activePilot.safetyScore}%
            </span>
          </div>
          <div className="h-8 w-px bg-cyber-border" />
          <div>
            <span className="text-[10px] text-slate-400 block">PACE INDEX</span>
            <span className="text-xl font-racing font-bold text-cyan-400">
              {activePilot.paceScore || 94.2}%
            </span>
          </div>
          <div className="h-8 w-px bg-cyber-border" />
          <div>
            <span className="text-[10px] text-slate-400 block">TOTAL LOGGED</span>
            <span className="text-xl font-racing font-bold text-amber-400">
              14,820 <span className="text-xs text-slate-400">km</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Steam OpenID 2.0 & DLC Licenses */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-racing font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Steam OpenID 2.0 SSO Validation
              </h3>
              <Badge variant="online">VERIFIED</Badge>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Cryptographically signed tokens certify ownership of required Kunos DLC packages.
            </p>

            <div className="space-y-2 pt-2 border-t border-cyber-border/70 text-xs font-mono">
              {dlcLicenses.map((dlc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-cyber-card/60 rounded border border-cyber-border/40"
                >
                  <span className="text-slate-300">{dlc.name}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              ))}
            </div>

            {!isAuthenticated && (
              <div className="pt-2">
                <Button variant="steam" size="sm" fullWidth onClick={openAuthModal}>
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>Re-authenticate via Steam OpenID</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Fleet Career Milestones */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-racing font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Car className="w-4 h-4 text-racing-red" />
              PILOT CAREER FLEET MILEAGE
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              {careerFleet.map((row, i) => (
                <div
                  key={i}
                  className="p-3 bg-cyber-card/70 border border-cyber-border/60 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-100 font-racing text-sm">{row.car}</h4>
                    <span className="text-[10px] text-slate-400">Top Speed: {row.topSpeed}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">{row.distance}</span>
                    <span className="text-[10px] text-amber-400">{row.wins} Podium Finishes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
