import React, { useState, useEffect } from 'react';
import { getWeather } from '../services/api';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('Mumbai');

  const fetchWeather = async (city = 'Mumbai') => {
    try {
      setLoading(true);
      setError(null);

      const response = await getWeather(city);

      if (response.data && response.data.current) {
        setWeather({
          location: city,
          feelslike: response.data.current.feelslike
        });
      } else {
        throw new Error('Invalid weather data structure');
      }
    } catch (err) {
      console.error('Weather API error:', err);
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(location);
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="weather-loading">Loading weather...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget error">
        <div className="weather-error">{error}</div>
        <button onClick={() => fetchWeather()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="weather-widget">
      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter city"
          className="location-input"
        />
        <button type="submit" className="get-weather-button">
          Get Weather
        </button>
      </form>

      <div className="weather-info">
        <div className="weather-location">{location}</div>
        <div className="weather-temp">
          Feels like: {weather?.feelslike || 'N/A'}°C
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
