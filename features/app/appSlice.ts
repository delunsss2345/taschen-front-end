import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AppState = {
  isBootstrapped: boolean;
};

const initialState: AppState = {
  isBootstrapped: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.isBootstrapped = action.payload;
    },
  },
});

export const { setBootstrapped } = appSlice.actions;
export default appSlice.reducer;
