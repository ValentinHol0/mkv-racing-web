import React from 'react';
import { Activity, Shield, Terminal, Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-cyber-border bg-cyber-slate/95 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Core telemetry specs */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Tick Rate: <strong className="text-slate-100">40 Hz (25ms)</strong>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Network Bubble: <strong className="text-slate-100">300m</strong>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-racing-red" />
            Pure Engine: <strong className="text-slate-100">Pure 3.10 Rain FX</strong>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            Protocol: <strong className="text-slate-100">acmanager://</strong>
          </span>
        </div>

        {/* Academic and project watermark */}
        <div className="text-right text-xs font-mono text-slate-500">
          <div>MKV Racing Hub • UzhNU FIT IPZ-2 (2026)</div>
          <div className="text-[10px] text-slate-600">
            AssettoServer v0.1.77 • CSP Batched 0.1.77+ • React 18.3.1
          </div>
        </div>
      </div>
    </footer>
  );
}
