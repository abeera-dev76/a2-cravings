import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faEye,
  faEyeSlash,
  faArrowRight,
  faCircleNotch,
  faExclamationCircle,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { navigate } from '../utils/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import '../styles/auth.css';

export const SignUp = () => {
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // If already logged in, redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError('Full name must be at least 2 characters long.');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Please enter your phone number.');
      return false;
    }
    const phoneRegex = /^[0-9+-\s()]{7,16}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setError('Please enter a valid phone number (e.g. 03145027631).');
      return false;
    }

    if (!formData.password) {
      setError('Please enter a password.');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Sign Up | A2 CRAVINGS"
        description="Create your customer account with A2 CRAVINGS to manage orders, fast checkout, and exclusive updates."
      />
      <Navbar />

      <main className="auth-page-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
            >
              <img
                src="/images/branding/logo.png"
                alt="A2 CRAVINGS"
                className="auth-brand-logo"
                onError={(e) => {
                  e.currentTarget.src = '/images/branding/logo-white.png';
                }}
              />
            </a>
            <h1 className="auth-title">
              Create an <span>Account</span>
            </h1>
            <p className="auth-subtitle">
              Join A2 CRAVINGS for seamless order tracking and fast homemade food deliveries.
            </p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-alert auth-alert-success" role="status">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-name">
                Full Name
              </label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faUser} className="auth-input-icon" />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Ali Ahmed"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-email">
                Email Address
              </label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faEnvelope} className="auth-input-icon" />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-phone">
                Phone Number
              </label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faPhone} className="auth-input-icon" />
                <input
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  className="auth-input"
                  placeholder="03145027631"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-password">
                Password (min. 8 characters)
              </label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-pwd-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="signup-confirm-password">
                Confirm Password
              </label>
              <div className="auth-input-wrap">
                <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-pwd-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faCircleNotch} spin />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?
            <a
              href="/signin"
              className="auth-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/signin');
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SignUp;
