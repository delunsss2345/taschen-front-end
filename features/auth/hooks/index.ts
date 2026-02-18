"use client";

import { authService } from "@/services/auth.service";
import type {
  ChangePasswordRequest,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  VerifyAccountRequest,
} from "@/types/request/auth.request";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";

export const useLoginMutation = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onMutate: () => {
      setAuthLoading(true);
    },
    onSuccess: (data) => {
      setSession({
        currentUser: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
    onError: () => {
      clearSession();
    },
    onSettled: () => {
      setAuthLoading(false);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
  });
};

export const useLogoutMutation = () => {
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: (payload: LogoutRequest) => authService.logout(payload),
    onSuccess: () => {
      clearSession();
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) =>
      authService.changePassword(payload),
  });
};

export const useVerifyAccountMutation = (userId: string | number) => {
  return useMutation({
    mutationFn: (payload: VerifyAccountRequest) =>
      authService.verifyAccount(userId, payload),
  });
};

export const useRefreshTokenMutation = () => {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: RefreshTokenRequest) => authService.refreshToken(payload),
    onSuccess: (data) => {
      const currentUser = useAuthStore.getState().currentUser;

      if (!currentUser) {
        return;
      }

      setSession({
        currentUser,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
  });
};
