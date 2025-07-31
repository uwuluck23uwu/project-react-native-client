import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const rawBaseQuery = fetchBaseQuery({ baseUrl: `${BASE_URL}/api/authen` });

  const token = await AsyncStorage.getItem("accessToken");

  if (typeof args === "string") {
    args = { url: args };
  }

  args.headers = {
    ...(args.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return rawBaseQuery(args, api, extraOptions);
};

export const authApi = createApi({
  reducerPath: "authenApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getUser: builder.mutation({
      query: (id) => ({
        url: `/getuser/${id}`,
        method: "GET",
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
      }),
    }),
    refreshToken: builder.mutation({
      query: (tokenDTO) => ({
        url: "/getnewtokenfromrefreshtoken",
        method: "POST",
        body: tokenDTO,
      }),
    }),
  }),
});

export const {
  useGetUserMutation,
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
} = authApi;
