import axios from 'axios';

const API_BASE_URL = 'https://aada-backend-app12345.azurewebsites.net';
// For local testing: const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add interceptor to automatically add auth token
api.interceptors.request.use(
  (config) => {
    // Don't add token for login, register, or refresh endpoints
    if (
      !config.url.includes('/auth/login') &&
      !config.url.includes('/auth/register') &&
      !config.url.includes('/auth/refresh')
    ) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add interceptor for auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Auto-refresh token on 401 errors
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      const refreshed = await refreshToken();
      if (refreshed) {
        const token = localStorage.getItem('accessToken');
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } else {
        logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Register new user
export const register = async (userData) => {
  try {
    console.log('🔵 Registering user at:', `${API_BASE_URL}/auth/register`);
    console.log('🔵 Request payload:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('🔵 Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Registration error:', error.response?.data || error.message);
    console.error('❌ Status code:', error.response?.status);
    throw handleError(error);
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, refresh_token, user } = response.data;

    // Store tokens securely
    localStorage.setItem('accessToken', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    localStorage.setItem('userData', JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw handleError(error);
  }
};

// Refresh access token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;
    localStorage.setItem('accessToken', newAccessToken);
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

// Get current user info
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get user error:', error.response?.data || error.message);
    return null;
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    await api.post('/auth/verify-email', { token });
    return true;
  } catch (error) {
    console.error('Email verification error:', error.response?.data || error.message);
    return false;
  }
};

// Request password reset
export const forgotPassword = async (email) => {
  try {
    await api.post('/auth/forgot-password', { email });
    return true;
  } catch (error) {
    console.error('Forgot password error:', error.response?.data || error.message);
    return false;
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    await api.post('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return true;
  } catch (error) {
    console.error('Reset password error:', error.response?.data || error.message);
    return false;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userData');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('accessToken');
};

// Get stored user data
export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

// Get user documents
export const getUserDocuments = async () => {
  try {
    const response = await api.get('/documents/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw handleError(error);
  }
};

// Handle errors and convert to user-friendly messages
const handleError = (error) => {
  if (error.response) {
    const data = error.response.data;
    if (data && data.detail) {
      return new Error(data.detail);
    }
    return new Error(`Server error: ${error.response.status}`);
  } else if (error.code === 'ECONNABORTED') {
    return new Error('Connection timeout. Please check your internet connection.');
  } else if (error.message === 'Network Error') {
    return new Error('Unable to connect to server. Please try again later.');
  }
  return new Error('An unexpected error occurred. Please try again.');
};

export default api;