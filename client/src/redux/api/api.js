import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER + "/api/v1/",
  }),

  tagTypes: ["Chats", "Users", "Messages"],

  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chats/my",
        credentials: "include",
      }),
      providesTags: ["Chats"],
    }),

    searchUser: builder.query({
      query: (name) => ({
        url: `users/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["Users"],
    }),

    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "users/send-request",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `users/notifications`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "users/accept-request",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chats"],
    }),

    chatDetails: builder.query({
      query: ({ chatId, populate }) => {
        let url = `chats/${chatId}`;
        if (populate) url += `?populate=${populate}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chats"],
    }),

    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chats/messages/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chats/message",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
  }),
});

export default api;

export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationsQuery,
  useChatDetailsQuery,
  useAcceptFriendRequestMutation,
  useGetMessagesQuery,
  useSendAttachmentsMutation,
} = api;
