// src/redux/feedbackSlice.js
import { createSlice } from "@reduxjs/toolkit";

const feedbackSlice = createSlice({
  name: "feedbacks",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentFeedback: null,
  },
  reducers: {
    addFeedback: (state, action) => {
      const newFeedback = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        date: action.payload.date || new Date().toLocaleDateString("ru-RU"),
      };
      state.items.unshift(newFeedback);
      state.error = null;
    },

    updateFeedback: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.error = null;
    },

    deleteFeedback: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.error = null;
    },

    setFeedbacks: (state, action) => {
      state.items = action.payload;
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setCurrentFeedback: (state, action) => {
      state.currentFeedback = action.payload;
    },

    clearCurrentFeedback: (state) => {
      state.currentFeedback = null;
    },

    resetEditing: (state) => {
      state.currentFeedback = null;
    },
  },
});

// Экспортируйте actions
export const {
  addFeedback,
  updateFeedback,
  deleteFeedback,
  setFeedbacks,
  setLoading,
  setError,
  setCurrentFeedback,
  clearCurrentFeedback,
  resetEditing,
} = feedbackSlice.actions;

// Функция для синхронизации отзывов между разными хранилищами
const syncFeedbacks = (feedbacks) => {
  // Сохраняем в оба хранилища для совместимости
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  localStorage.setItem("lab8_feedbacks", JSON.stringify(feedbacks));
};

// Функция для загрузки отзывов с приоритетом на lab8_feedbacks
const loadFeedbacks = () => {
  // Сначала пробуем загрузить из lab8_feedbacks (для совместимости с Lab8)
  const lab8Saved = localStorage.getItem("lab8_feedbacks");
  if (lab8Saved) {
    return JSON.parse(lab8Saved);
  }

  // Если нет lab8_feedbacks, пробуем загрузить из feedbacks
  const saved = localStorage.getItem("feedbacks");
  if (saved) {
    const feedbacks = JSON.parse(saved);
    // Синхронизируем в lab8_feedbacks
    localStorage.setItem("lab8_feedbacks", JSON.stringify(feedbacks));
    return feedbacks;
  }

  return [];
};

// Простые async actions без createAsyncThunk
export const getFeedbacks = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Загружаем из localStorage с синхронизацией
    const feedbacks = loadFeedbacks();

    dispatch(setFeedbacks(feedbacks));
  } catch (error) {
    dispatch(setError("Ошибка загрузки отзывов: " + error.message));
    console.error("Ошибка загрузки отзывов:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const createFeedback = (feedbackData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const newFeedback = {
      ...feedbackData,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("ru-RU"),
      timestamp: Date.now(),
      // Добавляем поля для совместимости с Lab8
      userName: feedbackData.author,
      userEmail: feedbackData.email,
      createdAt: new Date().toISOString(),
    };

    // Просто диспатчим без unwrap()
    dispatch(addFeedback(newFeedback));

    // Загружаем текущие отзывы и добавляем новый
    const currentFeedbacks = loadFeedbacks();
    const updatedFeedbacks = [newFeedback, ...currentFeedbacks];

    // Синхронизируем в оба хранилища
    syncFeedbacks(updatedFeedbacks);

    return newFeedback;
  } catch (error) {
    dispatch(setError("Ошибка создания отзыва"));
    console.error("Ошибка создания отзыва:", error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const editFeedback =
  ({ id, feedback }) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const updatedFeedback = {
        ...feedback,
        id: id.toString(),
        // Сохраняем оригинальные дату и timestamp
        date: feedback.date || new Date().toLocaleDateString("ru-RU"),
        timestamp: feedback.timestamp || Date.now(),
        // Добавляем поля для совместимости с Lab8
        userName: feedback.author,
        userEmail: feedback.email,
        createdAt: feedback.createdAt || new Date().toISOString(),
      };

      // Обновляем в состоянии
      dispatch(updateFeedback(updatedFeedback));

      // Обновляем в localStorage
      const currentFeedbacks = loadFeedbacks();
      const index = currentFeedbacks.findIndex(
        (fb) => fb.id.toString() === id.toString()
      );

      if (index !== -1) {
        currentFeedbacks[index] = updatedFeedback;
        // Синхронизируем в оба хранилища
        syncFeedbacks(currentFeedbacks);
      }

      return updatedFeedback;
    } catch (error) {
      dispatch(setError("Ошибка обновления отзыва: " + error.message));
      console.error("Ошибка обновления отзыва:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const removeFeedback = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    // Удаляем из состояния
    dispatch(deleteFeedback(id));

    // Удаляем из localStorage
    const currentFeedbacks = loadFeedbacks();
    const updatedFeedbacks = currentFeedbacks.filter(
      (fb) => fb.id.toString() !== id.toString()
    );

    // Синхронизируем в оба хранилища
    syncFeedbacks(updatedFeedbacks);

    return id;
  } catch (error) {
    dispatch(setError("Ошибка удаления отзыва"));
    console.error("Ошибка удаления отзыва:", error);
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export default feedbackSlice.reducer;
