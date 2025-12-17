// ==== ХРАНЕНИЕ В LOCALSTORAGE ====
const getStorageData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// ==== ПОЛЬЗОВАТЕЛИ ====
export const fetchUsers = async () => {
  console.log("📦 Загрузка пользователей из localStorage");
  return getStorageData("users", []);
};

export const registerUser = async (userData) => {
  console.log("📦 Регистрация нового пользователя:", userData.email);

  const users = await fetchUsers();

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
  setStorageData("users", users);

  // Автоматический вход
  const userInfo = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    role: newUser.role,
  };

  localStorage.setItem("currentUser", JSON.stringify(userInfo));
  console.log("✅ Пользователь зарегистрирован и сохранен");

  return newUser;
};

export const loginUser = async (email, password) => {
  console.log("📦 Вход пользователя:", email);

  const users = await fetchUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
    };

    localStorage.setItem("currentUser", JSON.stringify(userInfo));
    console.log("✅ Пользователь вошел:", user.email);
    return user;
  }

  return null;
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");
};

// ==== ОТЗЫВЫ ====
export const fetchFeedbacks = async () => {
  console.log("📦 Загрузка отзывов из localStorage");
  const feedbacks = getStorageData("feedbacks", []);

  return feedbacks.map((fb) => ({
    ...fb,
    id: fb.id.toString(),
  }));
};

export const addFeedback = async (feedback) => {
  console.log("📦 Создание нового отзыва");

  const feedbacks = await fetchFeedbacks();
  const maxId = Math.max(...feedbacks.map((fb) => parseInt(fb.id) || 0), 0);
  const newId = (maxId + 1).toString();

  const newFeedback = {
    ...feedback,
    id: newId,
    date: new Date().toLocaleDateString("ru-RU"),
    timestamp: Date.now(),
  };

  feedbacks.push(newFeedback);
  setStorageData("feedbacks", feedbacks);

  console.log("✅ Отзыв создан:", newFeedback);
  return newFeedback;
};

export const updateFeedback = async (id, feedback) => {
  console.log("📦 Обновление отзыва:", id);

  const feedbacks = await fetchFeedbacks();
  const index = feedbacks.findIndex((fb) => fb.id.toString() === id.toString());

  if (index === -1) throw new Error("Отзыв не найден");

  feedbacks[index] = {
    ...feedbacks[index],
    ...feedback,
    date: feedbacks[index].date, // Сохраняем оригинальную дату
    timestamp: feedbacks[index].timestamp, // Сохраняем оригинальный timestamp
  };

  setStorageData("feedbacks", feedbacks);

  console.log("✅ Отзыв обновлен");
  return feedbacks[index];
};

export const deleteFeedback = async (id) => {
  console.log("📦 Удаление отзыва:", id);

  const feedbacks = await fetchFeedbacks();
  const filtered = feedbacks.filter((fb) => fb.id.toString() !== id.toString());

  if (filtered.length === feedbacks.length) {
    throw new Error("Отзыв не найден");
  }

  setStorageData("feedbacks", filtered);
  console.log("✅ Отзыв удален");
  return id;
};

export const updateUserProfile = async (userId, userData) => {
  console.log("📦 Обновление профиля пользователя:", userId);

  const users = getStorageData("users", []);
  const userIndex = users.findIndex(
    (user) => user.id.toString() === userId.toString()
  );

  if (userIndex === -1) {
    throw new Error("Пользователь не найден");
  }

  // Обновляем пользователя (не перезаписываем важные поля)
  const updatedUser = {
    ...users[userIndex],
    ...userData,
    id: userId, // Сохраняем оригинальный ID
    createdAt: users[userIndex].createdAt, // Сохраняем дату создания
    role: users[userIndex].role, // Сохраняем роль
  };

  users[userIndex] = updatedUser;
  setStorageData("users", users);

  // Если это текущий пользователь - обновляем в localStorage
  const currentUser = getCurrentUser();
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

  console.log("✅ Профиль обновлен:", updatedUser.email);
  return updatedUser;
};

// ==== ИНИЦИАЛИЗАЦИЯ ====
if (typeof window !== "undefined") {
  console.log("🚀 Режим: localStorage");

  // Проверяем текущего пользователя
  const currentUser = getCurrentUser();
  if (currentUser) {
    console.log("👤 Текущий пользователь:", currentUser.email);
  }
}
