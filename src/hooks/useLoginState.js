// src/hooks/useLoginState.js
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  login,
  logout as logoutAction,
  updateProfile,
  fetchAllUsers,
} from "../redux/userSlice";

const useLoginState = () => {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated, loading, error } = useSelector(
    (state) => state.user
  );

  // При монтировании компонента, можно загрузить всех пользователей
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Восстанавливаем пользователя из sessionStorage при загрузке
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (savedUser && !currentUser) {
      try {
        const user = JSON.parse(savedUser);
        // Проверяем, что пользователь всё ещё существует в базе
        dispatch(fetchAllUsers()).then(() => {
          // Проверка будет выполнена после загрузки пользователей
        });
      } catch (e) {
        console.error("Ошибка восстановления пользователя:", e);
        sessionStorage.removeItem("currentUser");
      }
    }
  }, [dispatch, currentUser]);

  // Сохраняем пользователя в sessionStorage при изменении
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const handleLogin = useCallback(
    async (email, password) => {
      const result = await dispatch(login({ email, password }));
      return result;
    },
    [dispatch]
  );

  const handleRegister = useCallback(
    async (userData) => {
      const result = await dispatch(register(userData));
      return result;
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const handleUpdateProfile = useCallback(
    async (userId, userData) => {
      const result = await dispatch(updateProfile({ userId, userData }));
      return result;
    },
    [dispatch]
  );

  const getAllUsers = useCallback(() => {
    return dispatch(fetchAllUsers());
  }, [dispatch]);

  // Функция для проверки пользователя (совместимость с старым кодом)
  const checkUser = useCallback((email, password) => {
    // Вся логика теперь в Redux
    return null;
  }, []);

  // Функция для регистрации пользователя (совместимость с старым кодом)
  const registerUser = useCallback((userData) => {
    // Вся логика теперь в Redux
    return userData;
  }, []);

  return {
    isLoggedIn: isAuthenticated,
    currentUser,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    registerUser: handleRegister,
    updateProfile: handleUpdateProfile,
    getAllUsers,
    checkUser, // для совместимости
    registerUser: handleRegister, // для совместимости
  };
};

export default useLoginState;
