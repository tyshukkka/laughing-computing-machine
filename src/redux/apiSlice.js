import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// JSONPlaceholder - бесплатный фейковый API для тестирования
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Posts", "Users"],
  endpoints: (builder) => ({
    // Получаем посты (демо-данные)
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: ["Posts"],
      // Трансформируем ответ для нашего формата
      transformResponse: (response) => {
        return response.slice(0, 10).map((post) => ({
          id: post.id,
          title: post.title,
          body: post.body,
          userId: post.userId,
          // Добавляем локальные поля
          rating: Math.floor(Math.random() * 5) + 1, // Случайный рейтинг 1-5
          createdAt: new Date().toISOString(),
          views: Math.floor(Math.random() * 1000),
        }));
      },
    }),

    // Получаем пользователей (демо-данные)
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
      transformResponse: (response) => {
        return response.slice(0, 5).map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          // Добавляем локальные поля
          role: user.id === 1 ? "admin" : "user",
          status: "active",
          avatar: `https://i.pravatar.cc/150?img=${user.id}`,
        }));
      },
    }),

    // Создаем новый пост (демо-мутация)
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
      invalidatesTags: ["Posts"],
    }),

    // Удаляем пост (демо-мутация)
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetUsersQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLazyGetPostsQuery, // Ленивый запрос
} = apiSlice;
