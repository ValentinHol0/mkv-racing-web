import React from 'react';
import { LineChart, Timer, Activity, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../../components/common/Badge';

export function StatisticsPage() {
  const { telemetry } = useAppStore();

  const sectorSplits = [
    {
      sector: 'Sector 1 (Kasumigaseki Tunnel)',
      delta: '-0.142s',
      time: '42.110s',
      status: 'optimal',
    },
    {
      sector: 'Sector 2 (Shibaura Junction)',
      delta: '+0.080s',
      time: '55.340s',
      status: 'caution',
    },
    {
      sector: 'Sector 3 (Rainbow Bridge S-Curves)',
      delta: '-0.230s',
      time: '1:12.890',
      status: 'optimal',
    },
    {
      sector: 'Sector 4 (Bayshore Wangan Sprint)',
      delta: '-0.410s',
      time: '57.870s',
      status: 'optimal',
    },
  ];

  return (
    <div className="space-y-6 pb-8" data-testid="statistics-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="emerald">CSP TELEMETRY RECORDER</Badge>
            <Badge variant="online" dot>
              LIVE SAMPLING (40Hz)
            </Badge>
          </div>
          <h1 className="text-2xl font-racing font-bold text-slate-100 tracking-wide flex items-center gap-2.5">
            <LineChart className="w-6 h-6 text-racing-red" />
            TELEMETRY ANALYTICS & SECTOR TIMINGS
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Lateral G curves, Shuto C1 loop sector splits, and pilot safety rating index
          </p>
        </div>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block">BEST LAP (SHUTO C1)</span>
          <span className="text-2xl font-racing font-bold text-slate-100">3:48.210</span>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
            Personal Record • Toyota Supra MKV
          </span>
        </div>

        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block">PEAK LATERAL G</span>
          <span className="text-2xl font-racing font-bold text-cyan-400">1.68 G</span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            Rainbow Bridge entry curve
          </span>
        </div>

        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block">SAFETY RATING INDEX</span>
          <span className="text-2xl font-racing font-bold text-emerald-400">98.4%</span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            0 incidents across 14 sessions
          </span>
        </div>

        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block">MAX SPEED LOGGED</span>
          <span className="text-2xl font-racing font-bold text-racing-red">324 km/h</span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            Bayshore Straight 6th Gear
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shuto C1 Sector Timing Splits */}
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-racing font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Timer className="w-4 h-4 text-cyan-400" />
              Shuto Expressway C1 Sector Breakdown
            </h3>
            <Badge variant="cyan">GPS GAUGE</Badge>
          </div>

          <div className="space-y-2.5">
            {sectorSplits.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-cyber-card/70 border border-cyber-border/60 rounded-lg flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="text-slate-200 font-medium block">{item.sector}</span>
                  <span className="text-[10px] text-slate-500">Benchmark comparison</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-100 font-bold block">{item.time}</span>
                  <span
                    className={`text-[11px] font-bold ${
                      item.delta.startsWith('-') ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {item.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-cyber-slate rounded-lg border border-cyber-border text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Theoretical Best Time:</span>
            <strong className="text-emerald-400 text-sm">3:47.510</strong>
          </div>
        </div>

        {/* Lateral G & Telemetry Curve Display */}
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-racing font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-racing-red" />
              Live Lateral G Telemetry Stream
            </h3>
            <Badge variant="online" dot>
              {telemetry.lateralG} G
            </Badge>
          </div>

          {/* Visual G-Force Bar Chart Representation */}
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Left Turn Cornering G</span>
                <span className="text-cyan-400 font-bold">
                  {Math.max(0, (telemetry.lateralG - 0.5).toFixed(2))} G
                </span>
              </div>
              <div className="w-full h-3 bg-cyber-slate rounded border border-cyber-border overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-75"
                  style={{ width: `${Math.min(100, (telemetry.lateralG / 2) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Right Turn Cornering G</span>
                <span className="text-emerald-400 font-bold">
                  {Math.max(0, (2 - telemetry.lateralG).toFixed(2))} G
                </span>
              </div>
              <div className="w-full h-3 bg-cyber-slate rounded border border-cyber-border overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-75"
                  style={{ width: `${Math.min(100, ((2 - telemetry.lateralG) / 2) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Throttle Telemetry Level</span>
                <span className="text-racing-red font-bold">
                  {Math.round((telemetry.speed / 340) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-cyber-slate rounded border border-cyber-border overflow-hidden">
                <div
                  className="h-full bg-racing-red transition-all duration-75"
                  style={{ width: `${(telemetry.speed / 340) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-cyber-border/70 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Tire Temp: FL 88°C • FR 91°C • RL 94°C • RR 93°C
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
