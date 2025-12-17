import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Container from "../../components/Container";
import { ThemeContext } from "../../context/ThemeContext";
import { increment, decrement, reset } from "../../redux/counterSlice";

function Lab4() {
  // Context для темы
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // Redux для счетчика
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  // useState для управления демо-компонентом
  const [showDemo, setShowDemo] = useState(true);
  const [mountCount, setMountCount] = useState(0);

  // useEffect на монтировании и размонтировании демо-компонента
  useEffect(() => {
    if (showDemo) {
      console.log("Демо-компонент смонтирован");
      console.log(`Количество монтирований: ${mountCount + 1}`);
      setMountCount(prev => prev + 1);

      // cleanup функция (на размонтировании)
      return () => {
        console.log("Демо-компонент размонтирован");
      };
    }
  }, [showDemo]);

  return (
    <div style={{
      backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
      color: theme === "light" ? "#000000" : "#ffffff",
      minHeight: "100vh",
      padding: "20px",
      transition: "all 0.3s ease",
    }}>
      <Container>
        <h1>Лабораторная работа 4</h1>
        <h2>Хуки React. Работа с Redux. Работа с роутингом. Формы</h2>

        {/* 1. Переключение темы (Context) */}
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: "12px 24px",
              backgroundColor: theme === "light" ? "#34495e" : "#f39c12",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {theme === "light" ? "Ночная тема" : "Дневная тема"}
          </button>
          <p style={{ fontSize: "16px", margin: "10px 0" }}>
            Текущая тема: <strong>{theme === "light" ? "День" : "Ночь"}</strong>
          </p>
        </div>

        {/* 2. useState и useEffect - управление монтированием/размонтированием */}
        <div
          style={{
            marginBottom: "30px",
            padding: "25px",
            border: "2px solid #bdc3c7",
            borderRadius: "10px",
            backgroundColor: theme === "light" ? "#f8f9fa" : "#34495e",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>useState и useEffect - Монтирование/размонтирование</h3>
          
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => setShowDemo(!showDemo)}
              style={{
                padding: "12px 24px",
                backgroundColor: showDemo ? "#e74c3c" : "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              {showDemo ? "Размонтировать компонент" : "Смонтировать компонент"}
            </button>
            
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              Статус: <strong style={{ 
                color: showDemo ? "#27ae60" : "#e74c3c" 
              }}>
                {showDemo ? "Компонент смонтирован" : "Компонент размонтирован"}
              </strong>
            </p>
          </div>

          {/* Демо-компонент, который монтируется/размонтируется */}
          {showDemo && (
            <div
              style={{
                padding: "20px",
                border: "2px dashed #bdc3c7",
                borderRadius: "8px",
                backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
                marginTop: "15px",
              }}
            >
              <h4 style={{ color: theme === "light" ? "#27ae60" : "#2ecc71", marginBottom: "10px" }}>
                Демо-компонент
              </h4>
              <p style={{ fontSize: "14px" }}>
                Этот компонент демонстрирует работу useEffect. 
              </p>
            </div>
          )}
        </div>

        {/* 3. Redux счетчик с actions и reducer */}
        <div
          style={{
            padding: "25px",
            border: "2px solid #bdc3c7",
            borderRadius: "10px",
            backgroundColor: theme === "light" ? "#f8f9fa" : "#34495e",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Redux Counter</h3>
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => dispatch(decrement())}
              style={{
                padding: "12px 18px",
                fontSize: "20px",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                minWidth: "50px",
              }}
            >
              -
            </button>
            
            <span
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                minWidth: "60px",
                textAlign: "center",
                color: theme === "light" ? "#2c3e50" : "#ffffff",
              }}
            >
              {count}
            </span>
            
            <button
              onClick={() => dispatch(increment())}
              style={{
                padding: "12px 18px",
                fontSize: "20px",
                backgroundColor: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                minWidth: "50px",
              }}
            >
              +
            </button>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => dispatch(reset())}
              style={{
                padding: "10px 20px",
                backgroundColor: "#e67e22",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Сбросить счетчик
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Lab4;