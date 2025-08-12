import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/location`,
  }),
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: ({ pageSize = 10, currentPage = 1, search = "" }) =>
        `getalllocations?pageSize=${pageSize}&currentPage=${currentPage}&search=${search}`,
    }),
  }),
});

export const { useGetLocationsQuery } = locationApi;
