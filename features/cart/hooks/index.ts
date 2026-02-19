"use client";

import { cartService } from "@/services/cart.service";
import type {
  AddToCartRequest,
  UpdateCartItemQuantityRequest,
} from "@/types/request/cart.request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCartStore } from "../store/cart.store";

export const cartQueryKeys = {
  root: ["carts"] as const,
  current: ["carts", "current"] as const,
  byUser: (userId: number | string) => ["carts", "users", userId] as const,
  checkout: ["carts", "checkout"] as const,
  cartItem: (cartItemId: number | string) =>
    ["cart-items", "detail", cartItemId] as const,
};

export const useCurrentCartQuery = () => {
  const syncFromCart = useCartStore((state) => state.syncFromCart);
  const query = useQuery({
    queryKey: cartQueryKeys.current,
    queryFn: () => cartService.getCurrentCart(),
  });

  useEffect(() => {
    if (query.data) {
      syncFromCart(query.data);
    }
  }, [query.data, syncFromCart]);

  return query;
};

export const useCartByUserIdQuery = (userId: number | string | null | undefined) => {
  const syncFromCart = useCartStore((state) => state.syncFromCart);
  const query = useQuery({
    queryKey: cartQueryKeys.byUser(userId ?? "unknown"),
    queryFn: () => cartService.getCartByUserId(userId as number | string),
    enabled: Boolean(userId),
  });

  useEffect(() => {
    if (query.data) {
      syncFromCart(query.data);
    }
  }, [query.data, syncFromCart]);

  return query;
};

export const useCheckoutPreviewQuery = () => {
  return useQuery({
    queryKey: cartQueryKeys.checkout,
    queryFn: () => cartService.checkoutCurrentUser(),
  });
};

export const useCartItemQuery = (
  cartItemId: number | string | null | undefined,
) => {
  return useQuery({
    queryKey: cartQueryKeys.cartItem(cartItemId ?? "unknown"),
    queryFn: () => cartService.getCartItem(cartItemId as number | string),
    enabled: Boolean(cartItemId),
  });
};

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  const syncFromCart = useCartStore((state) => state.syncFromCart);

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number | string;
      payload: AddToCartRequest;
    }) => cartService.addToCart(userId, payload),
    onSuccess: (cart) => {
      syncFromCart(cart);
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.root });
    },
  });
};

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();
  const resetCartState = useCartStore((state) => state.resetCartState);

  return useMutation({
    mutationFn: (userId: number | string) => cartService.clearCart(userId),
    onSuccess: () => {
      resetCartState();
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.root });
    },
  });
};

export const useIncreaseCartItemQuantityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number | string) =>
      cartService.increaseCartItemQuantity(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.root });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },
  });
};

export const useDecreaseCartItemQuantityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number | string) =>
      cartService.decreaseCartItemQuantity(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.root });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },
  });
};

export const useUpdateCartItemQuantityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartItemId,
      payload,
    }: {
      cartItemId: number | string;
      payload: UpdateCartItemQuantityRequest;
    }) => cartService.updateCartItemQuantity(cartItemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.root });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },
  });
};

export const useDeleteCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: number | string) =>
      cartService.deleteCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.root });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },
  });
};
