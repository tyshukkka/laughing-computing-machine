// src/components/FeedbackSection.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../context/ThemeContext";
import {
  getFeedbacks,
  createFeedback,
  editFeedback,
  removeFeedback,
  resetEditing,
} from "../redux/feedbackSlice";

// Вспомогательная функция для нормализации ID
const normalizeId = (id) => {
  if (id == null) return "";
  return id.toString();
};

// Функция для безопасного сравнения ID
const idsEqual = (id1, id2) => {
  return normalizeId(id1) === normalizeId(id2);
};

const FeedbackSection = ({ currentUser }) => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  // Получаем данные из Redux store
  const {
    items: feedbacks,
    loading,
    error,
  } = useSelector((state) => state.feedbacks);

  const [formData, setFormData] = useState({
    author: "",
    email: "",
    rating: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Загружаем отзывы с сервера при монтировании компонента
  useEffect(() => {
    dispatch(getFeedbacks());
  }, [dispatch]);

  // Автоматически заполняем поля при изменении currentUser
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        author: currentUser.name || "",
        email: currentUser.email || "",
      }));
    } else {
      setFormData({
        author: "",
        email: "",
        rating: "",
        message: "",
      });
    }
  }, [currentUser]);

  // Сбрасываем режим редактирования при размонтировании
  useEffect(() => {
    return () => {
      dispatch(resetEditing());
    };
  }, [dispatch]);

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

    if (!formData.rating) {
      newErrors.rating = "Выберите оценку";
    } else if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Оценка должна быть от 1 до 5";
    }

    if (!formData.message) {
      newErrors.message = "Сообщение обязательно";
    } else if (formData.message.length < 10) {
      newErrors.message = "Сообщение должно быть не менее 10 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(
    async (e) => {
      // Предотвращаем перезагрузку страницы
      if (e && e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (!validateForm()) {
        return;
      }

      const feedbackData = {
        author: formData.author,
        email: formData.email,
        rating: formData.rating,
        message: formData.message,
        date: new Date().toLocaleDateString("ru-RU"),
        timestamp: Date.now(),
      };

      try {
        if (isEditing && editingId) {
          await dispatch(
            editFeedback({
              id: editingId.toString(),
              feedback: feedbackData,
            })
          );

          setSuccessMessage("Отзыв успешно обновлен!");
          setIsEditing(false);
          setEditingId(null);
        } else {
          await dispatch(createFeedback(feedbackData));
          setSuccessMessage("Спасибо за ваш отзыв!");
        }

        setFormData((prev) => ({
          ...prev,
          rating: "",
          message: "",
        }));

        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Ошибка при отправке отзыва:", error);
        setErrors({ general: "Произошла ошибка при отправке отзыва" });
      }
    },
    [formData, dispatch, isEditing, editingId]
  );

  const handleDeleteFeedback = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот отзыв?")) {
      try {
        const stringId = id.toString();

        if (isEditing && editingId && idsEqual(editingId, stringId)) {
          setIsEditing(false);
          setEditingId(null);
          setFormData((prev) => ({
            ...prev,
            rating: "",
            message: "",
          }));
        }

        await dispatch(removeFeedback(stringId));
        setSuccessMessage("Отзыв успешно удален!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Ошибка при удалении отзыва:", error);
        setErrors({ general: "Произошла ошибка при удалении отзыва" });
      }
    }
  };

  const handleEditFeedback = (feedback) => {
    setIsEditing(true);
    setEditingId(feedback.id.toString());

    setFormData({
      author: feedback.author,
      email: feedback.email,
      rating: feedback.rating.toString(),
      message: feedback.message,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData((prev) => ({
      ...prev,
      rating: "",
      message: "",
    }));
    setSuccessMessage("Редактирование отменено");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "25px",
        border: `2px solid ${theme === "light" ? "#bdc3c7" : "#34495e"}`,
        borderRadius: "10px",
        backgroundColor: theme === "light" ? "#f8f9fa" : "#34495e",
      }}
    >
      <div style={{ marginBottom: "25px" }}>
        <h3 style={{ margin: 0 }}>Обратная связь</h3>
        {isEditing && (
          <div
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#3498db",
              color: "white",
              borderRadius: "4px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            Режим редактирования отзыва
          </div>
        )}
      </div>

      {/* Сообщения об ошибках/успехе */}
      {error && (
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
          Ошибка: {error}
        </div>
      )}

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

      {/* Форма обратной связи */}
      <div style={{ marginBottom: "30px" }}>
        <h4 style={{ marginBottom: "15px" }}>
          {isEditing ? "Редактирование отзыва" : "Оставить отзыв"}
        </h4>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Ваше имя:
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.author ? "#e74c3c" : "#bdc3c7"}`,
                borderRadius: "4px",
                backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
                color: theme === "light" ? "#000000" : "#ffffff",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
              placeholder="Введите ваше имя"
              readOnly={!!currentUser || isEditing}
            />
            {errors.author && (
              <span style={{ color: "#e74c3c", fontSize: "12px" }}>
                {errors.author}
              </span>
            )}
          </div>

          <div>
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
                backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
                color: theme === "light" ? "#000000" : "#ffffff",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
              placeholder="Введите ваш email"
              readOnly={!!currentUser || isEditing}
            />
            {errors.email && (
              <span style={{ color: "#e74c3c", fontSize: "12px" }}>
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Оценка:
            </label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.rating ? "#e74c3c" : "#bdc3c7"}`,
                borderRadius: "4px",
                backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
                color: theme === "light" ? "#000000" : "#ffffff",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
            >
              <option value="">Выберите оценку</option>
              <option value="5">Отлично (5)</option>
              <option value="4">Хорошо (4)</option>
              <option value="3">Удовлетворительно (3)</option>
              <option value="2">Плохо (2)</option>
              <option value="1">Очень плохо (1)</option>
            </select>
            {errors.rating && (
              <span style={{ color: "#e74c3c", fontSize: "12px" }}>
                {errors.rating}
              </span>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Сообщение:
            </label>
            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.message ? "#e74c3c" : "#bdc3c7"}`,
                borderRadius: "4px",
                backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
                color: theme === "light" ? "#000000" : "#ffffff",
                boxSizing: "border-box",
                resize: "vertical",
                fontSize: "14px",
              }}
              placeholder="Напишите ваш отзыв..."
            />
            {errors.message && (
              <span style={{ color: "#e74c3c", fontSize: "12px" }}>
                {errors.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading
                ? "#95a5a6"
                : isEditing
                ? "#3498db"
                : "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = isEditing
                  ? "#2980b9"
                  : "#219653";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = isEditing
                  ? "#3498db"
                  : "#27ae60";
              }
            }}
            disabled={loading}
          >
            {loading
              ? "Отправка..."
              : isEditing
              ? "Обновить отзыв"
              : "Отправить отзыв"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={cancelEditing}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#7f8c8d")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#95a5a6")}
            >
              Отменить редактирование
            </button>
          )}
        </form>
      </div>

      {/* Список отзывов */}
      <div>
        <h4 style={{ marginBottom: "15px" }}>
          Список отзывов ({feedbacks.length})
          {loading && (
            <span
              style={{ fontSize: "12px", color: "#7f8c8d", marginLeft: "10px" }}
            >
              загрузка...
            </span>
          )}
        </h4>

        {feedbacks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#7f8c8d",
              border: `2px dashed ${theme === "light" ? "#bdc3c7" : "#34495e"}`,
              borderRadius: "8px",
              backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
            }}
          >
            <p style={{ fontSize: "16px", marginBottom: "10px" }}>
              {loading ? "Загрузка отзывов..." : "Пока нет отзывов"}
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                style={{
                  padding: "20px",
                  border: `2px solid ${
                    theme === "light" ? "#bdc3c7" : "#34495e"
                  }`,
                  borderRadius: "8px",
                  backgroundColor: theme === "light" ? "#ffffff" : "#2c3e50",
                  borderLeft:
                    currentUser?.email === feedback.email
                      ? "4px solid #3498db"
                      : "none",
                  position: "relative",
                }}
              >
                {/* Метка "ваш отзыв" */}
                {currentUser?.email === feedback.email && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#3498db",
                      color: "white",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold",
                    }}
                  >
                    ваш отзыв
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        fontSize: "16px",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      {feedback.author}
                    </strong>
                    <span style={{ color: "#7f8c8d", fontSize: "14px" }}>
                      {feedback.email}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#7f8c8d" }}>
                      {feedback.date}
                    </span>
                  </div>
                </div>

                {/* Рейтинг */}
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
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
                    <span
                      style={{
                        marginLeft: "8px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {feedback.rating}/5
                    </span>
                  </div>
                </div>

                {/* Сообщение */}
                <p
                  style={{
                    margin: 0,
                    lineHeight: "1.6",
                    fontSize: "14px",
                    color: theme === "light" ? "#2c3e50" : "#ecf0f1",
                  }}
                >
                  {feedback.message}
                </p>

                {/* Кнопки действий */}
                {currentUser?.email === feedback.email && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "15px",
                      paddingTop: "15px",
                      borderTop: `1px solid ${
                        theme === "light" ? "#ecf0f1" : "#2c3e50"
                      }`,
                    }}
                  >
                    <button
                      onClick={() => handleEditFeedback(feedback)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor:
                          isEditing && idsEqual(feedback.id, editingId)
                            ? "#f39c12"
                            : "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {isEditing && idsEqual(feedback.id, editingId)
                        ? "Редактируется..."
                        : "Редактировать"}
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(feedback.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection;
