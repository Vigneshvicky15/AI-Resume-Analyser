import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session on boot if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          if (data && data.success) {
            setUser(data.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('[AuthContext] Failed to load session:', error.message);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user action
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      if (data && data.success) {
        if (data.data.token) {
          // Auto-verified in development if SMTP is not set
          localStorage.setItem('token', data.data.token);
          setUser({
            _id: data.data._id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role || 'user',
          });
          return { success: true, requiresVerification: false };
        } else {
          // Verification required via OTP
          return { success: true, requiresVerification: true, email: data.data.email };
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please check your details.';
      return { success: false, error: message };
    }
  };

  // Verify OTP action
  const verifyOTP = async (email, otp) => {
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      if (data && data.success) {
        localStorage.setItem('token', data.data.token);
        setUser({
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role || 'user',
        });
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'OTP Verification failed.';
      return { success: false, error: message };
    }
  };

  // Resend OTP action
  const resendOTP = async (email) => {
    try {
      const { data } = await api.post('/auth/resend-otp', { email });
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP.';
      return { success: false, error: message };
    }
  };

  // Login user action
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data && data.success) {
        localStorage.setItem('token', data.data.token);
        setUser({
          _id: data.data._id,
          name: data.data.name,
          email: data.data.email,
          role: data.data.role || 'user',
        });
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      const requiresVerification = message.includes('verify your email address');
      return { success: false, error: message, requiresVerification, email };
    }
  };

  // Forgot Password request
  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to request reset link.';
      return { success: false, error: message };
    }
  };

  // Reset Password action
  const resetPassword = async (token, password) => {
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      return { success: true, message: data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password.';
      return { success: false, error: message };
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        verifyOTP,
        resendOTP,
        login,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
