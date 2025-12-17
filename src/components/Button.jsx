import React from 'react';
import './Button.css';

// Универсальная кнопка

//  - onClick: обработчик клика
//  - variant: внешний вид ('primary' | 'secondary')
//  - children: текст/контент кнопки
const Button = ({ children, onClick, variant = 'primary' }) => {
  return (
    // Класс формируется по модификатору variant
    <button className={`button button--${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;