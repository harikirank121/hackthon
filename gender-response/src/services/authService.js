import axios from 'axios';

const API_BASE = 'http://localhost:5000';
const AUTH_STORAGE_KEY = 'dv_support_auth_user';

const persistAuth = (payload) => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    if (payload?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
    }
  } catch (error) {
    console.error('Error saving auth payload:', error);
  }
};

const clearPersistedAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  delete axios.defaults.headers.common['Authorization'];
};

const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error reading stored auth:', error);
    return null;
  }
};

export const authService = {
  async register(userData, captchaToken) {
    const { data } = await axios.post(`${API_BASE}/auth/register`, {
      ...userData,
      captchaToken
    });
    persistAuth(data);
    return data;
  },

  async login(email, password, captchaToken) {
    const { data } = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
      captchaToken
    });
    persistAuth(data);
    return data;
  },

  getCurrentUser() {
    const stored = getStoredAuth();
    return stored?.user || null;
  },

  getToken() {
    const stored = getStoredAuth();
    return stored?.token || null;
  },

  getStoredAuth,

  logout() {
    clearPersistedAuth();
  }
};
