import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  formatService,
  type UpdateFormatRequest,
  type CreateFormatRequest,
} from "@/services/format.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export const formatKeys = {
  all: ["formats"] as const,
  lists: () => [...formatKeys.all, "list"] as const,
  details: () => [...formatKeys.all, "detail"] as const,
  detail: (formatId: number | string) =>
    [...formatKeys.details(), formatId] as const,
};

export const useFormatsQuery = () => {
  return useQuery({
    queryKey: formatKeys.lists(),
    queryFn: () => formatService.getAllFormats(),
  });
};

export const useFormatByIdQuery = (
  formatId: number | string | null | undefined,
) => {
  return useQuery({
    queryKey: formatKeys.detail(formatId ?? "unknown"),
    queryFn: () => formatService.getFormatById(formatId as number | string),
    enabled: Boolean(formatId),
  });
};

export const useCreateFormatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Omit<UpdateFormatRequest, "id">) => {
      const promise = formatService.createFormat(
        payload as CreateFormatRequest,
      );

      toast.promise(promise, {
        loading: "Đang thêm...",
        success: "Đã thêm định dạng thành công.",
        error: (err: unknown) => {
          return `Lỗi khi thêm định dạng: ${getErrorMessage(err)}`;
        },
      });

      return await promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formatKeys.all });
    },
  });
};

export const useDeleteFormatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
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
      queryClient.invalidateQueries({ queryKey: formatKeys.all });
    },
  });
};

export const useEditFormatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number | string;
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: formatKeys.all });
      queryClient.invalidateQueries({
        queryKey: formatKeys.detail(variables.id),
      });
    },
  });
};
