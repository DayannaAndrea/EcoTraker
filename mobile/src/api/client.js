import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

function resolveApiBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/$/, "") + "/api";

  if (typeof window !== "undefined" && window.location?.hostname) {
    return `http://${window.location.hostname}:8000/api`;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    "127.0.0.1:8081";
  const host = String(hostUri).split(":")[0] || "127.0.0.1";
  return `http://${host}:8000/api`;
}

const client = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 12000
});

client.interceptors.request.use(async config => {
  const raw = await AsyncStorage.getItem("ecotracker_session");
  if (!raw) return config;

  try {
    const session = JSON.parse(raw);
    const access = session?.access || session?.access_token || session?.token;
    if (access) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${access}`;
    }
  } catch {
  }

  return config;
});

let refreshingPromise = null;

client.interceptors.response.use(
  response => response,
  async error => {
    const original = error?.config;
    if (error?.response?.status !== 401 || original?._retry || String(original?.url || "").includes("/login/")) {
      return Promise.reject(error);
    }

    const raw = await AsyncStorage.getItem("ecotracker_session");
    if (!raw) return Promise.reject(error);

    let session;
    try {
      session = JSON.parse(raw);
    } catch {
      return Promise.reject(error);
    }

    const refresh = session?.refresh || session?.refresh_token;
    if (!refresh) return Promise.reject(error);

    try {
      if (!refreshingPromise) {
        refreshingPromise = axios.post(`${client.defaults.baseURL}/token/refresh/`, { refresh });
      }

      const response = await refreshingPromise;
      refreshingPromise = null;

      const access = response.data?.access;
      if (!access) return Promise.reject(error);

      const nextSession = { ...session, access };
      await AsyncStorage.setItem("ecotracker_session", JSON.stringify(nextSession));

      original._retry = true;
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${access}`;
      return client(original);
    } catch (refreshError) {
      refreshingPromise = null;
      await AsyncStorage.removeItem("ecotracker_session");
      return Promise.reject(refreshError);
    }
  }
);

export default client;
