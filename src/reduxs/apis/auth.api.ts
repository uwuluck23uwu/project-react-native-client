import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const rawBaseQuery = fetchBaseQuery({ baseUrl: `${BASE_URL}/api/authen` });

  const token = await AsyncStorage.getItem("accessToken");

  if (typeof args === "string") {
    args = { url: args };
  }

  const userAgent = "ReactNative/1.0";
  const ipAddress = "127.0.0.1";

  args.headers = {
    ...(args.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "User-Agent": userAgent,
    "Content-Type": "application/json",
  };

  if (args.body && typeof args.body === "object") {
    if (args.url.includes("otp") || args.url.includes("Otp")) {
      args.body = {
        ...args.body,
        ipAddress: args.body.ipAddress || ipAddress,
        userAgent: args.body.userAgent || userAgent,
      };
    }
  }

  const result = await rawBaseQuery(args, api, extraOptions);

  return result;
};

export const authApi = createApi({
  reducerPath: "authenApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Authens", "Users", "Otp"],
  endpoints: (builder) => ({
    getUser: builder.mutation({
      query: (id) => ({
        url: `/getuser/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Users"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    updateUser: builder.mutation({
      query: (userData) => {
        const formData = new FormData();

        formData.append("UserId", userData.userId);
        formData.append("Name", userData.name);
        formData.append("Email", userData.email);
        formData.append("Phone", userData.phone || "");
        formData.append("Role", userData.role);

        if (!userData.image && userData.imageUrl) {
          formData.append("ImageUrl", userData.imageUrl);
        }

        if (userData.image) {
          const imageFile = {
            uri: userData.image.uri,
            type: userData.image.type || "image/jpeg",
            name: userData.image.fileName || "profile.jpg",
          };

          formData.append("Image", imageFile as any);
        }

        return {
          url: "/updateuser",
          method: "POST",
          body: formData,
          headers: {},
        };
      },
      invalidatesTags: ["Users"],
    }),
    refreshToken: builder.mutation({
      query: (tokenDTO) => ({
        url: "/getnewtokenfromrefreshtoken",
        method: "POST",
        body: tokenDTO,
      }),
    }),

    sendOtp: builder.mutation({
      query: (otpData) => ({
        url: "/sendotp",
        method: "POST",
        body: otpData,
      }),
      invalidatesTags: ["Otp"],
    }),

    verifyOtp: builder.mutation({
      query: (verifyData) => ({
        url: "/verifyotp",
        method: "POST",
        body: verifyData,
      }),
      invalidatesTags: ["Otp", "Users"],
    }),

    resendOtp: builder.mutation({
      query: (resendData) => ({
        url: "/resendotp",
        method: "POST",
        body: resendData,
      }),
      invalidatesTags: ["Otp"],
    }),

    getOtpStatus: builder.query({
      query: (email) => ({
        url: `/otp/status/${encodeURIComponent(email)}`,
        method: "GET",
      }),
      providesTags: ["Otp"],
    }),

    cancelOtp: builder.mutation({
      query: (data) => ({
        url: "/cancelotp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Otp"],
    }),
  }),
});

export const {
  useGetUserMutation,
  useLoginMutation,
  useUpdateUserMutation,
  useRefreshTokenMutation,

  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useGetOtpStatusQuery,
  useLazyGetOtpStatusQuery,
  useCancelOtpMutation,
} = authApi;
