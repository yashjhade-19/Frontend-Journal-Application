import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Initialize token from localStorage if available
    const storedToken = localStorage.getItem('journalToken');
    return storedToken || null;
  });
  
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    try {
      const storedUser = localStorage.getItem('journalUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Debug effect to log auth state changes
  useEffect(() => {
    console.log('Auth state updated:', { token, user, isLoading });
  }, [token, user, isLoading]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('journalToken');
      if (storedToken) {
        try {
          // Here you could add token validation logic
          // For example, decode JWT to check expiration
          const tokenValid = true; // Replace with actual validation
          
          if (tokenValid) {
            setToken(storedToken);
            
            // Try to get user data if exists
            const storedUser = localStorage.getItem('journalUser');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              // Fallback minimal user data
              setUser({ userName: 'User' });
            }
          } else {
            // Token expired or invalid
            localStorage.removeItem('journalToken');
            localStorage.removeItem('journalUser');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('journalToken');
          localStorage.removeItem('journalUser');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken, userData) => {
    if (!newToken) {
      console.error('Login failed: No token provided');
      throw new Error('No token provided');
    }

    console.log('Logging in with:', { newToken, userData });
    
    // Ensure minimum user data structure
    const completeUserData = {
      userName: 'User', // Default value
      ...(userData || {}), // Override with provided data
      lastLogin: new Date().toISOString() // Add login timestamp
    };

    // Update state and storage
    setToken(newToken);
    setUser(completeUserData);
    localStorage.setItem('journalToken', newToken);
    localStorage.setItem('journalUser', JSON.stringify(completeUserData));
    
    console.log('Login successful');
  };

  const logout = () => {
    console.log('Logging out');
    setToken(null);
    setUser(null);
    localStorage.removeItem('journalToken');
    localStorage.removeItem('journalUser');
  };

  // Add token validation method
  const validateToken = () => {
    if (!token) return false;
    
    // Add your token validation logic here
    // For JWT, you could decode and check expiration
    return true; // Simplified for example
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      isLoading,
      isAuthenticated: !!token && validateToken(),
      login, 
      logout,
      updateUser: setUser // Allow user data updates
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