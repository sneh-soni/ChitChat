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

    myGroups: builder.query({
      query: () => ({
        url: "chats/my/groups",
        credentials: "include",
      }),
      providesTags: ["Chats"],
    }),

    availableFriends: builder.query({
      query: (chatId) => {
        let url = `users/my-friends`;
        if (chatId) url += `?chatId=${chatId}`;

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chats"],
    }),

    newGroup: builder.mutation({
      query: ({ name, members }) => ({
        url: "chats/new",
        method: "POST",
        credentials: "include",
        body: { name, members },
      }),
      invalidatesTags: ["Chats"],
    }),

    renameGroup: builder.mutation({
      query: ({ name, chatId }) => ({
        url: `chats/${chatId}`,
        method: "PUT",
        credentials: "include",
        body: { name },
      }),
      invalidatesTags: ["Chats"],
    }),

    removeGroupMember: builder.mutation({
      query: ({ userId, chatId }) => ({
        url: `chats/remove-member`,
        method: "DELETE",
        credentials: "include",
        body: { userId, chatId },
      }),
      invalidatesTags: ["Chats"],
    }),

    addGroupMembers: builder.mutation({
      query: ({ members, chatId }) => ({
        url: `chats/add-members`,
        method: "PUT",
        credentials: "include",
        body: { members, chatId },
      }),
      invalidatesTags: ["Chats"],
    }),

    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `chats/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chats"],
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
  useMyGroupsQuery,
  useAvailableFriendsQuery,
  useRenameGroupMutation,
  useNewGroupMutation,
  useRemoveGroupMemberMutation,
  useAddGroupMembersMutation,
  useDeleteChatMutation,
} = api;
