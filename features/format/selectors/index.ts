import { useFormatStore } from "../store";

export const useFormats = () => useFormatStore((state) => state.formats);
export const useFormatsActions = () =>
  useFormatStore((state) => ({ setFormats: state.setFormats }));
