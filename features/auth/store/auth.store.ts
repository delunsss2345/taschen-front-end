"use client";

import { create } from "zustand";
import type { UserLoginResponse } from "@/types/response/auth.response";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const CURRENT_USER_KEY = "currentUser";

type SetSessionPayload = {
  currentUser: UserLoginResponse;
  accessToken: string;
  refreshToken?: string | null;
};

export type AuthStoreState = {
  currentUser: UserLoginResponse | null;
  accessToken: string | null;
  authLoading: boolean;
  setSession: (payload: SetSessionPayload) => void;
  clearSession: () => void;
  setAuthLoading: (value: boolean) => void;
};

const getStoredAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const getStoredCurrentUser = (): UserLoginResponse | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);

  if (!currentUserRaw) {
    return null;
  }

  try {
    return JSON.parse(currentUserRaw) as UserLoginResponse;
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  currentUser: getStoredCurrentUser(),
  accessToken: getStoredAccessToken(),
  authLoading: false,

  setSession: ({ currentUser, accessToken, refreshToken }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }

    set({
      currentUser,
      accessToken,
      authLoading: false,
    });
  },

  clearSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
    }

    set({
      currentUser: null,
      accessToken: null,
      authLoading: false,
    });
  },

  setAuthLoading: (value) => {
    set({ authLoading: value });
  },
}));
