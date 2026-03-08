import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatService } from "@/services/format.service";
import { useFormatStore } from "./store";
import { useEffect } from "react";
import { toast } from "sonner";

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

export function useDeleteFormatMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const promise = formatService.deleteFormat(id);

      toast.promise(promise, {
        loading: "Đang xóa...",
        success: "Đã xóa định dạng thành công.",
        error: (err: unknown) => {
          let errorMessage = "Đã xảy ra lỗi không xác định";
          if (typeof err === "object" && err !== null && "response" in err) {
            const axiosError = err as {
              response?: { data?: { message?: string; error?: string } };
            };
            const backendMsg =
              axiosError.response?.data?.message ||
              axiosError.response?.data?.error;
            if (backendMsg) errorMessage = backendMsg;
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          return `Lỗi khi xóa định dạng: ${errorMessage}`;
        },
      });

      return await promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORMAT_QUERY_KEYS.all });
    },
  });
}
