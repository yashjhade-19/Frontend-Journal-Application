import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('journalToken') || null);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('journalUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  });
  
  // Add debug logs
  console.log('Auth State - Token:', token);
  console.log('Auth State - User:', user);

  const login = (newToken, userData) => {
    console.log('Login called with:', newToken, userData);
    
    localStorage.setItem('journalToken', newToken);
    localStorage.setItem('journalUser', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('journalToken');
    localStorage.removeItem('journalUser');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      isAuthenticated: !!token,
      login, 
      logout
    }}>
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