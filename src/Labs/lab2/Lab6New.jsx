import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import {
  getFeedbacks,
  createFeedback,
  editFeedback,
  removeFeedback,
} from "../../redux/feedbackSlice";
import {
  register,
  updateProfile,
  logout,
  checkStoredUser,
} from "../../redux/userSlice";

const Lab6New = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  // Получаем состояния из Redux
  const { currentUser } = useSelector((state) => state.user);
  const { items: feedbacks, loading: feedbacksLoading } = useSelector(
    (state) => state.feedbacks
  );

  // Локальные состояния
  const [message, setMessage] = useState("");

  // Проверяем сохраненного пользователя при загрузке
  useEffect(() => {
    dispatch(checkStoredUser());
  }, [dispatch]);

  // Загружаем отзывы при монтировании
  useEffect(() => {
    dispatch(getFeedbacks());
  }, [dispatch]);

  // Функция для показа сообщения с таймаутом
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Демо-функции без unwrap
  const demoRegister = () => {
    const demoUser = {
      name: "Демо Пользователь",
      email: "demo@example.com",
      password: "demo123",
    };

    dispatch(register(demoUser))
      .then(() => {
        showMessage("Демо пользователь зарегистрирован");
        setTimeout(() => {
          addDemoFeedback();
        }, 500);
      })
      .catch((error) => {
        showMessage(`Ошибка: ${error.message || "неизвестная ошибка"}`);
      });
  };

  const demoUpdateProfile = () => {
    if (!currentUser) {
      showMessage("");
      return;
    }

    const oldEmail = currentUser.email;
    const updatedData = {
      name: "Обновленный Демо Пользователь",
      email: "updated.demo@example.com",
    };

    // Вызываем updateProfile с двумя аргументами
    dispatch(updateProfile(currentUser.id, updatedData))
      .then(() => {
        showMessage("Профиль обновлен");

        // Обновляем имя и email во всех отзывах пользователя
        if (oldEmail && updatedData.email) {
          // Находим и обновляем все отзывы со старым email
          feedbacks.forEach((feedback) => {
            if (feedback.email === oldEmail) {
              const updatedFeedback = {
                ...feedback,
                author: updatedData.name,
                email: updatedData.email,
              };

              dispatch(
                editFeedback({ id: feedback.id, feedback: updatedFeedback })
              ).catch((error) => {
                console.error("Ошибка обновления отзыва:", error);
              });
            }
          });
        }
      })
      .catch((error) => {
        showMessage(`Ошибка: ${error.message || "неизвестная ошибка"}`);
      });
  };

  const addDemoFeedback = () => {
    if (!currentUser) {
      showMessage("");
      return;
    }

    const demoFeedback = {
      author: currentUser.name,
      email: currentUser.email,
      rating: 5,
      message:
        "Отличная реализация REST API! Очень понравилась работа с формами и Redux.",
      date: new Date().toLocaleDateString("ru-RU"),
      timestamp: Date.now(),
    };

    dispatch(createFeedback(demoFeedback))
      .then(() => {
        showMessage("Демо-отзыв добавлен");
      })
      .catch((error) => {
        showMessage(`Ошибка: ${error.message || "неизвестная ошибка"}`);
      });
  };

  const demoDeleteFeedback = () => {
    if (feedbacks.length === 0) {
      showMessage("Нет отзывов для удаления");
      return;
    }

    const lastFeedback = feedbacks[0];
    dispatch(removeFeedback(lastFeedback.id))
      .then(() => {
        showMessage("Отзыв удален");
      })
      .catch((error) => {
        showMessage(`Ошибка: ${error.message || "неизвестная ошибка"}`);
      });
  };

  const demoEditFeedback = () => {
    if (feedbacks.length === 0) {
      showMessage("Нет отзывов для редактирования");
      return;
    }

    const lastFeedback = feedbacks[0];
    const updatedFeedback = {
      ...lastFeedback,
      rating: 4,
      message: "Отредактированный отзыв: все работает отлично!",
    };

    dispatch(editFeedback({ id: lastFeedback.id, feedback: updatedFeedback }))
      .then(() => {
        showMessage("Отзыв отредактирован");
      })
      .catch((error) => {
        showMessage(`Ошибка: ${error.message || "неизвестная ошибка"}`);
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    showMessage("Выход выполнен");
  };

  const refreshFeedbacks = () => {
    dispatch(getFeedbacks());
    showMessage("Список отзывов обновлен");
  };

  // Проверяем, принадлежит ли отзыв текущему пользователю (по email)
  const isUserFeedback = (feedbackEmail) => {
    return currentUser && currentUser.email === feedbackEmail;
  };

  // Стили для разных тем
  const containerStyle = {
    backgroundColor: theme === "light" ? "#ffffff" : "#1a252f",
    color: theme === "light" ? "#000000" : "#ecf0f1",
    minHeight: "100vh",
    padding: "20px",
  };

  const cardStyle = {
    backgroundColor: theme === "light" ? "#f8f9fa" : "#2c3e50",
    border: `1px solid ${theme === "light" ? "#dee2e6" : "#34495e"}`,
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  };

  const buttonStyle = (color) => ({
    padding: "10px 15px",
    backgroundColor: color,
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px",
    fontSize: "14px",
    fontWeight: "normal",
  });

  const messageStyle = {
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    backgroundColor: message.includes("Ошибка") ? "#f8d7da" : "#d4edda",
    border: `1px solid ${message.includes("Ошибка") ? "#f5c6cb" : "#c3e6cb"}`,
    color: message.includes("Ошибка") ? "#721c24" : "#155724",
    transition: "opacity 0.3s ease",
    opacity: message ? 1 : 0,
  };

  return (
    <div style={containerStyle}>
      <h2
        style={{
          marginBottom: "20px",
          color: theme === "light" ? "#2c3e50" : "#ecf0f1",
        }}
      >
        Лабораторная работа 6
      </h2>

      {/* Сообщения */}
      <div style={messageStyle}>{message}</div>

      {/* Панель управления */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {!currentUser ? (
            <button style={buttonStyle("#3498db")} onClick={demoRegister}>
              1. Демо-регистрация (POST)
            </button>
          ) : (
            <>
              <button
                style={buttonStyle("#9b59b6")}
                onClick={demoUpdateProfile}
              >
                2. Обновить профиль (PUT)
              </button>
              <button style={buttonStyle("#27ae60")} onClick={addDemoFeedback}>
                3. Добавить отзыв (POST)
              </button>
              <button style={buttonStyle("#f39c12")} onClick={demoEditFeedback}>
                4. Редактировать отзыв (PUT)
              </button>
              <button
                style={buttonStyle("#e74c3c")}
                onClick={demoDeleteFeedback}
              >
                5. Удалить отзыв (DELETE)
              </button>
              <button style={buttonStyle("#95a5a6")} onClick={handleLogout}>
                Выйти
              </button>
            </>
          )}
        </div>

        {currentUser && (
          <div
            style={{
              padding: "15px",
              backgroundColor: theme === "light" ? "#e8f4f8" : "#34495e",
              borderRadius: "6px",
              marginTop: "10px",
            }}
          >
            <h5 style={{ marginBottom: "10px" }}>Текущий пользователь:</h5>
            <p>
              <strong>Имя:</strong> {currentUser.name}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
              <strong>ID:</strong> {currentUser.id}
            </p>
          </div>
        )}
      </div>

      {/* Список отзывов */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ margin: 0 }}>Список отзывов (GET запрос)</h4>
          <button
            onClick={refreshFeedbacks}
            style={buttonStyle("#2ecc71")}
            disabled={feedbacksLoading}
          >
            {feedbacksLoading ? "Загрузка..." : "Обновить (GET)"}
          </button>
        </div>

        {feedbacksLoading ? (
          <p>Загрузка отзывов...</p>
        ) : feedbacks.length === 0 ? (
          <p>Нет отзывов.</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {feedbacks.map((feedback, index) => (
              <div
                key={feedback.id}
                style={{
                  padding: "15px",
                  border: `1px solid ${
                    theme === "light" ? "#dee2e6" : "#34495e"
                  }`,
                  borderRadius: "6px",
                  backgroundColor: theme === "light" ? "#ffffff" : "#34495e",
                  borderLeft: `4px solid ${
                    isUserFeedback(feedback.email) ? "#3498db" : "#27ae60"
                  }`,
                  position: "relative",
                }}
              >
                {isUserFeedback(feedback.email) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#3498db",
                      color: "white",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    Ваш отзыв
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <strong>{feedback.author}</strong>
                    <div style={{ fontSize: "14px", color: "#7f8c8d" }}>
                      {feedback.email}
                    </div>
                  </div>
                  <div style={{ fontSize: "14px", color: "#7f8c8d" }}>
                    {feedback.date}
                  </div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < feedback.rating ? "#f39c12" : "#bdc3c7",
                        fontSize: "18px",
                      }}
                    >
                      ★
                    </span>
                  ))}
                  <span style={{ marginLeft: "10px" }}>
                    {feedback.rating}/5
                  </span>
                </div>

                <p style={{ marginBottom: "15px" }}>{feedback.message}</p>

                <div style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
                  <span style={{ color: "#7f8c8d" }}>ID: {feedback.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lab6New;
