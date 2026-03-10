import { useQuery, queryOptions } from "@tanstack/react-query";
import { supplierService } from "@/services/supplier.service";

export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
};

export const supplierOptions = {
  all: () =>
    queryOptions({
      queryKey: supplierKeys.lists(),
      queryFn: () => supplierService.getSuppliersSafe(),
    }),
};

export const useSuppliers = () => {
  return useQuery(supplierOptions.all());
};
