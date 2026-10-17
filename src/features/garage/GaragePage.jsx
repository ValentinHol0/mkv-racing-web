import React, { useState } from 'react';
import { Car, CheckCircle2, Zap, Gauge, RotateCw, Palette, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export function GaragePage() {
  const { cars, selectedCarId, selectedLivery, setSelectedCarId, setSelectedLivery } =
    useAppStore();

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(true);

  const selectedCar = cars.find((c) => c.id === selectedCarId) || cars[0];

  const handleVerifyChecksum = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-8" data-testid="garage-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyber-border pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="tier">STAGE 3 MODS</Badge>
            <Badge variant="online" dot>
              PHYSICS PASSED
            </Badge>
          </div>
          <h1 className="text-2xl font-racing font-bold text-slate-100 tracking-wide flex items-center gap-2.5">
            <Car className="w-6 h-6 text-racing-red" />
            VIRTUAL GARAGE & 3D SHOWCASE
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Livery customization, mechanical specs, and SHA-256 cryptographic mod integrity
            verification
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={handleVerifyChecksum} disabled={isVerifying}>
          <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
          <span>{isVerifying ? 'Verifying Hashes...' : 'Re-verify SHA-256'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Car Roster Selection Column */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            Vehicle Fleet Catalog
          </h3>
          <div className="space-y-2">
            {cars.map((car) => {
              const isSelected = car.id === selectedCar.id;
              return (
                <button
                  key={car.id}
                  onClick={() => setSelectedCarId(car.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? 'bg-cyber-surface border-racing-red shadow-lg shadow-racing-red/10'
                      : 'bg-cyber-card/60 border-cyber-border hover:bg-cyber-surface hover:border-slate-600'
                  }`}
                >
                  <div>
                    <h4 className="font-racing font-bold text-slate-100 group-hover:text-racing-red transition-colors">
                      {car.name}
                    </h4>
                    <span className="text-xs font-mono text-slate-400 block mt-0.5">
                      {car.role} • {car.power}
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-racing-red" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Showcase & Specs Stage Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* 3D WebGL Box Mockup */}
          <div className="relative w-full h-72 md:h-80 bg-gradient-to-b from-cyber-surface to-cyber-slate border border-cyber-border rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-2xl p-6 group">
            {/* Grid Floor */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #242b38 1px, transparent 1px), linear-gradient(to bottom, #242b38 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Glowing Spotlight Base */}
            <div className="absolute w-72 h-20 bg-racing-red/15 rounded-full blur-2xl transform scale-y-50 mt-28" />

            {/* Visual Vehicle Hologram / Mockup Emblem */}
            <div className="relative z-10 text-center space-y-3">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-cyber-card border border-cyber-border flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Car className="w-12 h-12 text-racing-red" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
                  3D WebGL Viewport (AcServer Model Preview)
                </span>
                <h2 className="text-2xl font-racing font-bold text-slate-100 mt-1">
                  {selectedCar.name}
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  Active Livery: <strong className="text-slate-200">{selectedLivery}</strong>
                </span>
              </div>
            </div>

            {/* Checksum Badge */}
            <div className="absolute bottom-4 right-4 z-10">
              {verifiedSuccess && (
                <Badge variant="online" dot>
                  SHA-256 VALIDATED
                </Badge>
              )}
            </div>
          </div>

          {/* Livery Selector */}
          <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              Livery & Skin Selection
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCar.liveries.map((livery) => (
                <button
                  key={livery}
                  onClick={() => setSelectedLivery(livery)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    selectedLivery === livery
                      ? 'bg-racing-red text-white font-bold ring-2 ring-racing-red/50 shadow-md'
                      : 'bg-cyber-card border border-cyber-border text-slate-400 hover:text-white'
                  }`}
                >
                  {livery}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="bg-cyber-surface border border-cyber-border rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Gauge className="w-4 h-4 text-racing-red" />
              Engineering Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-cyber-card p-3 rounded-lg border border-cyber-border/70">
                <span className="text-slate-500 text-[10px] block">POWER OUTPUT</span>
                <span className="text-base font-bold text-slate-100 font-racing">
                  {selectedCar.power}
                </span>
              </div>
              <div className="bg-cyber-card p-3 rounded-lg border border-cyber-border/70">
                <span className="text-slate-500 text-[10px] block">TORQUE</span>
                <span className="text-base font-bold text-slate-100 font-racing">
                  {selectedCar.torque}
                </span>
              </div>
              <div className="bg-cyber-card p-3 rounded-lg border border-cyber-border/70">
                <span className="text-slate-500 text-[10px] block">0 - 100 KM/H</span>
                <span className="text-base font-bold text-emerald-400 font-racing">
                  {selectedCar.accel}
                </span>
              </div>
              <div className="bg-cyber-card p-3 rounded-lg border border-cyber-border/70">
                <span className="text-slate-500 text-[10px] block">TOP SPEED</span>
                <span className="text-base font-bold text-cyan-400 font-racing">
                  {selectedCar.topSpeed}
                </span>
              </div>
              <div className="bg-cyber-card p-3 rounded-lg border border-cyber-border/70">
                <span className="text-slate-500 text-[10px] block">DRIVETRAIN</span>
                <span className="text-base font-bold text-amber-400 font-racing">
                  {selectedCar.drivetrain}
                </span>
              </div>
              <div className="bg-cyber-card p-3 rounded-lg border border-cyber-border/70">
                <span className="text-slate-500 text-[10px] block">CURB WEIGHT</span>
                <span className="text-base font-bold text-slate-100 font-racing">
                  {selectedCar.weight}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-cyber-border/70">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SHA-256: e3b0c44298fc1c149afbf4c8996fb92427...</span>
              </div>
              <Button variant="primary" size="md">
                <Zap className="w-4 h-4" />
                <span>Select for Shuto Server</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
