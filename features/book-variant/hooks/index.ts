import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookVariantService } from "@/services/bookVariant.service";
import type { UpdateVariantRequest } from "@/types/request/book.request";

export const bookVariantKeys = {
  all: ["book-variants"] as const,
  lists: () => [...bookVariantKeys.all, "list"] as const,
  byBook: (bookId: number | string) =>
    [...bookVariantKeys.lists(), "book", bookId] as const,
  details: () => [...bookVariantKeys.all, "detail"] as const,
  detail: (variantId: number | string) =>
    [...bookVariantKeys.details(), variantId] as const,
};

export const useBookVariantsQuery = (
  bookId: number | string | null | undefined,
) => {
  return useQuery({
    queryKey: bookVariantKeys.byBook(bookId ?? "unknown"),
    queryFn: () =>
      bookVariantService.getVariantsByBookId(bookId as number | string),
    enabled: Boolean(bookId),
  });
};

export const useBookVariantByIdQuery = (
  variantId: number | string | null | undefined,
) => {
  return useQuery({
    queryKey: bookVariantKeys.detail(variantId ?? "unknown"),
    queryFn: () =>
      bookVariantService.getVariantById(variantId as number | string),
    enabled: Boolean(variantId),
  });
};

export const useUpdateBookVariantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      payload,
    }: {
      variantId: number | string;
      payload: UpdateVariantRequest;
    }) => bookVariantService.updateVariant(variantId, payload),
    onSuccess: (updatedVariant, variables) => {
      queryClient.invalidateQueries({
        queryKey: bookVariantKeys.detail(variables.variantId),
      });
      queryClient.invalidateQueries({
        queryKey: bookVariantKeys.byBook(updatedVariant.bookId),
      });
    },
  });
};
