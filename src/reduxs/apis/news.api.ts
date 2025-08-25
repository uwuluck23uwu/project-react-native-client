import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/news`,
  }),
  tagTypes: ["News"],
  endpoints: (builder) => ({
    getNews: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) =>
        `getallnews?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
      providesTags: [{ type: "News", id: "LIST" }],
    }),
    getNewsById: builder.query({
      query: (id) => `getnews/${id}`,
    }),
    createNews: builder.mutation({
      query: (datas) => ({
        url: `createnews`,
        method: "POST",
        body: datas,
      }),
    }),
    updateNews: builder.mutation({
      query: (data) => ({
        url: `updatenews`,
        method: "POST",
        body: data,
      }),
    }),
    deleteNews: builder.mutation({
      query: (ids: string[]) => ({
        url: `deletenews`,
        method: "POST",
        body: ids,
      }),
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
