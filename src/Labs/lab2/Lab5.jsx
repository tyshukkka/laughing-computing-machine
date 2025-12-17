import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Container from "../../components/Container";
import HeaderWithProfile from "../../components/HeaderWithProfile";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";
import FeedbackSection from "../../components/FeedbackSection";
import ProfileEditForm from "../../components/ProfileEditForm";

const Lab5 = () => {
  const { theme } = useContext(ThemeContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("login");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Проверяем пользователя при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (e) {
        console.error("❌ Ошибка парсинга пользователя:", e);
      }
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    setActiveTab("login");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsEditingProfile(false);
  };

  const handleUpdateProfile = async (updatedUserData) => {
    try {
      // 1. Обновляем в массиве всех пользователей
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u) => u.id === currentUser.id);

      if (userIndex === -1) {
        throw new Error("Пользователь не найден");
      }

      // 2. Проверяем уникальность email (если email изменился)
      if (
        updatedUserData.email &&
        updatedUserData.email !== users[userIndex].email
      ) {
        const emailExists = users.some(
          (u, index) => index !== userIndex && u.email === updatedUserData.email
        );
        if (emailExists) {
          throw new Error("Пользователь с таким email уже существует");
        }
      }

      // 3. Обновляем данные пользователя
      const updatedUser = {
        ...users[userIndex],
        ...updatedUserData,
        id: users[userIndex].id,
        createdAt: users[userIndex].createdAt,
        role: users[userIndex].role,
      };

      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));

      // 4. Обновляем текущего пользователя
      const userInfo = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        role: updatedUser.role,
      };

      localStorage.setItem("currentUser", JSON.stringify(userInfo));
      setCurrentUser(userInfo);

      // 5. Обновляем все отзывы этого пользователя
      const feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
      const updatedFeedbacks = feedbacks.map((fb) => {
        if (fb.email === currentUser.email) {
          return {
            ...fb,
            author: updatedUserData.name || fb.author,
            email: updatedUserData.email || fb.email,
          };
        }
        return fb;
      });
      localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));

      // 6. Скрываем форму
      setIsEditingProfile(false);

      // 7. Показываем сообщение об успехе
      setTimeout(() => {
        alert("Профиль успешно обновлен! Все ваши отзывы также обновлены.");
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("❌ Ошибка обновления профиля:", error);

      let errorMessage = "Ошибка при обновлении профиля";

      if (error.message.includes("уже существует")) {
        errorMessage = "Этот email уже зарегистрирован другим пользователем";
      } else if (error.message.includes("не найден")) {
        errorMessage = "Пользователь не найден";
      } else {
        errorMessage = error.message;
      }

      alert(`❌ ${errorMessage}`);
    }
  };

  // Если нет пользователя - показываем формы
  if (!currentUser) {
    return (
      <div
        style={{
          backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
          color: theme === "light" ? "#000000" : "#ffffff",
          minHeight: "100vh",
          transition: "all 0.3s ease",
        }}
      >
        <header
          style={{
            backgroundColor: "#2c3e50",
            color: "#ecf0f1",
            padding: "12px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 700 }}>
            Лабораторная работа 5 - Авторизация
          </div>
        </header>

        <Container>
          <h1
            style={{
              textAlign: "center",
              marginBottom: "10px",
              fontSize: window.innerWidth < 768 ? "1.5rem" : "2rem",
            }}
          >
            Лабораторная работа 5
          </h1>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
              fontSize: window.innerWidth < 768 ? "1rem" : "1.5rem",
              color: "#7f8c8d",
            }}
          >
            Формы авторизации, регистрации и обратной связи
          </h2>

          {/* Табы для переключения между логином и регистрацией */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "30px",
              borderBottom: `2px solid ${
                theme === "light" ? "#bdc3c7" : "#34495e"
              }`,
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              alignItems: window.innerWidth < 768 ? "stretch" : "center",
            }}
          >
            <button
              onClick={() => setActiveTab("login")}
              style={{
                padding: window.innerWidth < 768 ? "15px 20px" : "10px 30px",
                backgroundColor:
                  activeTab === "login" ? "#3498db" : "transparent",
                color:
                  activeTab === "login"
                    ? "white"
                    : theme === "light"
                    ? "#2c3e50"
                    : "#ecf0f1",
                border: "none",
                borderBottom:
                  activeTab === "login" ? "2px solid #3498db" : "none",
                borderRight:
                  window.innerWidth < 768
                    ? "none"
                    : activeTab === "login"
                    ? "2px solid #3498db"
                    : "none",
                cursor: "pointer",
                fontSize: window.innerWidth < 768 ? "14px" : "16px",
                fontWeight: activeTab === "login" ? "bold" : "normal",
                flex: window.innerWidth < 768 ? 1 : "auto",
                marginBottom: window.innerWidth < 768 ? "5px" : "0",
              }}
            >
              Вход
            </button>
            <button
              onClick={() => setActiveTab("register")}
              style={{
                padding: window.innerWidth < 768 ? "15px 20px" : "10px 30px",
                backgroundColor:
                  activeTab === "register" ? "#3498db" : "transparent",
                color:
                  activeTab === "register"
                    ? "white"
                    : theme === "light"
                    ? "#2c3e50"
                    : "#ecf0f1",
                border: "none",
                borderBottom:
                  activeTab === "register" ? "2px solid #3498db" : "none",
                cursor: "pointer",
                fontSize: window.innerWidth < 768 ? "14px" : "16px",
                fontWeight: activeTab === "register" ? "bold" : "normal",
                flex: window.innerWidth < 768 ? 1 : "auto",
              }}
            >
              Регистрация
            </button>
          </div>

          <div
            style={{
              maxWidth: window.innerWidth < 768 ? "100%" : "400px",
              margin: window.innerWidth < 768 ? "0 auto" : "50px auto",
              padding: window.innerWidth < 768 ? "20px" : "30px",
            }}
          >
            {activeTab === "login" ? (
              <LoginForm onLogin={handleLogin} />
            ) : (
              <RegisterForm onRegister={handleRegister} />
            )}
          </div>
        </Container>
      </div>
    );
  }

  // ЕСТЬ пользователь - показываем FeedbackSection
  return (
    <div
      style={{
        backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
        color: theme === "light" ? "#000000" : "#ffffff",
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      <HeaderWithProfile user={currentUser} onLogout={handleLogout} />

      <Container>
        <h1
          style={{
            marginBottom: "5px",
            fontSize: window.innerWidth < 768 ? "1.5rem" : "2rem",
          }}
        >
          Лабораторная работа 5
        </h1>
        <p
          style={{
            color: "#7f8c8d",
            marginBottom: "30px",
            fontSize: window.innerWidth < 768 ? "0.9rem" : "1rem",
          }}
        >
          Формы авторизации, регистрации и обратной связи
        </p>

        {/* Панель приветствия */}
        <div
          style={{
            padding: window.innerWidth < 768 ? "15px" : "20px",
            backgroundColor: theme === "light" ? "#ecf0f1" : "#34495e",
            borderRadius: "8px",
            marginBottom: "30px",
            borderLeft: "4px solid #27ae60",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: window.innerWidth < 768 ? "flex-start" : "center",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              gap: window.innerWidth < 768 ? "15px" : "0",
            }}
          >
            <div style={{ flex: 1 }}>
              <h3
                style={{
                  color: "#27ae60",
                  marginBottom: "10px",
                  fontSize: window.innerWidth < 768 ? "1.1rem" : "1.3rem",
                }}
              >
                Добро пожаловать, {currentUser.name}!
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: window.innerWidth < 768 ? "13px" : "15px",
                  marginBottom: "5px",
                }}
              >
                Email: {currentUser.email}
              </p>
              {currentUser.createdAt && (
                <p
                  style={{
                    margin: "5px 0 0 0",
                    fontSize: window.innerWidth < 768 ? "11px" : "13px",
                    color: "#7f8c8d",
                  }}
                >
                  Зарегистрирован:{" "}
                  {new Date(currentUser.createdAt).toLocaleDateString("ru-RU")}
                </p>
              )}
            </div>
            <div
              style={{
                width: window.innerWidth < 768 ? "100%" : "auto",
                display: "flex",
                justifyContent: window.innerWidth < 768 ? "center" : "flex-end",
              }}
            >
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{
                  padding: window.innerWidth < 768 ? "12px 15px" : "10px 20px",
                  backgroundColor: isEditingProfile ? "#95a5a6" : "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: window.innerWidth < 768 ? "12px" : "14px",
                  fontWeight: "bold",
                  transition: "background-color 0.3s",
                  width: window.innerWidth < 768 ? "100%" : "auto",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = isEditingProfile
                    ? "#7f8c8d"
                    : "#2980b9")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = isEditingProfile
                    ? "#95a5a6"
                    : "#3498db")
                }
              >
                {isEditingProfile ? "Отменить" : "Редактировать профиль"}
              </button>
            </div>
          </div>

          {/* Форма редактирования профиля */}
          {isEditingProfile && (
            <div style={{ marginTop: "20px" }}>
              <ProfileEditForm
                user={currentUser}
                onUpdate={handleUpdateProfile}
                onCancel={() => setIsEditingProfile(false)}
              />
            </div>
          )}
        </div>

        {/* FeedbackSection */}
        <div
          style={{
            marginTop: window.innerWidth < 768 ? "20px" : "30px",
          }}
        >
          <FeedbackSection currentUser={currentUser} />
        </div>
      </Container>
    </div>
  );
};

export default Lab5;
