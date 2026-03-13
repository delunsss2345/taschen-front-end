"use client";

import { userService, type UpdateUserRequest, type CreateUserRequest } from "@/services/user.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const USER_QUERY_KEY = ["users"] as const;

export const useUsersQuery = () => {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => userService.getAllUsersStrict(),
  });
};

export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => userService.createUserStrict(payload),
  });
};

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: ({ userId, payload }: { userId: number | string; payload: UpdateUserRequest }) =>
      userService.updateUserStrict(userId, payload),
  });
};
