import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthHandlerPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Parse params OUTSIDE of useEffect
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get('email');
  const username = params.get('username');

  useEffect(() => {
    if (!token || !email) return; // Prevent running on empty rerender

    console.log("AuthHandler received:", { token, email, username });

    localStorage.setItem('journalToken', token);
    localStorage.setItem('journalUser', JSON.stringify({ email, username }));
    login(token, { email, username });

    navigate('/', { replace: true });
  }, [token, email, username, login, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center'
    }}>
      <h2>Processing Authentication...</h2>
      <p>Please wait while we log you in</p>
    </div>
  );
};

export default AuthHandlerPage;
