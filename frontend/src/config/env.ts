import { Platform } from "react-native";

const isDev = typeof __DEV__ !== "undefined" ? __DEV__ : false;

function normalizeForDevice(url: string) {
  if (!url) return url;
  if (!isDev) return url;
  if (Platform.OS !== "android") return url;
  // Android emulator cannot access host localhost directly.
  return url.replace("http://localhost", "http://10.0.2.2");
}

const defaultCore = isDev ? "http://localhost:3020" : "";
const defaultAi = isDev ? "http://localhost:3010" : "";
const defaultFrontend = isDev ? "http://localhost:3000" : "";

export const API_CONFIG = {
  coreServiceUrl: normalizeForDevice(process.env.EXPO_PUBLIC_CORE_SERVICE_URL || defaultCore),
  aiServiceUrl: normalizeForDevice(process.env.EXPO_PUBLIC_AI_SERVICE_URL || defaultAi),
  frontendUrl: normalizeForDevice(process.env.EXPO_PUBLIC_FRONTEND_URL || defaultFrontend)
};

export function trimSlash(value: string) {
  return value.replace(/\/$/, "");
}

export function isValidServiceUrl(value: string) {
  const v = (value || "").trim();
  if (!/^https?:\/\//i.test(v)) return false;
  if (v.includes("your-") || v.includes("REPLACE_WITH")) return false;
  return true;
}
