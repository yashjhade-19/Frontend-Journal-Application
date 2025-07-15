import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/WeatherWidget';
import JournalForm from '../components/JournalForm';
import JournalList from '../components/JournalList';
import SettingsPanel from '../components/SettingsPanel';
import './HomePage.css';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('journals');
  const [refreshJournals, setRefreshJournals] = useState(false);

  const handleJournalCreated = () => {
    setRefreshJournals(prev => !prev);
  };

  return (
    <div className="home-page">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="app-logo">
              <h1>Journal App</h1>
            </div>
            
            <nav className="app-nav">
              <button
                onClick={() => setActiveTab('journals')}
                className={`nav-btn ${activeTab === 'journals' ? 'active' : ''}`}
              >
                Journals
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              >
                Settings
              </button>
            </nav>
            
            <div className="header-right">
              <div className="weather-container">
                <WeatherWidget />
              </div>
              <div className="user-info">
                <span className="username">Hi, {user?.userName || 'User'}</span>
                <button onClick={logout} className="btn btn-logout">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="main-content">
            {activeTab === 'journals' ? (
              <>
                <JournalForm onJournalCreated={handleJournalCreated} />
                <JournalList key={refreshJournals} />
              </>
            ) : (
              <SettingsPanel user={user} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;