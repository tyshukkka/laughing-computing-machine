// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser as apiLogout,
  fetchUsers,
  updateUserProfile,
} from "../api";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    allUsers: [],
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Async actions с правильным возвратом промисов
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.setLoading(true));
    dispatch(userSlice.actions.setError(null));

    const user = await loginUser(email, password);

    if (user) {
      // Сохраняем в localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      dispatch(userSlice.actions.setUser(user));
      return user; // Возвращаем пользователя для unwrap()
    } else {
      const error = new Error("Неверный email или пароль");
      dispatch(userSlice.actions.setError(error.message));
      throw error;
    }
  } catch (error) {
    dispatch(userSlice.actions.setError(error.message));
    throw error;
  } finally {
    dispatch(userSlice.actions.setLoading(false));
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.setLoading(true));
    dispatch(userSlice.actions.setError(null));

    const user = await registerUser(userData);

    const userInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
    };

    // Сохраняем в localStorage для автоматического входа
    localStorage.setItem("currentUser", JSON.stringify(userInfo));

    dispatch(userSlice.actions.setUser(userInfo));
    return userInfo; // Возвращаем пользователя для unwrap()
  } catch (error) {
    dispatch(userSlice.actions.setError(error.message));
    throw error;
  } finally {
    dispatch(userSlice.actions.setLoading(false));
  }
};

export const fetchAllUsers = () => async (dispatch) => {
  try {
    dispatch(userSlice.actions.setLoading(true));
    const users = await fetchUsers();
    dispatch(userSlice.actions.setAllUsers(users));
    return users;
  } catch (error) {
    dispatch(userSlice.actions.setError(error.message));
    throw error;
  } finally {
    dispatch(userSlice.actions.setLoading(false));
  }
};

export const updateProfile = (userId, userData) => async (dispatch) => {
  try {
    dispatch(userSlice.actions.setLoading(true));
    dispatch(userSlice.actions.setError(null));

    const updatedUser = await updateUserProfile(userId, userData);

    // Обновляем в localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    dispatch(userSlice.actions.setUser(updatedUser));
    return updatedUser;
  } catch (error) {
    dispatch(userSlice.actions.setError(error.message));
    throw error;
  } finally {
    dispatch(userSlice.actions.setLoading(false));
  }
};

export const logout = () => (dispatch) => {
  apiLogout();
  dispatch(userSlice.actions.clearUser());
};

export const checkStoredUser = () => (dispatch) => {
  const user = getCurrentUser();
  if (user) {
    dispatch(userSlice.actions.setUser(user));
  }
  return user;
};

export const { setUser, setAllUsers, clearUser, setError } = userSlice.actions;
export default userSlice.reducer;
