import type { AuthStoreState } from "../store/auth.store";

export const selectorAuth = (state: AuthStoreState) => state;

export const selectorCurrentUser = (state: AuthStoreState) => state.currentUser;

export const selectorAccessToken = (state: AuthStoreState) => state.accessToken;

export const selectorAuthLoading = (state: AuthStoreState) => state.authLoading;

export const selectorIsAuthenticated = (state: AuthStoreState) =>
  Boolean(state.currentUser && state.accessToken);
