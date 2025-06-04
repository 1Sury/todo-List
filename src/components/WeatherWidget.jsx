import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/WeatherWidget.css';

const WeatherWidget = () => {
  const { data, loading, error } = useSelector(state => state.weather);

  if (loading) {
    return <div className="weather-widget loading">Loading weather...</div>;
  }

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  const getWeatherEmoji = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
    return '🌤️'; 
  };

  return (
    <div className="weather-widget">
      <span className="weather-emoji">{getWeatherEmoji(data.condition)}</span>
      <div className="weather-info">
        <span className="weather-temp">{data.temp}°C</span>
        <span className="weather-location">{data.location}</span>
      </div>
    </div>
  );
};

export default WeatherWidget;
