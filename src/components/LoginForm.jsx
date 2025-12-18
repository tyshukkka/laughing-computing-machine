// src/components/LoginForm.jsx
import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { ThemeContext } from "../context/ThemeContext";

const LoginForm = ({ onLogin }) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Некорректный email";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Проверяем в двух местах для совместимости
      const regularUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const lab8Users = JSON.parse(localStorage.getItem("lab8_users") || "[]");

      // Объединяем пользователей
      const allUsers = [...regularUsers, ...lab8Users];

      const user = allUsers.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        const userInfo = {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          role: user.role || "user",
          status: user.status || "active",
        };

        localStorage.setItem("currentUser", JSON.stringify(userInfo));
        sessionStorage.setItem("currentUser", JSON.stringify(userInfo));

        if (onLogin) {
          onLogin(userInfo);
        }

        setFormData({ email: "", password: "" });
      } else {
        setErrors({ general: "Неверный email или пароль" });
      }
    } catch (error) {
      console.error("Ошибка авторизации:", error);
      setErrors({ general: "Произошла ошибка при авторизации" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        border: `2px solid ${theme === "light" ? "#bdc3c7" : "#34495e"}`,
        borderRadius: "10px",
        backgroundColor: theme === "light" ? "#f8f9fa" : "#2c3e50",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>Авторизация</h2>

      {errors.general && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "white",
            borderRadius: "4px",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${errors.email ? "#e74c3c" : "#bdc3c7"}`,
              borderRadius: "4px",
              backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
              color: theme === "light" ? "#000000" : "#ffffff",
              boxSizing: "border-box",
            }}
            placeholder="Введите ваш email"
            disabled={isLoading}
          />
          {errors.email && (
            <span style={{ color: "#e74c3c", fontSize: "12px" }}>
              {errors.email}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Пароль:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: `1px solid ${errors.password ? "#e74c3c" : "#bdc3c7"}`,
              borderRadius: "4px",
              backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
              color: theme === "light" ? "#000000" : "#ffffff",
              boxSizing: "border-box",
            }}
            placeholder="Введите ваш пароль"
            disabled={isLoading}
          />
          {errors.password && (
            <span style={{ color: "#e74c3c", fontSize: "12px" }}>
              {errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isLoading ? "#7f8c8d" : "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = isLoading ? "#7f8c8d" : "#219653")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = isLoading ? "#7f8c8d" : "#27ae60")
          }
          disabled={isLoading}
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
