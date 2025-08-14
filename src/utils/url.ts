import { Platform } from "react-native";

const PORT = 7294;
export const BASE_URL =
  Platform.OS === "android"
    ? `https://10.0.2.2:${PORT}` // Android Emulator
    : `https://localhost:${PORT}`; // iOS Simulator
