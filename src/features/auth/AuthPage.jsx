import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Key,
  ShieldCheck,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowLeft,
  User,
} from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Alert } from '../../components/common/Alert';
import { useAuth } from '../../hooks/useAuth';
import styles from './AuthPage.module.css';

export function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signInWithSteam, register } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [callsign, setCallsign] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Pilot email or callsign is required';
    } else if (!/\S+@\S+\.\S+/.test(email) && (isRegister || !email.includes('_'))) {
      errs.email = 'Enter a valid email address or callsign';
    }

    if (isRegister && !/^[A-Za-z0-9_]{3,20}$/.test(callsign)) {
      errs.callsign = 'Callsign: 3-20 chars, letters, digits or _';
    }

    if (!password) {
      errs.password = 'Password or security token is required';
    } else if (password.length < 6) {
      errs.password = 'Security token must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Запит до API через хук useAuth; помилки валідації сервера підсвічують поля форми
  const runAuth = async (request) => {
    setLoading(true);
    setServerError(null);
    try {
      await request();
      navigate('/');
    } catch (err) {
      setErrors((prev) => ({ ...prev, ...err.fields }));
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    runAuth(() => (isRegister ? register({ email, callsign, password }) : signIn(email, password)));
  };

  const handleSteamLogin = () => runAuth(() => signInWithSteam());

  const handleQuickFill = () => {
    setMode('login');
    setEmail('pilot@mkvracing.com');
    setPassword('TelemetryToken2026!');
    setErrors({});
    setServerError(null);
  };

  const toggleMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setErrors({});
    setServerError(null);
  };

  return (
    <div className={styles.pageWrapper} data-testid="auth-page">
      <div className={styles.container}>
        {/* Left Hero Telemetry Panel */}
        <div className={styles.heroSection}>
          <div className={styles.heroHeader}>
            <div className={styles.badgeGroup}>
              <Badge variant="cyan">SECURITY GATEWAY</Badge>
              <Badge variant="online" dot>
                KUNOS DRM READY
              </Badge>
            </div>
            <h1 className={styles.heroTitle}>
              MKV RACING <span className={styles.heroHighlight}>{'//'}</span> PILOT AUTHENTICATION
            </h1>
            <p className={styles.heroDesc}>
              Single-sign-on verification protocol for Content Manager, CSP Physics Engine v1.79,
              and high-frequency telemetry telemetry servers.
            </p>
          </div>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIconBox}>
                <Key size={14} color="#06b6d4" />
              </div>
              <div className={styles.featureText}>
                <span className={styles.featureTitle}>Steam OpenID 2.0 Identity Binding</span>
                <span className={styles.featureDesc}>
                  Automated validation of Assetto Corsa Ultimate Edition and Japanese Pack DLC
                  licenses.
                </span>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconBox}>
                <Cpu size={14} color="#10b981" />
              </div>
              <div className={styles.featureText}>
                <span className={styles.featureTitle}>SHA-256 Telemetry Mesh Checksum</span>
                <span className={styles.featureDesc}>
                  Prevents physics manipulation and synchronizes car setup data with the server
                  node.
                </span>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconBox}>
                <Zap size={14} color="#f59e0b" />
              </div>
              <div className={styles.featureText}>
                <span className={styles.featureTitle}>Persistent Session State</span>
                <span className={styles.featureDesc}>
                  Zustand global store syncs pilot callsign, safety index (98.4%), and garage roster
                  across pages.
                </span>
              </div>
            </div>
          </div>

          <div className={styles.heroFooter}>
            <span className={styles.protocolText}>PROTOCOL: AC_AUTH_V2 // 2026</span>
            <Link to="/servers" className={styles.backLink}>
              <ArrowLeft size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Browse Public Nodes
            </Link>
          </div>
        </div>

        {/* Right Authentication Form */}
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {isRegister ? 'NEW PILOT LICENSE' : 'COCKPIT ACCESS'}
            </h2>
            <p className={styles.formSubtitle}>
              {isRegister
                ? 'Register a pilot account. New pilots start with a Rookie license (class B cars).'
                : 'Authenticate your pilot account to join servers and access private garage telemetry.'}
            </p>
          </div>

          {/* Steam SSO Primary Action */}
          <Button
            variant="steam"
            fullWidth
            size="md"
            onClick={handleSteamLogin}
            disabled={loading}
            data-testid="page-steam-login-btn"
          >
            <Key size={16} color="#06b6d4" />
            <span>Sign In via Steam OpenID 2.0</span>
          </Button>

          <div className={styles.dividerContainer}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>OR PILOT CREDENTIALS</span>
            <div className={styles.dividerLine} />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.quickFillRow}>
              <button
                type="button"
                className={styles.quickFillBtn}
                onClick={handleQuickFill}
                data-testid="quick-fill-btn"
              >
                Use Demo Credentials
              </button>
              <button
                type="button"
                className={styles.quickFillBtn}
                onClick={toggleMode}
                data-testid="toggle-register-btn"
              >
                {isRegister ? 'I already have an account' : 'Create Pilot Account'}
              </button>
            </div>

            <Input
              id="auth-page-email"
              label="Pilot Email or Callsign"
              type="text"
              placeholder="e.g. pilot@mkvracing.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={Mail}
              data-testid="page-email-input"
            />

            {isRegister && (
              <Input
                id="auth-page-callsign"
                label="Pilot Callsign"
                type="text"
                placeholder="e.g. ApexPredator_UA"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                error={errors.callsign}
                icon={User}
                data-testid="page-callsign-input"
              />
            )}

            <Input
              id="auth-page-password"
              label="Security Token / Passkey"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={Lock}
              data-testid="page-password-input"
            />

            {serverError && <Alert data-testid="page-auth-error">{serverError}</Alert>}

            <div className={styles.securityNote}>
              <CheckCircle2 size={14} color="#10b981" />
              <span>TLS 1.3 encrypted handoff to Content Manager</span>
            </div>

            <div className={styles.submitActions}>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                disabled={loading}
                data-testid="page-submit-login-btn"
              >
                <ShieldCheck size={16} />
                <span>
                  {loading
                    ? 'Verifying Credentials...'
                    : isRegister
                      ? 'Register Pilot Account'
                      : 'Authorize Cockpit Session'}
                </span>
              </Button>

              <div className={styles.backLinkContainer}>
                <span>Want to inspect telemetry without sign in?</span>
                <Link to="/" className={styles.backLink}>
                  Guest Telemetry Hub
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
