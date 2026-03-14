"use client";

import { importStockService, type ImportStock } from "@/services/import-stock.service";
import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const importReceiptsQueryKey = ["import-receipts"] as const;

export const useImportReceiptsQuery = (
  options?: Omit<UseQueryOptions<ImportStock[], Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: importReceiptsQueryKey,
    queryFn: () => importStockService.getAll(),
    ...options,
  });
};

export const useReceiveImportStockMutation = () => {
  return useMutation({
    mutationFn: ({ importStockId, userId }: { importStockId: number; userId: number }) =>
      importStockService.receive(importStockId, userId),
  });
};
