import axios from 'axios';

// Axios instance with base configuration
const api = axios.create({
  baseURL: 'https://journal-application-production.up.railway.app',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject JWT token into Authorization header
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('journalToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Global error handler
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error(`[API Error] ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('[Network Error] No response:', error.request);
    } else {
      console.error('[Request Error]', error.message);
    }
    return Promise.reject(error);
  }
);

// ──────────────── AUTH ────────────────

export const signup = async (userData) => {
  const response = await api.post('/public/signup', userData);
  return response;
};


// Update regular login to match Google's response format
export const login = async (credentials) => {
  const response = await api.post('/public/login', credentials);
  
  // Transform response to match Google's format
  if (typeof response.data === 'string') {
    return {
      ...response,
      data: {
        token: response.data,
        user: { 
          email: credentials.userName, // Added email field
          userName: credentials.userName 
        }
      }
    };
  }
  
  return response;
};


// In api.js, update getGoogleAuthUrl
// Update Google URL endpoint
export const getGoogleAuthUrl = async () => {
  const response = await api.get('/auth/google/url');
  return response.data; // Now returns a simple string
};

// Update Google login to handle consistent response
export const googleLogin = async (code) => {
  const response = await api.get(`/auth/google/callback?code=${code}`);
  return response;
};

// ... existing imports and axios setup ...

// ──────────────── JOURNALS ────────────────
export const journalAPI = {
  create: async (journalData) => {
    try {
      const response = await api.post('/journal', {
        title: journalData.title,
        content: journalData.content,
        sentiment: journalData.sentiment,
      });
      return response.data;
    } catch (error) {
      console.error('[Journal] Create error:', error.response?.data || error.message);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get('/journal');
      return response.data;
    } catch (error) {
      console.error('[Journal] Get All error:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      // Simplified ID handling - just pass string directly
      const response = await api.get(`/journal/id/${id}`);
      return response.data;
    } catch (error) {
      console.error('[Journal] Get By ID error:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id, journalData) => {
    try {
      // No need for encoding or conversion
      const response = await api.put(`/journal/id/${id}`, {
        title: journalData.title,
        content: journalData.content,
        sentiment: journalData.sentiment,
      });
      return response.data;
    } catch (error) {
      console.error('[Journal] Update error:', {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  delete: async (id) => {
    try {
      // Direct string ID usage
      const response = await api.delete(`/journal/id/${id}`);
      return response.data;
    } catch (error) {
      console.error('[Journal] Delete error:', {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
};

// ──────────────── WEATHER (Using our backend) ────────────────

export const getWeather = async (location = 'Mumbai') => {
  // Use our backend endpoint instead of direct Weatherstack API
  const response = await api.get(`/api/weather/${encodeURIComponent(location)}`);
  return response;
};
// ──────────────── ADMIN ────────────────

export const createAdmin = async (adminData, token) => {
  const response = await api.post('/admin/create-admin-user', adminData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const getAllUsers = async (token) => {
  const response = await api.get('/admin/all-users', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};
