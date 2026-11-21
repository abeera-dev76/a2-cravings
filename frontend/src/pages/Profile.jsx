import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendarDays,
  faLock,
  faPenToSquare,
  faKey,
  faRightFromBracket,
  faCircleNotch,
  faCheckCircle,
  faExclamationCircle,
  faReceipt,
  faUtensils,
  faShieldHalved,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { navigate } from '../utils/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import '../styles/auth.css';

export const Profile = () => {
  const { user, loading: authLoading, isAuthenticated, logout, updateProfile, changePassword } = useAuth();

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState(null);

  // Auth Guard: redirect to /signin if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [authLoading, isAuthenticated]);

  // Sync profile fields with current user
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FontAwesomeIcon icon={faCircleNotch} spin size="2x" style={{ color: '#FF8C00' }} />
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);

    if (!profileName.trim()) {
      setProfileMsg({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }
    if (!profilePhone.trim()) {
      setProfileMsg({ type: 'error', text: 'Phone number cannot be empty.' });
      return;
    }

    setUpdatingProfile(true);
    try {
      await updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
      });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPassMsg({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword.length < 8) {
      setPassMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPassMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setChangingPass(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setPassMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPassMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setChangingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent';

  return (
    <>
      <SEO
        title="My Profile | A2 CRAVINGS"
        description="Manage your A2 CRAVINGS customer account, update details, and manage security settings."
      />
      <Navbar />

      <main className="auth-page-wrapper" style={{ alignItems: 'flex-start', paddingTop: '7rem' }}>
        <div className="profile-container">
          {/* Hero Profile Overview Card */}
          <div className="profile-hero-card">
            <div className="profile-user-left">
              <div className="profile-avatar-large">
                {(user.name || 'C')[0].toUpperCase()}
              </div>
              <div className="profile-user-details">
                <h1>{user.name}</h1>
                <p>
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.4rem', color: '#FF8C00' }} />
                  {user.email}
                </p>
                <p style={{ marginTop: '0.2rem' }}>
                  <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: '0.4rem', color: '#FF8C00' }} />
                  Customer since {formattedDate}
                </p>
              </div>
            </div>

            <div className="profile-hero-actions">
              <button
                type="button"
                className="profile-logout-btn"
                onClick={handleLogout}
                title="Sign out of your account"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <div
              style={{
                background: '#141414',
                border: '1px solid rgba(255, 140, 0, 0.25)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/track-order')}
            >
              <div>
                <h4 style={{ margin: '0 0 0.2rem', color: '#FFFFFF', fontSize: '1rem' }}>Track My Order</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                  View real-time preparation & delivery status
                </p>
              </div>
              <FontAwesomeIcon icon={faReceipt} style={{ color: '#FF8C00', fontSize: '1.4rem' }} />
            </div>

            <div
              style={{
                background: '#141414',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/', 'menu')}
            >
              <div>
                <h4 style={{ margin: '0 0 0.2rem', color: '#FFFFFF', fontSize: '1rem' }}>Explore Menu</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                  Order delicious pasta, biryani & loaded fries
                </p>
              </div>
              <FontAwesomeIcon icon={faUtensils} style={{ color: '#FF8C00', fontSize: '1.4rem' }} />
            </div>
          </div>

          {/* Profile Details & Security Grid */}
          <div className="profile-grid">
            {/* Box 1: Account Information */}
            <div className="profile-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 className="profile-box-title" style={{ margin: 0, border: 'none', padding: 0 }}>
                  <FontAwesomeIcon icon={faUser} style={{ color: '#FF8C00' }} />
                  <span>Account Information</span>
                </h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setProfileMsg(null);
                    }}
                    style={{
                      background: 'rgba(255, 140, 0, 0.12)',
                      color: '#FF8C00',
                      border: '1px solid rgba(255, 140, 0, 0.25)',
                      borderRadius: '8px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: '0.35rem' }} />
                    Edit
                  </button>
                )}
              </div>

              {profileMsg && (
                <div
                  className={`auth-alert ${profileMsg.type === 'error' ? 'auth-alert-error' : 'auth-alert-success'}`}
                  role="alert"
                >
                  <FontAwesomeIcon icon={profileMsg.type === 'error' ? faExclamationCircle : faCheckCircle} />
                  <span>{profileMsg.text}</span>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="auth-form-group">
                    <label className="auth-label">Full Name</label>
                    <div className="auth-input-wrap">
                      <FontAwesomeIcon icon={faUser} className="auth-input-icon" />
                      <input
                        type="text"
                        className="auth-input"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-form-group">
                    <label className="auth-label">Phone Number</label>
                    <div className="auth-input-wrap">
                      <FontAwesomeIcon icon={faPhone} className="auth-input-icon" />
                      <input
                        type="tel"
                        className="auth-input"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <button
                      type="submit"
                      className="auth-submit-btn"
                      style={{ margin: 0, flex: 1 }}
                      disabled={updatingProfile}
                    >
                      {updatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileName(user.name || '');
                        setProfilePhone(user.phone || '');
                        setProfileMsg(null);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '12px',
                        padding: '0.75rem 1.25rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Full Name</span>
                    <span className="profile-info-value">{user.name}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Email Address</span>
                    <span className="profile-info-value">{user.email}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Phone Number</span>
                    <span className="profile-info-value">{user.phone}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Account Status</span>
                    <span className="profile-info-value" style={{ color: '#10B981' }}>
                      ● Active
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Box 2: Security & Password */}
            <div className="profile-box">
              <h2 className="profile-box-title">
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: '#FF8C00' }} />
                <span>Change Password</span>
              </h2>

              {passMsg && (
                <div
                  className={`auth-alert ${passMsg.type === 'error' ? 'auth-alert-error' : 'auth-alert-success'}`}
                  role="alert"
                >
                  <FontAwesomeIcon icon={passMsg.type === 'error' ? faExclamationCircle : faCheckCircle} />
                  <span>{passMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="auth-form-group">
                  <label className="auth-label">Current Password</label>
                  <div className="auth-input-wrap">
                    <FontAwesomeIcon icon={faLock} className="auth-input-icon" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-pwd-toggle"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      aria-label="Toggle current password view"
                    >
                      <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">New Password (min. 8 characters)</label>
                  <div className="auth-input-wrap">
                    <FontAwesomeIcon icon={faKey} className="auth-input-icon" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-pwd-toggle"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label="Toggle new password view"
                    >
                      <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">Confirm New Password</label>
                  <div className="auth-input-wrap">
                    <FontAwesomeIcon icon={faKey} className="auth-input-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="auth-input"
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-pwd-toggle"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label="Toggle confirm new password view"
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={changingPass}
                  style={{ marginTop: '1.25rem' }}
                >
                  {changingPass ? (
                    <>
                      <FontAwesomeIcon icon={faCircleNotch} spin />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Profile;
