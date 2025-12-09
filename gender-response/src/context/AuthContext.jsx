import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check if user is stored
  useEffect(() => {
    try {
      const stored = authService.getStoredAuth();
      if (stored?.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${stored.token}`;
      }
      if (stored?.user) setUser(stored.user);
    } catch (error) {
      // Silently ignore
    }
  }, []);

  // Login handler (supports reCAPTCHA)
  const login = async (email, password, captchaToken) => {
    try {
      const { user: userData } = await authService.login(email, password, captchaToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register handler (supports reCAPTCHA)
  const register = async (userData, captchaToken) => {
    try {
      const { user: newUser } = await authService.register(userData, captchaToken);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Safe and consistent custom hook export
export const useAuth = () => useContext(AuthContext);

