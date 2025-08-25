import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/product`,
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) =>
        `getallproducts?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
      providesTags: [{ type: "Products", id: "LIST" }],
    }),
    getProductById: builder.query({
      query: (id) => `getproduct/${id}`,
    }),
    createProducts: builder.mutation({
      query: (datas) => ({
        url: `createproducts`,
        method: "POST",
        body: datas,
      }),
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `updateproduct`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProducts: builder.mutation({
      query: (ids: string[]) => ({
        url: `deleteproducts`,
        method: "POST",
        body: ids,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductsMutation,
  useUpdateProductMutation,
  useDeleteProductsMutation,
} = productApi;
