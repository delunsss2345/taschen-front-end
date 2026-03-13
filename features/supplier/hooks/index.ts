"use client";

import { supplierService, type CreateSupplierRequest, type UpdateSupplierRequest } from "@/services/supplier.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const SUPPLIER_QUERY_KEY = ["suppliers"] as const;

export const useSuppliersQuery = () => {
  return useQuery({
    queryKey: SUPPLIER_QUERY_KEY,
    queryFn: () => supplierService.getAllSuppliersStrict(),
  });
};

export const useCreateSupplierMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateSupplierRequest) => supplierService.createSupplierStrict(payload),
  });
};

export const useUpdateSupplierMutation = () => {
  return useMutation({
    mutationFn: ({ supplierId, payload }: { supplierId: number | string; payload: UpdateSupplierRequest }) =>
      supplierService.updateSupplierStrict(supplierId, payload),
  });
};
