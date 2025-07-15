import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://journal-application-production.up.railway.app',
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for logging and error handling
api.interceptors.request.use(config => {
  console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`);
  if (config.data) {
    console.log('Request Data:', config.data);
  }
  if (config.headers.Authorization) {
    console.log('Authorization header present');
  }
  return config;
}, error => {
  console.error('[Request Error]', error);
  return Promise.reject(error);
});

// Response interceptor for logging and error handling
api.interceptors.response.use(response => {
  console.log(`[Response] ${response.status} ${response.config.url}`);
  console.log('Response Data:', response.data);
  return response;
}, error => {
  if (error.response) {
    // Server responded with a status outside 2xx
    console.error(
      `[Response Error] Status: ${error.response.status}`,
      `Data:`, error.response.data,
      `Headers:`, error.response.headers
    );
  } else if (error.request) {
    // Request was made but no response received
    console.error('[Network Error] No response received:', error.request);
  } else {
    // Something happened in setting up the request
    console.error('[Request Setup Error]', error.message);
  }
  
  return Promise.reject(error);
});




// API functions
export const signup = async (userData) => {
  try {
    const response = await api.post('/public/signup', userData);
    return response;
  } catch (error) {
    console.error('Signup API Error:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/public/login', credentials);
    // If response is just the token string, format it properly
    if (typeof response.data === 'string') {
      return {
        ...response,
        data: {
          token: response.data,
          user: { userName: credentials.userName } // Add basic user info
        }
      };
    }
    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

export const googleLogin = async (code) => {
  try {
    const response = await api.get(`/auth/google/callback?code=${code}`);
    return response;
  } catch (error) {
    console.error('Google Login API Error:', error);
    throw error;
  }
};

// Journal API Functions
export const journalAPI = {
  // Create new journal entry
  create: async (journalData) => {
    try {
      const response = await api.post('/journal', {
        title: journalData.title,
        content: journalData.content,
        sentiment: journalData.sentiment
      });
      return response.data;
    } catch (error) {
      console.error('[Journal] Create error:', {
        status: error.response?.status,
        data: error.response?.data,
        payload: journalData
      });
      throw error;
    }
  },

  // Get all journals
  getAll: async () => {
    try {
      const response = await api.get('/journal');
      return response.data;
    } catch (error) {
      console.error('[Journal] Get all error:', error.response?.data);
      throw error;
    }
  },

  // Get single journal by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/journal/id/${id}`);
      return response.data;
    } catch (error) {
      console.error('[Journal] Get by ID error:', {
        id,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Update journal by ID
  update: async (id, journalData) => {
    try {
      const response = await api.put(`/journal/id/${id}`, {
        title: journalData.title,
        content: journalData.content,
        sentiment: journalData.sentiment
      });
      return response.data;
    } catch (error) {
      console.error('[Journal] Update error:', {
        id,
        status: error.response?.status,
        payload: journalData
      });
      throw error;
    }
  },

  // Delete journal by ID
  delete: async (id) => {
    try {
      const response = await api.delete(`/journal/id/${id}`);
      return response.data;
    } catch (error) {
      console.error('[Journal] Delete error:', {
        id,
        status: error.response?.status
      });
      throw error;
    }
  }
};


export const getWeather = async (location = 'New York') => {
  try {
    const response = await axios.get(
      `http://api.weatherstack.com/current?access_key=a382a134505756d5f45912ae8e4e3f22&query=${location}`,
      { timeout: 10000 }
    );
    return response;
  } catch (error) {
    console.error('Weather API Error:', error);
    throw error;
  }
};

export const createAdmin = async (adminData, token) => {
  try {
    const response = await api.post('/admin/create-admin-user', adminData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error('Create Admin API Error:', error);
    throw error;
  }
};

export const getAllUsers = async (token) => {
  try {
    const response = await api.get('/admin/all-users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error('Get All Users API Error:', error);
    throw error;
  }
};