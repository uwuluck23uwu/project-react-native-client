import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/ticket`,
  }),
  tagTypes: ["Tickets"],
  endpoints: (builder) => ({
    getTickets: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) =>
        `getalltickets?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
      providesTags: [{ type: "Tickets", id: "LIST" }],
    }),
    getTicketById: builder.query({
      query: (id) => `getticket/${id}`,
    }),
    createTickets: builder.mutation({
      query: (datas) => ({
        url: `createtickets`,
        method: "POST",
        body: datas,
      }),
    }),
    updateTicket: builder.mutation({
      query: (data) => ({
        url: `updateticket`,
        method: "POST",
        body: data,
      }),
    }),
    deleteTickets: builder.mutation({
      query: (ids: string[]) => ({
        url: `deletetickets`,
        method: "POST",
        body: ids,
      }),
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketsMutation,
  useUpdateTicketMutation,
  useDeleteTicketsMutation,
} = ticketApi;
