import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCustomerToken,
  getCustomerUser,
  customerLogin,
  customerRegister,
  customerLogout,
  fetchCustomerProfile,
  updateCustomerProfile,
  changeCustomerPassword,
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCustomerUser());
  const [token, setToken] = useState(() => getCustomerToken());
  const [loading, setLoading] = useState(true);

  // Sync state with localStorage and fetch fresh profile if token exists
  const syncAuth = useCallback(async () => {
    const currentToken = getCustomerToken();
    const currentUser = getCustomerUser();
    setToken(currentToken);
    setUser(currentUser);

    if (currentToken) {
      try {
        const freshUser = await fetchCustomerProfile();
        setUser(freshUser);
      } catch (err) {
        console.warn('AuthContext profile fetch failed:', err.message);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    syncAuth();

    const handleAuthChange = () => {
      setToken(getCustomerToken());
      setUser(getCustomerUser());
    };

    window.addEventListener('a2:auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('a2:auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [syncAuth]);

  const login = async (email, password) => {
    const result = await customerLogin(email, password);
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const register = async (payload) => {
    const result = await customerRegister(payload);
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const logout = () => {
    customerLogout();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const result = await updateCustomerProfile(payload);
    setUser(result.user);
    return result;
  };

  const changePassword = async (payload) => {
    return await changeCustomerPassword(payload);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshProfile: syncAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
