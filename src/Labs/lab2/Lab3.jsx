import React, { useContext } from "react";
import Container from "../../components/Container";
import { ThemeContext } from "../../context/ThemeContext";

function Lab3() {
  const { theme } = useContext(ThemeContext);

  const textStyle = {
    color: theme === "light" ? "#000000" : "#ffffff",
  };

  return (
    <div style={{ width: "100%", minHeight: "100%" }}>
      <Container>
        <h1 style={textStyle}>Лабораторная работа 3</h1>
        <h2 style={textStyle}>
          Основы React. Работа с объектами JavaScript
        </h2>

        <div style={{ textAlign: "left", marginTop: "20px" }}>
          <h3 style={textStyle}>Задание:</h3>
          <ul style={textStyle}>
            <li>
              Продолжаем задание "Реализовать шаблон страницы и разместить на
              нем компоненты навигации"
            </li>
            <li>Можно использовать готовые библиотеки Mui/Bootstrap и тд</li>
            <li>Реализуем компоненты Header, Footer, Menu и Content</li>
            <li>В меню выводим список лабораторных работ</li>
            <li>В Content выводим содержимое лабораторной работы</li>
            <li>Разместить проект в репозиторий в github</li>
            <li>Прикрепить текстовый файл с ссылкой на проект</li>
          </ul>
        </div>
      </Container>
    </div>
  );
}

export default Lab3;