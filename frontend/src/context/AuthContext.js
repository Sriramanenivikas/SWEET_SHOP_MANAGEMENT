import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only store user info in localStorage (not tokens!)
    // Tokens are stored in HttpOnly cookies - JavaScript cannot access them
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { user: userData } = response.data;
    
    // SECURE: Only store user info, NOT tokens
    // Tokens are automatically stored in HttpOnly cookies by backend
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return userData;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    const { user: userData } = response.data;
    
    // SECURE: Only store user info, NOT tokens
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return userData;
  };

  const logout = useCallback(async () => {
    try {
      // Cookies are sent automatically - no need to pass refresh token
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authAPI.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      logoutAll,
      isAdmin,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
