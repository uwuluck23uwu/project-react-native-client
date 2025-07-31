import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/event`,
  }),
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) =>
        `getallevents?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
    }),
    getEventById: builder.query({
      query: (id) => `getevent/${id}`,
    }),
    createEvents: builder.mutation({
      query: (datas) => ({
        url: `createevents`,
        method: "POST",
        body: datas,
      }),
    }),
    updateEvent: builder.mutation({
      query: (data) => ({
        url: `updateevent`,
        method: "POST",
        body: data,
      }),
    }),
    deleteEvents: builder.mutation({
      query: (ids: string[]) => ({
        url: `deleteevents`,
        method: "POST",
        body: ids,
      }),
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventsMutation,
  useUpdateEventMutation,
  useDeleteEventsMutation,
} = eventApi;
