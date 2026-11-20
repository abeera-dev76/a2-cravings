import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faShieldHalved,
  faArrowLeft,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import { adminLogin, getAdminToken } from '../../services/api';
import { navigate } from '../../utils/navigation';
import './admin.css';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If already authenticated, redirect to /admin immediately
  useEffect(() => {
    if (getAdminToken()) {
      navigate('/admin');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your admin email and password.');
      return;
    }

    setLoading(true);
    try {
      await adminLogin(email.trim(), password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-brand-badge">
            <FontAwesomeIcon icon={faShieldHalved} />
            <span>Staff Portal</span>
          </div>
          <h1 className="admin-login-title">A2 CRAVINGS</h1>
          <p className="admin-login-subtitle">Admin & Kitchen Management Portal</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="admin-alert-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-email">
              Admin Email
            </label>
            <div className="admin-input-wrap">
              <FontAwesomeIcon icon={faEnvelope} className="admin-input-icon" />
              <input
                id="admin-email"
                type="email"
                className="admin-input"
                placeholder="admin@a2cravings.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-password">
              Password
            </label>
            <div className="admin-input-wrap">
              <FontAwesomeIcon icon={faLock} className="admin-input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-toggle-pwd-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faCircleNotch} spin />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <a
          href="/"
          className="admin-back-link"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Return to Customer Website</span>
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
