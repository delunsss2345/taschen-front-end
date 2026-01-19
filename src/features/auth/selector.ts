import type { RootState } from "@/store";

export const selectAuth = (state: RootState) => state.auth;

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectAuthLoading = (state: RootState) => state.auth.authLoading;

export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.currentUser && localStorage.getItem("accessToken"));
