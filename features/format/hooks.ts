import { useQuery } from "@tanstack/react-query";
import { formatService } from "@/services/format.service";
import { useFormatStore } from "./store";
import { useEffect } from "react";

export const FORMAT_QUERY_KEYS = {
  all: ["formats"] as const,
};

export function useQueryFormat() {
  const setFormats = useFormatStore((state) => state.setFormats);

  const query = useQuery({
    queryKey: FORMAT_QUERY_KEYS.all,
    queryFn: async () => {
      const data = await formatService.getAllFormats();
      return data;
    },
  });

  useEffect(() => {
    if (query.data) {
      setFormats(query.data);
    }
  }, [query.data, setFormats]);

  return query;
}
