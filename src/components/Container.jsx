import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './Container.css';

const Container = ({ children, className = '' }) => {
  const { theme } = useContext(ThemeContext);
  
  const containerStyle = {
    backgroundColor: theme === 'light' ? '#f8f9fa' : '#34495e',
    color: theme === 'light' ? '#000000' : '#ffffff',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={containerStyle} className={className}>
      {children}
    </div>
  );
};

export default Container;