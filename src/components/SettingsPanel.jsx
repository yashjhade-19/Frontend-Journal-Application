import React, { useState, useEffect } from 'react';
import { createAdmin, getAllUsers } from '../services/api';
import './SettingsPanel.css';

const SettingsPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    userName: '',
    email: '',
    password: '',
    sentimentAnalysis: false
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.roles?.includes('ADMIN')) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await getAllUsers();
          setUsers(response.data);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [user]);

  const handleAdminChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await createAdmin(newAdmin);
      if (response.status === 200) {
        setMessage('Admin created successfully');
        setNewAdmin({
          userName: '',
          email: '',
          password: '',
          sentimentAnalysis: false
        });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Admin creation failed');
    }
  };

  if (!user?.roles?.includes('ADMIN')) {
    return (
      <div className="settings-panel card">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-notice">You must be an admin to access these settings.</p>
      </div>
    );
  }

  return (
    <div className="settings-panel card">
      <h2 className="settings-title">Admin Settings</h2>
      
      <div className="admin-form-section">
        <h3 className="section-title">Create New Admin</h3>
        <form onSubmit={handleCreateAdmin} className="admin-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="userName"
              value={newAdmin.userName}
              onChange={handleAdminChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={newAdmin.email}
              onChange={handleAdminChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={newAdmin.password}
              onChange={handleAdminChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group form-checkbox">
            <input
              type="checkbox"
              name="sentimentAnalysis"
              checked={newAdmin.sentimentAnalysis}
              onChange={handleAdminChange}
            />
            <label>Enable sentiment analysis</label>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Create Admin
          </button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
      
      <div className="users-section">
        <h3 className="section-title">All Users</h3>
        {loading ? (
          <p className="loading-text">Loading users...</p>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Roles</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.userName}</td>
                    <td>{u.email}</td>
                    <td>{u.roles.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanel;