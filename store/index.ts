
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REHYDRATE,
} from "redux-persist";
import { REGISTER } from "redux-persist/es/constants";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { authSlice } from "@/features/auth/slice";

const AUTH_SLICE_KEY = authSlice.name;

const persistConfig = {
  key: "root",
  storage,
  blacklist: [AUTH_SLICE_KEY],
};

const authPersistConfig = {
  key: AUTH_SLICE_KEY,
  storage: storage,
  blacklist: ["fetching"],
};

export const rootReducer = combineReducers({
  [AUTH_SLICE_KEY]: persistReducer(authPersistConfig, authSlice.reducer),
});

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

const persist = persistStore(store);
export { persist, store };
