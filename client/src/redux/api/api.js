import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER + "/api/v1/",
  }),

  tagTypes: ["Chats"],

  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chats/my",
        credentials: "include",
      }),
      providesTags: ["Chats"],
    }),
  }),
});

export default api;
export const { useMyChatsQuery } = api;
