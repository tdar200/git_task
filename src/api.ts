import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    postData: builder.mutation<any, any>({
      query: (data) => ({
        url: "/query",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePostDataMutation } = api;
