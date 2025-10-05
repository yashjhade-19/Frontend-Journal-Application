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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleJournalCreated = () => {
    setRefreshJournals(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="home-page">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            {/* Logo Section */}
            <div className="app-logo">
              <img
                src="/logo1.png"
                alt="Journal App Logo"
                className="logo-image"
              />
              <h1 className="logo-text">Journal App</h1>
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            {/* Navigation */}
            <nav className={`app-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              <button
                onClick={() => handleNavClick('journals')}
                className={`nav-btn ${activeTab === 'journals' ? 'active' : ''}`}
              >
                Journals
              </button>
              <button
                onClick={() => handleNavClick('settings')}
                className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              >
                Settings
              </button>
            </nav>

            {/* Desktop Header Right */}
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