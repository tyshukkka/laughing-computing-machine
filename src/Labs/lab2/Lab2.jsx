import React, { useContext } from "react";
import Navigation from "../../components/Navigation";
import Container from "../../components/Container";
import Button from "../../components/Button";
import { ThemeContext } from "../../context/ThemeContext";
import "../../App.css";

function Lab2() {
  const { theme } = useContext(ThemeContext);

  const handleHelloClick = () => {
    alert("Hello World!");
  };

  const textStyle = {
    color: theme === "light" ? "#000000" : "#ffffff",
  };

  return (
    <div style={{ width: "100%", minHeight: "100%" }}>
      <Navigation />
      <Container>
        <h1 style={{ color: theme === "light" ? "#e74c3c" : "#ff6b6b" }}>Hello World!</h1>
        <p style={textStyle}>React-приложение с компонентами.</p>
        <Button onClick={handleHelloClick}>Нажми меня!</Button>
        <Button variant="secondary" style={{ marginLeft: "10px" }}>
          Вторичная кнопка
        </Button>
      </Container>
    </div>
  );
}

export default Lab2;