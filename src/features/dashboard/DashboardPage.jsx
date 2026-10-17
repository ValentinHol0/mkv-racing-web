import React from 'react';
import {
  Activity,
  Trophy,
  Navigation,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ServerCard } from './ServerCard';
import { Badge } from '../../components/common/Badge';

export function DashboardPage() {
  const { servers, telemetry } = useAppStore();

  const leaderboard = [
    { rank: 1, pilot: 'ApexPredator_UA', car: 'Toyota Supra MKV', lapTime: '3:48.210', gap: '--' },
    {
      rank: 2,
      pilot: 'Midnight_Rider_JP',
      car: 'Porsche 911 GT3 RS',
      lapTime: '3:49.004',
      gap: '+0.794',
    },
    { rank: 3, pilot: 'GhostRunner_Tbilisi', car: 'BMW M5 CS', lapTime: '3:51.450', gap: '+3.240' },
    { rank: 4, pilot: 'BayshoreDrifter', car: 'Audi R8 V10', lapTime: '3:53.110', gap: '+4.900' },
  ];

  return (
    <div className="space-y-6 pb-8" data-testid="dashboard-page">
      {/* Hero Welcome & Live Stream Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyber-surface via-cyber-card to-cyber-surface border border-cyber-border p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="tier">PRO TIER ACTIVE</Badge>
            <Badge variant="online" dot>
              40 Hz TELEMETRY SYNC
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-racing font-bold text-slate-100 tracking-wide">
            MKV RACING INFRASTRUCTURE CONTROL
          </h1>
          <p className="text-xs md:text-sm font-mono text-slate-400 mt-1">
            Real-time server telemetry, Content Manager 1-click launcher, and live radar tracking
          </p>
        </div>

        {/* Real-time Telemetry Capsule */}
        <div className="flex items-center gap-4 bg-cyber-slate/80 p-3 rounded-xl border border-cyber-border font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">LIVE SPEED</span>
            <span className="text-lg font-bold text-racing-red font-racing">
              {telemetry.speed} <span className="text-xs text-slate-400">km/h</span>
            </span>
          </div>
          <div className="h-8 w-px bg-cyber-border" />
          <div>
            <span className="text-[10px] text-slate-400 block">LATERAL G</span>
            <span className="text-lg font-bold text-cyan-400 font-racing">
              {telemetry.lateralG} G
            </span>
          </div>
          <div className="h-8 w-px bg-cyber-border" />
          <div>
            <span className="text-[10px] text-slate-400 block">ENGINE RPM</span>
            <span className="text-lg font-bold text-emerald-400 font-racing">{telemetry.rpm}</span>
          </div>
        </div>
      </div>

      {/* Main Server Cluster Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-racing font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-racing-red" />
            ACTIVE SERVER CLUSTERS
          </h2>
          <span className="text-xs font-mono text-slate-400">Auto-ping refresh every 5s</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {servers.map((srv) => (
            <ServerCard key={srv.id} server={srv} />
          ))}
        </div>
      </div>

      {/* Secondary Dashboard Grid: Weather, Radar, Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shuto Weather Widget */}
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-racing font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                Pure 3.10 Weather Engine
              </h3>
              <Badge variant="cyan">DYNAMIC RAIN</Badge>
            </div>
            <div className="flex items-center justify-between my-3">
              <div>
                <span className="text-3xl font-racing font-bold text-slate-100">19°C</span>
                <span className="text-xs font-mono text-slate-400 block">
                  Track: 18.2°C (Wet Road Surface)
                </span>
              </div>
              <Droplets className="w-10 h-10 text-cyan-400/80 animate-bounce" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-cyber-border/70 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Wind className="w-3.5 h-3.5 text-slate-300" /> Wind: 14 km/h SW
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Grip Coeff: 0.88
            </div>
          </div>
        </div>

        {/* Live Minimap Radar Mockup */}
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-racing font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              Live Radar (300m Bubble)
            </h3>
            <Badge variant="online" dot>
              48 BLIPS
            </Badge>
          </div>
          <div className="relative w-full h-32 bg-cyber-slate rounded-lg border border-cyber-border flex items-center justify-center overflow-hidden">
            {/* Concentric radar rings */}
            <div className="absolute inset-2 border border-emerald-500/10 rounded-full" />
            <div className="absolute inset-8 border border-emerald-500/20 rounded-full" />
            <div className="absolute inset-14 border border-emerald-500/40 rounded-full" />
            <div className="w-2.5 h-2.5 rounded-full bg-racing-red shadow-lg shadow-racing-red animate-ping" />
            {/* Dynamic radar dots */}
            <span className="absolute top-6 left-12 w-2 h-2 rounded-full bg-emerald-400" />
            <span className="absolute bottom-8 right-16 w-2 h-2 rounded-full bg-cyan-400" />
            <span className="absolute top-10 right-24 w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span className="absolute text-[10px] font-mono text-slate-400 bottom-1 left-2">
              Shuto C1 Outer Loop
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 mt-2 block text-center">
            Network Bubble: 300m Radius Around Pilot
          </span>
        </div>

        {/* Online Drivers Leaderboard */}
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-racing font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Live Leaderboard (Shuto C1)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Loop Lap</span>
          </div>
          <div className="space-y-2">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between p-1.5 bg-cyber-card/70 border border-cyber-border/40 rounded text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-4 text-center font-bold ${
                      item.rank === 1 ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    #{item.rank}
                  </span>
                  <span className="text-slate-200 font-medium">{item.pilot}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">{item.lapTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
