import React, { useState } from 'react';
import { Server, Filter, Radio } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ServerCard } from '../dashboard/ServerCard';
import { Badge } from '../../components/common/Badge';

export function ServersPage() {
  const { servers } = useAppStore();
  const [regionFilter, setRegionFilter] = useState('ALL');

  const filteredServers = servers.filter((srv) => {
    if (regionFilter === 'ALL') return true;
    return srv.region.toUpperCase().includes(regionFilter);
  });

  return (
    <div className="space-y-6 pb-8" data-testid="servers-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="cyan">DAEMON v0.1.77</Badge>
            <Badge variant="online" dot>
              CLUSTER HEALTHY
            </Badge>
          </div>
          <h1 className="text-2xl font-racing font-bold text-slate-100 tracking-wide flex items-center gap-2.5">
            <Server className="w-6 h-6 text-racing-red" />
            SERVER CLUSTERS & NETWORK NODES
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Real-time node telemetry, CSP bubble sync (300m), tick rate allocation, and Content
            Manager launcher
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-2 bg-cyber-surface p-1.5 rounded-lg border border-cyber-border">
          <Filter className="w-4 h-4 text-slate-400 ml-1.5" />
          <button
            onClick={() => setRegionFilter('ALL')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              regionFilter === 'ALL'
                ? 'bg-racing-red text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Nodes
          </button>
          <button
            onClick={() => setRegionFilter('JAPAN')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              regionFilter === 'JAPAN'
                ? 'bg-racing-red text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Japan SRP
          </button>
          <button
            onClick={() => setRegionFilter('GEORGIA')}
            className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
              regionFilter === 'GEORGIA'
                ? 'bg-racing-red text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Georgia Tbilisi
          </button>
        </div>
      </div>

      {/* Cluster Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block">TOTAL ONLINE PILOTS</span>
          <span className="text-2xl font-racing font-bold text-slate-100">80 / 240</span>
          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
            Overbooking max capacity active
          </span>
        </div>
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block">AVERAGE LATENCY</span>
          <span className="text-2xl font-racing font-bold text-emerald-400">25 ms</span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            Direct EU/UA peering
          </span>
        </div>
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block">NETWORK BUBBLE</span>
          <span className="text-2xl font-racing font-bold text-cyan-400">300 m</span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            CSP dynamic culling
          </span>
        </div>
        <div className="bg-cyber-surface border border-cyber-border rounded-xl p-4">
          <span className="text-[10px] font-mono text-slate-400 block">INTEGRITY GUARD</span>
          <span className="text-2xl font-racing font-bold text-amber-400">SHA-256</span>
          <span className="text-[10px] font-mono text-slate-400 mt-1 block">
            Zero checksum mismatches
          </span>
        </div>
      </div>

      {/* Server List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredServers.map((srv) => (
          <ServerCard key={srv.id} server={srv} />
        ))}
      </div>

      {/* Technical Protocol Notes */}
      <div className="bg-cyber-card border border-cyber-border rounded-xl p-5 text-xs font-mono text-slate-400 space-y-2">
        <h4 className="font-bold text-slate-200 flex items-center gap-2 font-racing text-sm">
          <Radio className="w-4 h-4 text-racing-red" />
          ASSETTO CORSA PROTOCOL HANDOFF ARCHITECTURE
        </h4>
        <p>
          Clicking the &quot;Connect&quot; button invokes the custom client scheme{' '}
          <code className="text-racing-red font-bold">acmanager://ui/quick/server?...</code>. This
          instructs Content Manager to immediately acquire missing track configs, check local car
          hashes against the server manifest, launch the Kunos 64-bit physics core, and connect via
          UDP ports without manual IP entry.
        </p>
      </div>
    </div>
  );
}
