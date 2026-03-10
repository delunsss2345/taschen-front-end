"use client";

import { create } from "zustand";

export type OrderStoreState = {};

export const useOrderStore = create<OrderStoreState>((set) => ({}));
