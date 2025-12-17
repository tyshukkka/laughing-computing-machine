// src/components/RegisterForm.jsx
import React, { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

const RegisterForm = ({ onRegister }) => {
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Добавьте состояние загрузки

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

    if (!formData.name) {
      newErrors.name = "Имя обязательно";
    } else if (formData.name.length < 2) {
      newErrors.name = "Имя должно быть не менее 2 символов";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Подтверждение пароля обязательно";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      try {
        // Регистрация через API
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        // Инициализируем users если пусто
        if (!localStorage.getItem("users")) {
          localStorage.setItem("users", JSON.stringify([]));
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Проверка email
        if (users.some((user) => user.email === userData.email)) {
          throw new Error("Пользователь с таким email уже существует");
        }

        // Создание нового ID
        const maxId = Math.max(...users.map((u) => parseInt(u.id) || 0), 0);
        const newId = (maxId + 1).toString();

        const newUser = {
          ...userData,
          id: newId,
          createdAt: new Date().toISOString(),
          role: "user",
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        const userInfo = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
          role: newUser.role,
        };

        localStorage.setItem("currentUser", JSON.stringify(userInfo));

        // Вызываем колбэк родительского компонента
        if (onRegister) {
          onRegister(userInfo);
        }

        // Очищаем форму
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });

        alert("Регистрация успешна! Вы автоматически вошли в систему.");
      } catch (error) {
        console.error("Ошибка регистрации:", error);

        // Проверяем конкретные ошибки
        if (error.message.includes("уже существует")) {
          setErrors({ email: "Этот email уже зарегистрирован" });
        } else {
          setErrors({
            general: error.message || "Произошла ошибка при регистрации",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData, onRegister]
  );

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "30px auto",
        padding: "25px",
        border: `2px solid ${theme === "light" ? "#bdc3c7" : "#34495e"}`,
        borderRadius: "10px",
        backgroundColor: theme === "light" ? "#f8f9fa" : "#2c3e50",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Регистрация</h3>

      {/* Показываем общую ошибку */}
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

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Имя:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${errors.name ? "#e74c3c" : "#bdc3c7"}`,
              borderRadius: "4px",
              backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
              color: theme === "light" ? "#000000" : "#ffffff",
              boxSizing: "border-box",
            }}
            placeholder="Введите ваше имя"
            disabled={isLoading}
          />
          {errors.name && (
            <span style={{ color: "#e74c3c", fontSize: "12px" }}>
              {errors.name}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
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
              padding: "8px",
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

        <div style={{ marginBottom: "15px" }}>
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
              padding: "8px",
              border: `1px solid ${errors.password ? "#e74c3c" : "#bdc3c7"}`,
              borderRadius: "4px",
              backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
              color: theme === "light" ? "#000000" : "#ffffff",
              boxSizing: "border-box",
            }}
            placeholder="Придумайте пароль"
            disabled={isLoading}
          />
          {errors.password && (
            <span style={{ color: "#e74c3c", fontSize: "12px" }}>
              {errors.password}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Подтверждение пароля:
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${
                errors.confirmPassword ? "#e74c3c" : "#bdc3c7"
              }`,
              borderRadius: "4px",
              backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
              color: theme === "light" ? "#000000" : "#ffffff",
              boxSizing: "border-box",
            }}
            placeholder="Повторите пароль"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <span style={{ color: "#e74c3c", fontSize: "12px" }}>
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isLoading ? "#7f8c8d" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
