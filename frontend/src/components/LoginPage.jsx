import { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

const API_BASE = 'http://localhost:5000';

function LoginPage() {
  const [mode, setMode] = useState('magic'); // 'magic' or 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const [loading, setLoading] = useState(false);

  async function handleMagicLink() {
    if (!email) return setStatus({ type: 'error', message: 'Please enter your email.' });
    setLoading(true);
    setStatus(null);
    try {
      await axios.post(`${API_BASE}/api/auth/magic-link`, { email });
      setStatus({ type: 'success', message: `Magic link sent to ${email}. Check your inbox.` });
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong.';
      const retry = err.response?.data?.retryAfterSeconds;
      setStatus({ type: 'error', message: retry ? `${msg} Try again in ${retry}s.` : msg });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordLogin() {
    if (!email || !password) return setStatus({ type: 'error', message: 'Please enter email and password.' });
    setLoading(true);
    setStatus(null);
    try {
      await axios.post(`${API_BASE}/api/auth/login`, { email, password }, { withCredentials: true });
      window.location.href = '/';
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Invalid credentials.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">✈️</div>
        <h1 className="login-title">Aerolog</h1>
        <p className="login-subtitle">Parental digital wellness dashboard</p>

        <div className="login-tabs">
          <button
            className={`tab-btn ${mode === 'magic' ? 'active' : ''}`}
            onClick={() => { setMode('magic'); setStatus(null); }}
          >
            Magic Link
          </button>
          <button
            className={`tab-btn ${mode === 'password' ? 'active' : ''}`}
            onClick={() => { setMode('password'); setStatus(null); }}
          >
            Password
          </button>
        </div>

        <div className="login-form">
          <input
            className="login-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') mode === 'magic' ? handleMagicLink() : handlePasswordLogin();
            }}
          />

          {mode === 'password' && (
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePasswordLogin(); }}
            />
          )}

          {status && (
            <div className={`login-status ${status.type}`}>
              {status.message}
            </div>
          )}

          <button
            className="login-btn"
            onClick={mode === 'magic' ? handleMagicLink : handlePasswordLogin}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'magic' ? 'Send Magic Link' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;