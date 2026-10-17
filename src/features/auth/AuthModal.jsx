import React, { useState } from 'react';
import { Mail, Lock, Key, ShieldCheck } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAppStore } from '../../store/useAppStore';

export function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { isAuthModalOpen, closeAuthModal, login } = useAppStore();

  const openState = isOpen !== undefined ? isOpen : isAuthModalOpen;
  const handleClose = onClose || closeAuthModal;

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Invalid email address format';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const userData = {
        name: email.split('@')[0],
        email,
        callsign: 'ApexPredator_UA',
        tier: 'Level 42 Pro Tier',
        safetyScore: 98.4,
      };

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      } else {
        login(userData);
      }

      setLoading(false);
      handleClose();
    }, 250);
  };

  const handleSteamLogin = () => {
    const steamUser = {
      name: 'Valentin Holomidov',
      email: 'valentingolomidov@gmail.com',
      callsign: 'ApexPredator_UA',
      steamId: '76561198000000001',
      tier: 'Level 42 Pro Tier',
      safetyScore: 98.4,
    };

    if (onLoginSuccess) {
      onLoginSuccess(steamUser);
    } else {
      login(steamUser);
    }

    handleClose();
  };

  return (
    <Modal isOpen={openState} onClose={handleClose} title="MKV RACING PILOT AUTHENTICATION">
      <div className="space-y-5" data-testid="auth-modal">
        <p className="text-xs font-mono text-slate-400">
          Sign in via Steam OpenID 2.0 to sync Kunos licenses, or enter your pilot credentials.
        </p>

        {/* Steam SSO Quick Action */}
        <Button
          variant="steam"
          fullWidth
          size="md"
          onClick={handleSteamLogin}
          data-testid="steam-sso-btn"
        >
          <Key className="w-4 h-4 text-cyan-400" />
          <span>Sign In With Steam OpenID 2.0</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-cyber-border flex-1" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">OR VIA CREDENTIALS</span>
          <div className="h-px bg-cyber-border flex-1" />
        </div>

        {/* Traditional Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="auth-email-input"
            label="Pilot Email / Callsign"
            type="email"
            placeholder="pilot@mkvracing.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={Mail}
            data-testid="email-input"
          />

          <Input
            id="auth-password-input"
            label="Access Token / Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={Lock}
            data-testid="password-input"
          />

          <div className="pt-2 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClose}
              data-testid="cancel-btn"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
              data-testid="login-submit-btn"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{loading ? 'Authenticating...' : 'Authorize Pilot'}</span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
