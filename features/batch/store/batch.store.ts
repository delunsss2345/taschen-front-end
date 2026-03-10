"use client";

import { create } from "zustand";

export type BatchStoreState = {};

export const useBatchStore = create<BatchStoreState>((set) => ({}));
