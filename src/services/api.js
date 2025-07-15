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

export const login = async (credentials) => {
  const response = await api.post('/public/login', credentials);

  // if API returns token as plain string
  if (typeof response.data === 'string') {
    return {
      ...response,
      data: {
        token: response.data,
        user: { userName: credentials.userName },
      },
    };
  }

  return response;
};

export const googleLogin = async (code) => {
  const response = await api.get(`/auth/google/callback?code=${code}`);
  return response;
};

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
      console.error('[Journal] Create error:', {
        status: error.response?.status,
        data: error.response?.data,
        payload: journalData,
      });
      throw error;
    }
  },

  getAll: async () => {
    const response = await api.get('/journal');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/journal/id/${id}`);
    return response.data;
  },

  update: async (id, journalData) => {
    try {
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
        payload: journalData,
      });
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/journal/id/${id}`);
      return response.data;
    } catch (error) {
      console.error('[Journal] Delete error:', {
        id,
        status: error.response?.status,
      });
      throw error;
    }
  },
};

// ──────────────── WEATHER (3rd party) ────────────────

export const getWeather = async (location = 'New York') => {
  const response = await axios.get(
    `http://api.weatherstack.com/current?access_key=a382a134505756d5f45912ae8e4e3f22&query=${location}`,
    { timeout: 10000 }
  );
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
