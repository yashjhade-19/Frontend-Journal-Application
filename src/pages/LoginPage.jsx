import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, googleLogin } from '../services/api';
import './LoginPage.css';


const LoginPage = () => {
  const [credentials, setCredentials] = useState({ 
    userName: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      const handleGoogleAuth = async () => {
        try {
          setIsSubmitting(true);
          const response = await googleLogin(code);
          if (response.data.token) {
            authLogin(response.data.token, response.data.user);
            navigate('/');
          }
        } catch (err) {
          setError('Google authentication failed');
        } finally {
          setIsSubmitting(false);
        }
      };
      handleGoogleAuth();
    }
  }, [authLogin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      console.log("Attempting login with:", credentials);
      const response = await login(credentials);
      console.log("Login response:", response);
      
      if (response.data.token) {
        authLogin(response.data.token, response.data.user);
        navigate('/');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Initiating Google login");
    window.location.href = 'https://journal-application-production.up.railway.app/oauth2/authorization/google';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Sign in to your account</h2>
        </div>
        
        {error && <p className="text-error text-center">{error}</p>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName" className="form-label">Username</label>
            <input
              id="userName"
              name="userName"
              type="text"
              required
              className="form-input"
              placeholder="Enter username"
              value={credentials.userName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="Enter password"
              value={credentials.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
          
          <div className="login-divider">
            <span>or</span>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-google"
            disabled={isSubmitting}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;