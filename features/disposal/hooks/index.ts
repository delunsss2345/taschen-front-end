'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { disposalRequestService } from '@/services/disposal-request.service';

export const disposalQueryKeys = {
  all: ['disposal-requests'] as const,
  detail: (id: number | string) => ['disposal-requests', 'detail', id] as const,
};

export function useDisposalRequestsQuery() {
  return useQuery({
    queryKey: disposalQueryKeys.all,
    queryFn: () => disposalRequestService.getAllDisposalRequests(),
  });
}

export function useDisposalRequestByIdQuery(id: number | null) {
  return useQuery({
    queryKey: disposalQueryKeys.detail(id ?? 0),
    queryFn: () => disposalRequestService.getDisposalRequestById(id!),
    enabled: id !== null,
  });
}

export function useApproveDisposalRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, responseNote }: { id: number; responseNote: string }) =>
      disposalRequestService.approveDisposalRequest(id, responseNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disposalQueryKeys.all });
    },
  });
}

export function useRejectDisposalRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, responseNote }: { id: number; responseNote: string }) =>
      disposalRequestService.rejectDisposalRequest(id, responseNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disposalQueryKeys.all });
    },
  });
}
