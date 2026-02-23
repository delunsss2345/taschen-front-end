import { envConfig } from "@/config/envConfig";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { PromiseHandlers } from "@/types/lib/axios";
import type { RefreshTokenResponseData } from "@/types/response/auth.response";
import axios, {
  AxiosHeaders,
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
  const accessToken = useAuthStore.getState().accessToken;

  if (!isPublicApi(config.url) && accessToken) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    } else {
      (config.headers as Record<string, string>).Authorization =
        `Bearer ${accessToken}`;
    }
  }

  return config;
});

// Có đang refreshToken không
let isRefreshing = false;
// Ngăn xếp queue
let failedQueue: PromiseHandlers[] = [];

// Xử lí queue
const processQueue = (error?: unknown) => {
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
const extractBearerToken = (value: string | undefined) => {
  if (!value) return null;
  const [type, token] = value.split(" ");
  if (type?.toLowerCase() === "bearer" && token) {
    return token;
  }
  return value;
};

type RefreshRouteResponse = {
  success?: boolean;
  data?: RefreshTokenResponseData;
} & Partial<RefreshTokenResponseData>;

const refreshToken = async () => {
  const { user, setAccessToken, setSession, clearSession } =
    useAuthStore.getState();

  try {
    const result = await refreshAxiosInstance.post<RefreshRouteResponse>(
      "/auth/refresh-token",
    );

    const authHeader =
      result.headers?.authorization ?? result.headers?.Authorization;
    const tokenFromHeader = extractBearerToken(authHeader);
    const payload = result.data?.data ?? result.data;
    const tokenFromBody = payload?.accessToken;
    const accessToken = tokenFromHeader ?? tokenFromBody ?? null;

    if (!accessToken) {
      throw new Error("Missing access token from refresh response");
    }

    if (payload?.user) {
      setSession({
        user: payload.user,
        accessToken,
      });
    } else if (user) {
      setSession({
        user,
        accessToken,
      });
    } else {
      setAccessToken(accessToken);
    }

    // Gắn queue  null nếu thành công
    processQueue();
  } catch (error) {
    processQueue(error);
    clearSession();
    throw error;
  }
};

// Get token mới
const getNewToken = async () => {
  // Chưa refresh token thì đánh giấu
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      await refreshToken(); // gọi lại
    } finally {
      isRefreshing = false; // thành công đánh dấu
    }
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
    const hasAccessToken = Boolean(useAuthStore.getState().accessToken);

    // Đánh dấu lỗi
    const shouldRenewToken =
      error.response?.status === 401 &&
      !isAuthApi &&
      hasAccessToken &&
      !originalRequest?._retry;

    // Nếu chưa từng đánh dấu thì vào
    if (shouldRenewToken && originalRequest) {
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
      throw error;
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