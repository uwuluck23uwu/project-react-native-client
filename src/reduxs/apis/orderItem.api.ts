import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";

export const orderItemApi = createApi({
  reducerPath: "orderItemApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/orderitem`,
  }),
  tagTypes: ["UserTickets", "TicketStats"],
  endpoints: (builder) => ({
    getUserTickets: builder.query({
      query: ({ userId, pageSize = 10, currentPage = 1 }) =>
        `getusertickets/${userId}?pageSize=${pageSize}&currentPage=${currentPage}`,
      providesTags: [{ type: "UserTickets", id: "LIST" }],
    }),
    generateQrCodes: builder.mutation({
      query: (orderId: string) => ({
        url: `generateqrcodes`,
        method: "POST",
        body: { orderId },
      }),
      invalidatesTags: [{ type: "UserTickets", id: "LIST" }],
    }),
    scanTicket: builder.mutation({
      query: ({ qrCode, staffId }) => ({
        url: `scanticket`,
        method: "POST",
        body: { qrCode, staffId },
      }),
      invalidatesTags: [{ type: "UserTickets", id: "LIST" }],
    }),
    getTicketStats: builder.query({
      query: (userId?: string) =>
        `getticketstats${userId ? `?userId=${userId}` : ""}`,
      providesTags: [{ type: "TicketStats", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUserTicketsQuery,
  useGenerateQrCodesMutation,
  useScanTicketMutation,
  useGetTicketStatsQuery,
} = orderItemApi;
