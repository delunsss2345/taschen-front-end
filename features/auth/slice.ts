import { authApi } from "@/services/authService";
import type {
  LoginPayload,
  RegisterPayload
} from "@/types/request/auth.request";
import type {
  LoginResponse,
  RegisterResponse,
  UserLoginResponse
} from "@/types/response/auth.response";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type AuthState = {
  currentUser: UserLoginResponse | null;
  accessToken: string | null;
  authLoading: boolean;
};

const initialState: AuthState = {
  currentUser: null,
  accessToken: null,
  authLoading: false,
};

export const login = createAsyncThunk<LoginResponse, LoginPayload>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(payload);
      return res;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          status: error.response?.status,
          message: error.response?.data?.message || error.message || "Đăng nhập thất bại",
        });
      }
      return rejectWithValue({
        message: "Đăng nhập thất bại",
      });
    }
  },
);

export const register = createAsyncThunk<RegisterResponse, RegisterPayload>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authApi.register(payload);
      return res;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          status: error.response?.status,
          message: error.response?.data?.message || error.message || "Đăng ký thất bại",
        });
      }
      return rejectWithValue({
        message: "Đăng ký thất bại",
      });
    }
  },
);

// export const logout = createAsyncThunk<LogoutResponse, LogoutPayload>(
//   "auth/logout",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await authApi.logout(payload);
//       return res;
//     } catch (error) {
//       return rejectWithValue(error);
//     } finally {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//     }
//   },
// );

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    resetAuthLoading(state) {
      state.authLoading = false;
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      console.log(state.authLoading);
      state.authLoading = true;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      console.log(state.authLoading);
      state.authLoading = false;
      const data = action.payload.data;
      state.currentUser = data.user;
      localStorage.setItem("accessToken", data.accessToken);
    });

    builder.addCase(login.rejected, (state) => {
      state.authLoading = false;
      state.currentUser = null;
      state.accessToken = null;
    });

    // register
    builder.addCase(register.pending, (state) => {
      state.authLoading = true;
    });

    builder.addCase(register.fulfilled, (state) => {
      state.authLoading = false;
    });

    builder.addCase(register.rejected, (state) => {
      state.authLoading = false;
    });

    // logout
    // builder.addCase(logout.pending, (state) => {
    //   state.authLoading = true;
    // });

    // builder.addCase(logout.fulfilled, (state) => {
    //   state.authLoading = false;
    // });

    // builder.addCase(logout.rejected, (state) => {
    //   state.authLoading = false;
    // });
  },
});

export const { resetAuthLoading, setCurrentUser } = authSlice.actions;
