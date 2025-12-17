import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import counterReducer from "./counterSlice.js";
import feedbackReducer from "./feedbackSlice.js";
import userReducer from "./userSlice.js";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    counter: counterReducer,
    feedbacks: feedbackReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
