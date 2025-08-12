import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/interfaces/user.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState: User = {
  accessToken: null,
  refreshToken: null,
  role: null,
  userId: null,
  username: null,
  imageUrl: null,
  email: null,
  phone: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Partial<User>>) => {
      const {
        accessToken,
        refreshToken,
        role,
        userId,
        username,
        imageUrl,
        email,
        phone,
      } = action.payload;

      state.accessToken = accessToken ?? null;
      state.refreshToken = refreshToken ?? null;
      state.role = role ?? null;
      state.userId = userId ?? null;
      state.username = username ?? null;
      state.imageUrl = imageUrl ?? null;
      state.email = email ?? null;
      state.phone = phone ?? null;

      // AsyncStorage: save values (ไม่ await เพราะ reducers ต้องเป็น synchronous)
      if (accessToken) AsyncStorage.setItem("accessToken", accessToken);
      if (refreshToken) AsyncStorage.setItem("refreshToken", refreshToken);
      if (role) AsyncStorage.setItem("role", role);
      if (userId) AsyncStorage.setItem("userId", userId);
      if (username) AsyncStorage.setItem("username", username);
      if (imageUrl) AsyncStorage.setItem("imageUrl", imageUrl);
      if (email) AsyncStorage.setItem("email", email);
      if (phone) AsyncStorage.setItem("phone", phone);
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.userId = null;
      state.username = null;
      state.imageUrl = null;
      state.email = null;
      state.phone = null;

      // AsyncStorage: remove values
      AsyncStorage.multiRemove([
        "accessToken",
        "refreshToken",
        "role",
        "userId",
        "username",
        "imageUrl",
        "email",
        "phone",
      ]);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
