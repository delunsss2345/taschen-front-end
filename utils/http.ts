import { envConfig } from "@/config/envConfig";
import type { PromiseHandlers } from "@/types/lib/axios";
import axios, {
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { isPublicApi } from "./isPublicPath";

const baseURL = envConfig.NEXT_PUBLIC_BASE_API ?? "";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mỗi request đều gắn accessToken
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  // CHỈ THÊM HEADER NẾU KHÔNG PHẢI PUBLIC API VÀ CÓ TOKEN
  if (!isPublicApi(config.url) && accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

// Handling RefreshToken
let isRefreshing = false;
const failedQueue: PromiseHandlers[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve("");
    }
  });
  failedQueue.length = 0;
};

const refreshAxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gọi refreshToken qua Next.js API route (để dùng cookie)
const refreshToken = async () => {
  try {
    // Gọi Next.js API route, không gọi trực tiếp backend
    const result = await axiosInstance.post("/api/auth/refresh");

    localStorage.setItem("accessToken", result.data.data.accessToken);

    if (result.data.data.refreshToken) {
      localStorage.setItem("refreshToken", result.data.data.refreshToken);
    }

    // Gắn queue  null nếu thành công
    processQueue(null);
  } catch (error: unknown) {
    processQueue(error instanceof Error ? error : new Error(String(error)));
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");
    throw error;
  }
};

// Get token mới
const getNewToken = async () => {
  // Chưa refresh token thì đánh giấu
  if (!isRefreshing) {
    isRefreshing = true;
    await refreshToken(); // gọi lại
    isRefreshing = false; // thành công đánh dấu
    return;
  }

  // đã từng gọi thì push mảng lỗi
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  });
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthApi = isPublicApi(originalRequest?.url);

    // Đánh dấu lỗi
    const shouldRenewToken =
      error.response?.status === 401 &&
      !isAuthApi &&
      localStorage.getItem("refreshToken") &&
      !originalRequest?._retry;

    // Nếu chưa từng đánh dấu thì vào
    if (shouldRenewToken) {
      // đánh dấu
      originalRequest._retry = true;

      // Gọi lại
      try {
        await getNewToken();
        return axiosInstance(originalRequest); // Trả request
      } catch (error) {
        processQueue(error as Error);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export const http = axiosInstance;