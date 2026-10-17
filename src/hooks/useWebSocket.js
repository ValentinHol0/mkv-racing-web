import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';

/**
 * Custom hook managing real-time WebSocket telemetry (40 Hz CSP updates).
 */
export function useWebSocket(_url = 'ws://localhost:9601/telemetry') {
  const [status] = useState('CONNECTED');
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: '19:04:12.102',
      level: 'INFO',
      message: 'AssettoServer v0.1.77 listening on UDP/TCP 9601 (Tick: 40Hz, Bubble: 300m)',
    },
    {
      id: 2,
      time: '19:04:14.340',
      level: 'INFO',
      message: 'CSP Batched Packet System enabled for 48 active pilot slots',
    },
    {
      id: 3,
      time: '19:04:15.890',
      level: 'CHECKSUM',
      message: 'Client [Valentin Holomidov] SHA-256 Checksum Pass: toyota_supra_mkv_a90.kn5',
    },
    {
      id: 4,
      time: '19:04:18.001',
      level: 'WARN',
      message: 'Network bubble congestion near Tokyo Bayshore tunnel (AI Traffic: 42 cars)',
    },
  ]);

  const updateTelemetry = useAppStore((state) => state.updateTelemetry);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Simulated 40Hz telemetry stream for client UI rendering
    intervalRef.current = setInterval(() => {
      const baseSpeed = 270 + Math.sin(Date.now() / 1500) * 35;
      const baseRpm = 6800 + Math.sin(Date.now() / 800) * 800;
      const baseLateralG = 1.1 + Math.sin(Date.now() / 2000) * 0.45;

      updateTelemetry({
        speed: Math.round(baseSpeed),
        rpm: Math.round(baseRpm),
        lateralG: parseFloat(baseLateralG.toFixed(2)),
      });
    }, 25); // 40 Hz = 25ms

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [updateTelemetry]);

  const sendMessage = useCallback((msg) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        time: new Date().toISOString().substring(11, 23),
        level: 'CLIENT',
        message: msg,
      },
    ]);
  }, []);

  return { status, logs, sendMessage };
}
