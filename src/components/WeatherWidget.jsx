import React, { useState, useEffect } from 'react';
import { getWeather } from '../services/api';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await getWeather();
        
        // Validate response structure
        if (response.data && response.data.location && response.data.current) {
          setWeather(response.data);
        } else {
          throw new Error('Invalid weather data structure');
        }
      } catch (err) {
        console.error('Weather API error:', err);
        setError(err.message || 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="weather-loading">Loading weather...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="weather-widget error">
        <div className="weather-error">{error}</div>
      </div>
    );
  }

  // Render weather data
  return (
    <div className="weather-widget">
      {weather?.current?.weather_icons?.[0] && (
        <img 
          src={weather.current.weather_icons[0]} 
          alt="Weather icon" 
          className="weather-icon"
        />
      )}
      <div className="weather-info">
        <div className="weather-location">
          {weather?.location?.name || 'Location unavailable'}
        </div>
        <div className="weather-temp">
          {weather?.current?.temperature 
            ? `${weather.current.temperature}°C` 
            : 'Temperature unavailable'}
          {weather?.current?.weather_descriptions?.[0] && (
            <span>, {weather.current.weather_descriptions[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;