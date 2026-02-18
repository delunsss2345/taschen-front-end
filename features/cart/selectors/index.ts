import type { CartStoreState } from "../store/cart.store";

export const selectorCart = (state: CartStoreState) => state;

export const selectorCartItemCount = (state: CartStoreState) =>
  state.cartItemCount;

export const selectorActiveCartId = (state: CartStoreState) => state.activeCartId;
