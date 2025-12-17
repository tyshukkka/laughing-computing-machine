// src/api/mockApi.js
const API_DELAY = 500; // Имитация задержки сети

// ==== ПОЛЬЗОВАТЕЛИ ====
export const mockUsers = {
  items: [
    {
      id: "1",
      name: "Демо пользователь",
      email: "demo@example.com",
      password: "demo123",
      createdAt: new Date().toISOString(),
      role: "user",
    },
  ],

  // GET /users
  getUsers: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("mockUsers") || "[]");
        if (users.length === 0) {
          localStorage.setItem("mockUsers", JSON.stringify(mockUsers.items));
          resolve([...mockUsers.items]);
        } else {
          resolve([...users]);
        }
      }, API_DELAY);
    });
  },

  // POST /users/register
  register: (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("mockUsers") || "[]");

        // Проверка email
        if (users.some((user) => user.email === userData.email)) {
          reject(new Error("Пользователь с таким email уже существует"));
          return;
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
        localStorage.setItem("mockUsers", JSON.stringify(users));

        // Автоматически логиним пользователя
        const userInfo = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
          role: newUser.role,
        };

        localStorage.setItem("currentUser", JSON.stringify(userInfo));

        resolve({ ...newUser, token: `mock-token-${newId}` });
      }, API_DELAY);
    });
  },

  // POST /users/login
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("mockUsers") || "[]");
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            role: user.role,
          };

          localStorage.setItem("currentUser", JSON.stringify(userInfo));
          resolve({ ...user, token: `mock-token-${user.id}` });
        } else {
          reject(new Error("Неверный email или пароль"));
        }
      }, API_DELAY);
    });
  },

  // PUT /users/:id
  updateUser: (userId, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("mockUsers") || "[]");
        const userIndex = users.findIndex((u) => u.id === userId);

        if (userIndex === -1) {
          reject(new Error("Пользователь не найден"));
          return;
        }

        // Проверка email (если меняется)
        if (userData.email && userData.email !== users[userIndex].email) {
          const emailExists = users.some(
            (u, index) => index !== userIndex && u.email === userData.email
          );
          if (emailExists) {
            reject(new Error("Пользователь с таким email уже существует"));
            return;
          }
        }

        // Обновляем пользователя
        const updatedUser = {
          ...users[userIndex],
          ...userData,
          id: userId,
          createdAt: users[userIndex].createdAt,
          role: users[userIndex].role,
        };

        users[userIndex] = updatedUser;
        localStorage.setItem("mockUsers", JSON.stringify(users));

        // Обновляем текущего пользователя если это он
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "null"
        );
        if (currentUser && currentUser.id === userId) {
          const userInfo = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
            role: updatedUser.role,
          };
          localStorage.setItem("currentUser", JSON.stringify(userInfo));
        }

        resolve(updatedUser);
      }, API_DELAY);
    });
  },

  // DELETE /users/logout
  logout: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("currentUser");
        resolve({ success: true });
      }, API_DELAY);
    });
  },
};

// ==== ОТЗЫВЫ ====
export const mockFeedbacks = {
  items: [
    {
      id: "1",
      author: "Демо пользователь",
      email: "demo@example.com",
      rating: 5,
      message:
        "Отличный проект для лабораторной работы! Очень понравилась реализация форм.",
      date: new Date().toLocaleDateString("ru-RU"),
      timestamp: Date.now(),
    },
  ],

  // GET /feedbacks
  getFeedbacks: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedbacks = JSON.parse(
          localStorage.getItem("mockFeedbacks") || "[]"
        );
        if (feedbacks.length === 0) {
          localStorage.setItem(
            "mockFeedbacks",
            JSON.stringify(mockFeedbacks.items)
          );
          resolve([...mockFeedbacks.items]);
        } else {
          resolve([...feedbacks]);
        }
      }, API_DELAY);
    });
  },

  // POST /feedbacks
  createFeedback: (feedbackData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedbacks = JSON.parse(
          localStorage.getItem("mockFeedbacks") || "[]"
        );
        const maxId = Math.max(
          ...feedbacks.map((fb) => parseInt(fb.id) || 0),
          0
        );
        const newId = (maxId + 1).toString();

        const newFeedback = {
          ...feedbackData,
          id: newId,
          date: new Date().toLocaleDateString("ru-RU"),
          timestamp: Date.now(),
        };

        feedbacks.push(newFeedback);
        localStorage.setItem("mockFeedbacks", JSON.stringify(feedbacks));
        resolve(newFeedback);
      }, API_DELAY);
    });
  },

  // PUT /feedbacks/:id
  updateFeedback: (id, feedbackData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const feedbacks = JSON.parse(
          localStorage.getItem("mockFeedbacks") || "[]"
        );
        const index = feedbacks.findIndex(
          (fb) => fb.id.toString() === id.toString()
        );

        if (index === -1) {
          reject(new Error("Отзыв не найден"));
          return;
        }

        const updatedFeedback = {
          ...feedbacks[index],
          ...feedbackData,
          id: id,
          date: feedbacks[index].date,
          timestamp: feedbacks[index].timestamp,
        };

        feedbacks[index] = updatedFeedback;
        localStorage.setItem("mockFeedbacks", JSON.stringify(feedbacks));
        resolve(updatedFeedback);
      }, API_DELAY);
    });
  },

  // DELETE /feedbacks/:id
  deleteFeedback: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const feedbacks = JSON.parse(
          localStorage.getItem("mockFeedbacks") || "[]"
        );
        const filtered = feedbacks.filter(
          (fb) => fb.id.toString() !== id.toString()
        );

        if (filtered.length === feedbacks.length) {
          reject(new Error("Отзыв не найден"));
          return;
        }

        localStorage.setItem("mockFeedbacks", JSON.stringify(filtered));
        resolve(id);
      }, API_DELAY);
    });
  },
};

// ==== ОБЩИЙ API ИНТЕРФЕЙС ====
export const api = {
  // Пользователи
  fetchUsers: mockUsers.getUsers,
  registerUser: mockUsers.register,
  loginUser: mockUsers.login,
  updateUserProfile: mockUsers.updateUser,
  logoutUser: mockUsers.logout,

  // Отзывы
  fetchFeedbacks: mockFeedbacks.getFeedbacks,
  addFeedback: mockFeedbacks.createFeedback,
  updateFeedback: mockFeedbacks.updateFeedback,
  deleteFeedback: mockFeedbacks.deleteFeedback,

  // Вспомогательные функции
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("currentUser");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
};

// Экспорт для совместимости со старым кодом
export default api;
