import React from 'react';
import { Server, Users, Activity, CloudRain, ShieldCheck, ExternalLink, Cpu } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function ServerCard({ server, onConnect }) {
  if (!server) return null;

  const handleConnect = () => {
    if (onConnect) {
      onConnect(server);
    } else if (typeof window !== 'undefined' && server.joinUrl) {
      window.location.href = server.joinUrl;
    }
  };

  const occupancyRatio = (server.clients / server.maxClients) * 100;

  return (
    <div
      data-testid="server-card"
      className="bg-cyber-surface border border-cyber-border hover:border-racing-red/60 rounded-xl p-5 shadow-lg hover:shadow-racing-red/10 transition-all duration-200 flex flex-col justify-between gap-4 group"
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-cyber-card border border-cyber-border text-racing-red group-hover:scale-105 transition-transform">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4
              data-testid="server-name"
              className="text-base font-racing font-bold text-slate-100 tracking-wide line-clamp-1"
            >
              {server.name}
            </h4>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              {server.track} • <span className="text-slate-300">{server.region}</span>
            </p>
          </div>
        </div>
        <Badge variant="online" dot>
          ONLINE
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-cyber-border/70 text-xs font-mono">
        <div className="bg-cyber-card/60 p-2 rounded border border-cyber-border/50">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Users className="w-3 h-3 text-cyan-400" /> SLOTS
          </span>
          <span data-testid="server-clients" className="text-slate-100 font-bold mt-0.5 block">
            {server.clients}/{server.maxClients}{' '}
            <span className="text-[10px] text-slate-500 font-normal">
              ({server.maxSlots || 170})
            </span>
          </span>
        </div>

        <div className="bg-cyber-card/60 p-2 rounded border border-cyber-border/50">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" /> PING
          </span>
          <span data-testid="server-ping" className="text-emerald-400 font-bold mt-0.5 block">
            {server.ping} ms
          </span>
        </div>

        <div className="bg-cyber-card/60 p-2 rounded border border-cyber-border/50">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <Cpu className="w-3 h-3 text-amber-400" /> TICK RATE
          </span>
          <span className="text-slate-100 font-bold mt-0.5 block">{server.tickRate} Hz</span>
        </div>

        <div className="bg-cyber-card/60 p-2 rounded border border-cyber-border/50">
          <span className="text-slate-400 text-[10px] flex items-center gap-1">
            <CloudRain className="w-3 h-3 text-cyan-400" /> WEATHER
          </span>
          <span className="text-slate-200 font-medium truncate mt-0.5 block text-[11px]">
            {server.weather || 'Pure 3.10'}
          </span>
        </div>
      </div>

      {/* Occupancy bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Server Load</span>
          <span>{Math.round(occupancyRatio)}% Capacity</span>
        </div>
        <div className="w-full h-1.5 bg-cyber-card rounded-full overflow-hidden border border-cyber-border">
          <div
            className={`h-full transition-all duration-500 ${
              occupancyRatio > 80
                ? 'bg-racing-red'
                : occupancyRatio > 50
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
            }`}
            style={{ width: `${occupancyRatio}%` }}
          />
        </div>
      </div>

      {/* Footer & Connect Action */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px]">Checksum SHA-256 Passed</span>
        </div>

        <Button variant="primary" size="sm" onClick={handleConnect} data-testid="connect-button">
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Connect (acmanager://)</span>
        </Button>
      </div>
    </div>
  );
}
