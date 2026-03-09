import { create } from "zustand";
import type { Format } from "@/types/response/format.response";

interface FormatState {
  formats: Format[] | null;
  setFormats: (formats: Format[]) => void;
}

export const useFormatStore = create<FormatState>()((set) => ({
  formats: null,
  setFormats: (formats) => set({ formats }),
}));
