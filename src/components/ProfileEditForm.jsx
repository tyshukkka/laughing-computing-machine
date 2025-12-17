import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ProfileEditForm = ({ user, onUpdate, onCancel }) => {
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Заполняем форму при монтировании
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

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

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
    } else if (formData.name.length < 2) {
      newErrors.name = "Имя должно быть не менее 2 символов";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Некорректный email";
    }

    // Проверка пароля только если пользователь хочет его изменить
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Новый пароль должен быть не менее 6 символов";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Подтверждение пароля обязательно";
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      }

      if (!formData.currentPassword) {
        newErrors.currentPassword =
          "Текущий пароль обязателен для смены пароля";
      }
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
      // Подготовка данных для обновления
      const updatedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };

      // Если пользователь хочет сменить пароль
      if (formData.newPassword) {
        // Проверяем текущий пароль
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const currentUser = users.find((u) => u.id === user.id);

        if (!currentUser) {
          throw new Error("Пользователь не найден");
        }

        if (currentUser.password !== formData.currentPassword) {
          throw new Error("Неверный текущий пароль");
        }

        // Добавляем новый пароль
        updatedData.password = formData.newPassword;
      }

      // Вызываем колбэк родительского компонента
      if (onUpdate) {
        await onUpdate(updatedData);
      }

      setSuccessMessage("Профиль успешно обновлен!");

      // Очищаем поля паролей
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // Автоматически скрываем сообщение через 3 секунды
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);

      if (error.message.includes("Неверный текущий пароль")) {
        setErrors({ currentPassword: error.message });
      } else if (error.message.includes("уже существует")) {
        setErrors({ email: "Этот email уже зарегистрирован" });
      } else {
        setErrors({
          general: error.message || "Произошла ошибка при обновлении профиля",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        border: `2px solid ${theme === "light" ? "#bdc3c7" : "#34495e"}`,
        borderRadius: "8px",
        backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
      }}
    >
      <h4 style={{ marginBottom: "20px" }}>Редактирование профиля</h4>

      {successMessage && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#27ae60",
            color: "white",
            borderRadius: "4px",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {successMessage}
        </div>
      )}

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
              padding: "10px",
              border: `1px solid ${errors.name ? "#e74c3c" : "#bdc3c7"}`,
              borderRadius: "4px",
              backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
              color: theme === "light" ? "#000000" : "#ffffff",
              boxSizing: "border-box",
              fontSize: "14px",
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
              padding: "10px",
              border: `1px solid ${errors.email ? "#e74c3c" : "#bdc3c7"}`,
              borderRadius: "4px",
              backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
              color: theme === "light" ? "#000000" : "#ffffff",
              boxSizing: "border-box",
              fontSize: "14px",
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

        <div
          style={{
            marginTop: "20px",
            paddingTop: "15px",
            borderTop: "1px solid #bdc3c7",
          }}
        >
          <h5 style={{ marginBottom: "15px", color: "#7f8c8d" }}>
            Смена пароля (оставьте пустым, если не хотите менять)
          </h5>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Текущий пароль:
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${
                  errors.currentPassword ? "#e74c3c" : "#bdc3c7"
                }`,
                borderRadius: "4px",
                backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
                color: theme === "light" ? "#000000" : "#ffffff",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
              placeholder="Введите текущий пароль"
              disabled={isLoading}
            />
            {errors.currentPassword && (
              <span style={{ color: "#e74c3c", fontSize: "12px" }}>
                {errors.currentPassword}
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
              Новый пароль:
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${
                  errors.newPassword ? "#e74c3c" : "#bdc3c7"
                }`,
                borderRadius: "4px",
                backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
                color: theme === "light" ? "#000000" : "#ffffff",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
              placeholder="Введите новый пароль (минимум 6 символов)"
              disabled={isLoading}
            />
            {errors.newPassword && (
              <span style={{ color: "#e74c3c", fontSize: "12px" }}>
                {errors.newPassword}
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
              Подтверждение нового пароля:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${
                  errors.confirmPassword ? "#e74c3c" : "#bdc3c7"
                }`,
                borderRadius: "4px",
                backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
                color: theme === "light" ? "#000000" : "#ffffff",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
              placeholder="Повторите новый пароль"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span style={{ color: "#e74c3c", fontSize: "12px" }}>
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="submit"
            style={{
              padding: "12px 24px",
              backgroundColor: isLoading ? "#7f8c8d" : "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              flex: 1,
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = isLoading
                ? "#7f8c8d"
                : "#219653")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = isLoading
                ? "#7f8c8d"
                : "#27ae60")
            }
            disabled={isLoading}
          >
            {isLoading ? "Сохранение..." : "Сохранить изменения"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "12px 24px",
              backgroundColor: "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              flex: 1,
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#7f8c8d")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#95a5a6")}
            disabled={isLoading}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
