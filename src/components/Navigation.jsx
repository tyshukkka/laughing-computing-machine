import React from 'react';
import Button from './Button';
import './Navigation.css';

// Навигационная панель с примерами кнопок
const Navigation = () => {
  const handleNavClick = (page) => {
    alert(`Переход на страницу: ${page}`);
  };

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li><Button onClick={() => handleNavClick('Главная')}>Главная</Button></li>
        <li><Button variant="secondary" onClick={() => handleNavClick('О нас')}>О нас</Button></li>
        <li><Button onClick={() => handleNavClick('Контакты')}>Контакты</Button></li>
      </ul>
    </nav>
  );
};

export default Navigation;