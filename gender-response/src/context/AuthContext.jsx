import { createContext, useContext, useState, useEffect } from 'react';

import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check if user is stored
  useEffect(() => {
    try {
      const storedUser = authService.getCurrentUser();
      if (storedUser) setUser(storedUser);
    } catch (error) {
      // Silently ignore
    }
  }, []);

  // Login handler (supports reCAPTCHA)
  const login = async (email, password, captchaToken) => {
    try {
      const userData = await authService.login(email, password, captchaToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register handler (now supports reCAPTCHA)
  const register = async (userData, captchaToken) => {
    try {
      const newUser = await authService.register(userData, captchaToken);
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Safe and consistent custom hook export
export const useAuth = () => useContext(AuthContext);

