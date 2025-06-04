import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(state => state.theme.darkMode);
  
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    dispatch({ type: 'theme/setDarkMode', payload: newMode });
    
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme !== null) {
      const isDark = JSON.parse(savedTheme);
      dispatch({ type: 'theme/setDarkMode', payload: isDark });
      
      if (isDark) {
        document.body.classList.add('dark-mode');
      }
    }
  }, [dispatch]);

  return (
    <div className="theme-toggle">
      <button 
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default ThemeToggle;
