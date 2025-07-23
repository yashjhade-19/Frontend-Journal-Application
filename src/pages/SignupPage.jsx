import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    sentimentAnalysis: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h2>Create your account</h2>
        </div>
        
        {error && <p className="text-error text-center">{error}</p>}
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName" className="form-label">Username</label>
            <input
              id="userName"
              name="userName"
              type="text"
              required
              className="form-input"
              placeholder="Enter username"
              value={formData.userName}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group-checkbox">
            <input
              id="sentimentAnalysis"
              name="sentimentAnalysis"
              type="checkbox"
              checked={formData.sentimentAnalysis}
              onChange={handleChange}
            />
            <label htmlFor="sentimentAnalysis">
              Enable sentiment analysis
            </label>
          </div>
          
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </form>
        
        <div className="signup-footer">
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;