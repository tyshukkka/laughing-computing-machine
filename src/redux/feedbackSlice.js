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

// Простые async actions без createAsyncThunk
export const getFeedbacks = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    // Загружаем из localStorage
    const saved = localStorage.getItem("feedbacks");
    let feedbacks = [];

    if (saved) {
      feedbacks = JSON.parse(saved);
    }

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
    };

    // Просто диспатчим без unwrap()
    dispatch(addFeedback(newFeedback));

    // Сохраняем в localStorage
    const saved = localStorage.getItem("feedbacks");
    let feedbacks = saved ? JSON.parse(saved) : [];
    feedbacks.unshift(newFeedback);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

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
      };

      // Обновляем в состоянии
      dispatch(updateFeedback(updatedFeedback));

      // Обновляем в localStorage
      const saved = localStorage.getItem("feedbacks");
      if (saved) {
        let feedbacks = JSON.parse(saved);
        const index = feedbacks.findIndex(
          (fb) => fb.id.toString() === id.toString()
        );
        if (index !== -1) {
          feedbacks[index] = updatedFeedback;
          localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        }
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
    const saved = localStorage.getItem("feedbacks");
    if (saved) {
      let feedbacks = JSON.parse(saved);
      feedbacks = feedbacks.filter((fb) => fb.id.toString() !== id.toString());
      localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    }

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
