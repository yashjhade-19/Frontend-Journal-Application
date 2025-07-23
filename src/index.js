import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // ✅ Ensure correct path

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Wrap App here */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
