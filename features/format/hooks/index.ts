import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  formatService,
  type UpdateFormatRequest,
} from "@/services/format.service";
import { useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { useFormatStore } from "../store";

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
          return `Lỗi khi xóa định dạng: ${getErrorMessage(err)}`;
        },
      });

      return await promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORMAT_QUERY_KEYS.all });
    },
  });
}

export function useEditFormatMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateFormatRequest;
    }) => {
      const promise = formatService.updateFormat(id, payload);

      toast.promise(promise, {
        loading: "Đang lưu...",
        success: "Thông tin định dạng đã được cập nhật.",
        error: (err: unknown) => {
          return `Không thể cập nhật định dạng: ${getErrorMessage(err)}`;
        },
      });

      return await promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORMAT_QUERY_KEYS.all });
    },
  });
}
