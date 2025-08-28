import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/order`,
  }),
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query<
      any,
      { pageSize?: number; currentPage?: number; search?: string }
    >({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) =>
        `getallorders?pageSize=${pageSize}&currentPage=${currentPage}&search=${encodeURIComponent(
          search
        )}`,
      providesTags: [{ type: "Orders", id: "LIST" }],
    }),
    getOrderById: builder.query<any, string>({
      query: (id) => `getorder/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Orders", id }],
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: `createorder`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    stripeWebhook: builder.mutation<any, unknown>({
      query: (payload) => ({
        url: `stripewebhook`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useStripeWebhookMutation,
} = orderApi;
