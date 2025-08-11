import { io } from "socket.io-client";
import { Platform } from "react-native";

const URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://192.168.1.114:3001";

export const socket = io(URL);
