import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";

export const habitatApi = createApi({
  reducerPath: "habitatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/habitat`,
  }),
  endpoints: (builder) => ({
    getHabitats: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) =>
        `getallhabitats?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
    }),
    getHabitatById: builder.query({
      query: (id) => `gethabitat/${id}`,
    }),
    createHabitats: builder.mutation({
      query: (datas) => ({
        url: `createhabitats`,
        method: "POST",
        body: datas,
      }),
    }),
    updateHabitat: builder.mutation({
      query: (data) => ({
        url: `updatehabitat`,
        method: "POST",
        body: data,
      }),
    }),
    deleteHabitats: builder.mutation({
      query: (ids: string[]) => ({
        url: `deletehabitats`,
        method: "POST",
        body: ids,
      }),
    }),
  }),
});

export const {
  useGetHabitatsQuery,
  useGetHabitatByIdQuery,
  useCreateHabitatsMutation,
  useUpdateHabitatMutation,
  useDeleteHabitatsMutation,
} = habitatApi;
