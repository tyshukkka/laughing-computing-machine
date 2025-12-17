import React, { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  useGetPostsQuery,
  useGetUsersQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLazyGetPostsQuery,
} from "../../redux/apiSlice";

const Lab9 = () => {
  const { theme } = useContext(ThemeContext);

  // Состояния UI
  const [activeTab, setActiveTab] = useState("posts");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [showSimulateError, setShowSimulateError] = useState(false);

  // RTK Query хуки
  const {
    data: posts = [],
    isLoading: postsLoading,
    isError: postsError,
    error: postsErrorData,
    isFetching: postsFetching,
    refetch: refetchPosts,
  } = useGetPostsQuery(undefined, {
    // Опционально: настройки запроса
    pollingInterval: 0, // Можно включить авто-обновление
    skip: showSimulateError, // Пропустить запрос при симуляции ошибки
  });

  const {
    data: users = [],
    isLoading: usersLoading,
    isError: usersError,
    isFetching: usersFetching,
  } = useGetUsersQuery();

  // Мутации
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  // Ленивый запрос (по требованию)
  const [triggerLazyQuery, { data: lazyData, isLoading: lazyLoading }] =
    useLazyGetPostsQuery();

  // Общие состояния
  const isLoading = postsLoading || usersLoading;
  const isError = postsError || usersError;
  const isFetching = postsFetching || usersFetching;

  // Обработчики
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostBody.trim()) return;

    try {
      const newPost = {
        title: newPostTitle,
        body: newPostBody,
        userId: 1,
      };

      await createPost(newPost).unwrap();
      setNewPostTitle("");
      setNewPostBody("");
      alert("Пост успешно создан (симуляция)");
    } catch (error) {
      console.error("Ошибка создания:", error);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Удалить пост?")) {
      try {
        await deletePost(id).unwrap();
        alert("Пост удален (симуляция)");
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const handleManualRefresh = () => {
    refetchPosts();
  };

  const handleSimulateError = () => {
    setShowSimulateError(true);
    setTimeout(() => {
      setShowSimulateError(false);
      refetchPosts();
    }, 2000);
  };

  const handleLazyLoad = () => {
    triggerLazyQuery();
  };

  // Стили
  const styles = {
    container: {
      padding: "20px",
      backgroundColor: theme === "dark" ? "#1a252f" : "#ffffff",
      color: theme === "dark" ? "#ecf0f1" : "#000000",
      minHeight: "100vh",
    },
    title: {
      fontSize: "2rem",
      marginBottom: "10px",
      color: theme === "dark" ? "#3498db" : "#2c3e50",
      textAlign: "center",
    },
    subtitle: {
      textAlign: "center",
      color: theme === "dark" ? "#95a5a6" : "#666",
      marginBottom: "30px",
      maxWidth: "800px",
      margin: "0 auto 30px",
      lineHeight: "1.5",
    },
    statusBar: {
      backgroundColor: theme === "dark" ? "#2c3e50" : "#f8f9fa",
      border: `1px solid ${theme === "dark" ? "#34495e" : "#e0e0e0"}`,
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "10px",
    },
    statusBadge: (type) => ({
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "bold",
      backgroundColor:
        type === "loading"
          ? "#ff9800"
          : type === "error"
          ? "#f44336"
          : type === "success"
          ? "#4caf50"
          : "#2196f3",
      color: "white",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    }),
    spinner: {
      width: "16px",
      height: "16px",
      border: `2px solid transparent`,
      borderTop: `2px solid white`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    tabs: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    tabButton: (isActive) => ({
      padding: "10px 20px",
      backgroundColor: isActive
        ? theme === "dark"
          ? "#3498db"
          : "#2c3e50"
        : theme === "dark"
        ? "#34495e"
        : "#e0e0e0",
      color: isActive ? "white" : theme === "dark" ? "#bdc3c7" : "#333",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "all 0.3s",
    }),
    button: {
      padding: "8px 16px",
      backgroundColor: theme === "dark" ? "#3498db" : "#2c3e50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "opacity 0.2s",
      "&:hover": { opacity: 0.9 },
      "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
    },
    form: {
      backgroundColor: theme === "dark" ? "#2c3e50" : "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: `1px solid ${theme === "dark" ? "#34495e" : "#ddd"}`,
      borderRadius: "4px",
      backgroundColor: theme === "dark" ? "#1a252f" : "white",
      color: theme === "dark" ? "#ecf0f1" : "#000",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      border: `1px solid ${theme === "dark" ? "#34495e" : "#ddd"}`,
      borderRadius: "4px",
      backgroundColor: theme === "dark" ? "#1a252f" : "white",
      color: theme === "dark" ? "#ecf0f1" : "#000",
      minHeight: "100px",
      resize: "vertical",
      boxSizing: "border-box",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "50px 20px",
    },
    spinnerLarge: {
      width: "50px",
      height: "50px",
      border: `4px solid ${theme === "dark" ? "#2c3e50" : "#f3f3f3"}`,
      borderTop: `4px solid ${theme === "dark" ? "#3498db" : "#2c3e50"}`,
      borderRadius: "50%",
      margin: "0 auto 20px",
      animation: "spin 1s linear infinite",
    },
    errorContainer: {
      backgroundColor: theme === "dark" ? "#2c3e50" : "#ffecec",
      border: `1px solid ${theme === "dark" ? "#e74c3c" : "#ff8a8a"}`,
      borderRadius: "8px",
      padding: "20px",
      textAlign: "center",
      margin: "20px 0",
    },
    postsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
      marginTop: "20px",
    },
    postCard: {
      backgroundColor: theme === "dark" ? "#2c3e50" : "#ffffff",
      border: `1px solid ${theme === "dark" ? "#34495e" : "#e0e0e0"}`,
      borderRadius: "8px",
      padding: "20px",
      transition: "all 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow:
          theme === "dark"
            ? "0 10px 20px rgba(0,0,0,0.3)"
            : "0 5px 15px rgba(0,0,0,0.1)",
      },
    },
    postTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: theme === "dark" ? "#3498db" : "#2c3e50",
    },
    postBody: {
      fontSize: "14px",
      lineHeight: "1.5",
      color: theme === "dark" ? "#bdc3c7" : "#555",
      marginBottom: "15px",
    },
    postMeta: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "12px",
      color: theme === "dark" ? "#95a5a6" : "#777",
      borderTop: `1px solid ${theme === "dark" ? "#34495e" : "#eee"}`,
      paddingTop: "10px",
    },
    infoBox: {
      backgroundColor: theme === "dark" ? "#2c3e50" : "#e8f4fd",
      border: `1px solid ${theme === "dark" ? "#3498db" : "#b6d4fe"}`,
      borderRadius: "8px",
      padding: "15px",
      marginTop: "30px",
      fontSize: "14px",
      lineHeight: "1.6",
    },
  };

  // Добавляем анимацию спиннера
  React.useEffect(() => {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(
      `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
      styleSheet.cssRules.length
    );
  }, []);

  // Симуляция ошибки
  if (showSimulateError) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Лабораторная работа 9: RTK Query</h1>

        <div style={styles.errorContainer}>
          <div style={styles.spinnerLarge}></div>
          <h3>Симуляция ошибки загрузки</h3>
          <p>
            Имитация сетевой ошибки... Через 2 секунды произойдет повторная
            попытка.
          </p>
          <button
            onClick={() => setShowSimulateError(false)}
            style={styles.button}
          >
            Отменить симуляцию
          </button>
        </div>
      </div>
    );
  }

  // Состояние загрузки
  if (isLoading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Лабораторная работа 9: RTK Query</h1>
        <p style={styles.subtitle}>
          Загрузка демо-данных с JSONPlaceholder API...
        </p>

        <div style={styles.loadingContainer}>
          <div style={styles.spinnerLarge}></div>
          <p>
            {isFetching ? "Обновление данных..." : "Первоначальная загрузка..."}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: theme === "dark" ? "#95a5a6" : "#999",
            }}
          >
            Источник: https://jsonplaceholder.typicode.com
          </p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (isError) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Лабораторная работа 9: RTK Query</h1>

        <div style={styles.errorContainer}>
          <h3>Ошибка загрузки данных</h3>
          <p>
            {postsErrorData?.error || "Не удалось подключиться к демо-серверу"}
          </p>
          <p>Возможные причины:</p>
          <ul style={{ textAlign: "left", margin: "15px 0" }}>
            <li>Нет подключения к интернету</li>
            <li>Сервер JSONPlaceholder временно недоступен</li>
            <li>Проблемы с CORS (маловероятно в CodeSandbox)</li>
          </ul>
          <button onClick={handleManualRefresh} style={styles.button}>
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  // Основной контент
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Лабораторная работа 9: RTK Query</h1>

      <p style={styles.subtitle}>
        Демонстрация работы с RTK Query для загрузки данных с внешнего API
        (JSONPlaceholder). Используются хуки isLoading, isError, isFetching для
        управления состояниями загрузки.
      </p>

      {/* Статус бар */}
      <div style={styles.statusBar}>
        <div>
          <span style={styles.statusBadge(isFetching ? "loading" : "success")}>
            {isFetching && <div style={styles.spinner}></div>}
            {isFetching ? "Обновление..." : "✓ Данные загружены"}
          </span>
          <span style={{ marginLeft: "15px" }}>
            Постов: <strong>{posts.length}</strong> | Пользователей:{" "}
            <strong>{users.length}</strong>
          </span>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={handleManualRefresh}
            style={styles.button}
            disabled={isFetching}
          >
            {isFetching ? "Обновление..." : "Обновить данные"}
          </button>
          <button
            onClick={handleSimulateError}
            style={{ ...styles.button, backgroundColor: "#ff9800" }}
          >
            Сымитировать ошибку
          </button>
          <button
            onClick={handleLazyLoad}
            style={{ ...styles.button, backgroundColor: "#9c27b0" }}
          >
            Ленивая загрузка
          </button>
        </div>
      </div>

      {/* Табы */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("posts")}
          style={styles.tabButton(activeTab === "posts")}
        >
          Посты ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          style={styles.tabButton(activeTab === "users")}
        >
          Пользователи ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("create")}
          style={styles.tabButton(activeTab === "create")}
        >
          Создать пост
        </button>
      </div>

      {/* Контент в зависимости от таба */}
      {activeTab === "posts" && (
        <>
          <div style={styles.postsGrid}>
            {posts.map((post) => (
              <div key={post.id} style={styles.postCard}>
                <h3 style={styles.postTitle}>{post.title}</h3>
                <p style={styles.postBody}>{post.body}</p>
                <div style={styles.postMeta}>
                  <div>
                    <div>Автор: User {post.userId}</div>
                    <div>
                      Рейтинг: {"★".repeat(post.rating)}
                      {"☆".repeat(5 - post.rating)}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      style={{
                        ...styles.button,
                        padding: "4px 8px",
                        fontSize: "12px",
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Удаление..." : "Удалить"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "users" && (
        <div style={styles.postsGrid}>
          {users.map((user) => (
            <div key={user.id} style={styles.postCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: theme === "dark" ? "#34495e" : "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: theme === "dark" ? "#3498db" : "#2c3e50",
                  }}
                >
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{user.name}</h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: theme === "dark" ? "#95a5a6" : "#666",
                    }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
              <div style={styles.postMeta}>
                <div>
                  <div>
                    Роль: <strong>{user.role}</strong>
                  </div>
                  <div>Username: @{user.username}</div>
                </div>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor:
                      user.role === "admin" ? "#4caf50" : "#2196f3",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  {user.role === "admin" ? "Админ" : "Пользователь"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "create" && (
        <div style={styles.form}>
          <h3>Создать новый пост (симуляция)</h3>
          <input
            type="text"
            placeholder="Заголовок поста"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder="Текст поста"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            style={styles.textarea}
          />
          <button
            onClick={handleCreatePost}
            style={styles.button}
            disabled={isCreating || !newPostTitle.trim() || !newPostBody.trim()}
          >
            {isCreating ? "Создание..." : "Создать пост"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Lab9;
