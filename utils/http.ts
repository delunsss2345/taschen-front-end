import { envConfig } from "@/config/envConfig";
import type { PromiseHandlers } from "@/types/lib/axios";
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { isPublicApi } from "./isPublicPath";

const baseURL = envConfig.NEXT_PUBLIC_BASE_API ?? "";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});

const refreshAxiosInstance: AxiosInstance = axios.create({
  baseURL,
});

// Mỗi request đều gắn accessToken
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!isPublicApi(config.url) && accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

// Có đang refreshToken không
let isRefreshing = false;
// Ngăn xếp queue
let failedQueue: PromiseHandlers[] = [];

// Xử lí queue
const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// Gọi refreshToken
const refreshToken = async () => {
  try {
    const result = await refreshAxiosInstance.post(`${baseURL}/auth/refresh`, {
      refresh_token: localStorage.getItem("refreshToken"),
    });

    localStorage.setItem("accessToken", result.data.data.accessToken);
    // localStorage.setItem("refreshToken", result.data.data.refresh_token);

    // Gắn queue  null nếu thành công
    processQueue(null);
  } catch (error) {
    processQueue(error);
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

/// Sử dụng bắt request
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
        return Promise.reject(error); // Lỗi ném reject
      }
    }
    // Đã từng đánh dấu thì ném reject
    return Promise.reject(error);
  },
);

// != T mặc định là any
class AxiosHttp {
  private _send = async <T = unknown>(
    method: "get" | "post" | "put" | "delete" | "patch",
    path: string,
    data: object | undefined,
    config?: AxiosRequestConfig,
  ) => {
    try {
      const response = await axiosInstance.request<T>({
        method,
        url: path,
        data,
        ...config,
      });

      return response.data;
    } catch (error) {
      throw new Error(String(error));
    }
  };

  get = <T = unknown>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("get", path, undefined, config);
  };

  post = <T = unknown>(
    path: string,
    data?: object,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("post", path, data, config);
  };

  put = <T = unknown>(
    path: string,
    data: object,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("put", path, data, config);
  };

  patch = <T = unknown>(
    path: string,
    data: object,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("patch", path, data, config);
  };

  del = <T = unknown>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return this._send<T>("delete", path, undefined, config);
  };
}
export const http = new AxiosHttp();
