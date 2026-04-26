"use client";

import { create } from "zustand";

export type UserStoreState = {};

export const useUserStore = create<UserStoreState>((set) => ({}));
