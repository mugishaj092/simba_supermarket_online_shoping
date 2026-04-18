import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/features/cart/store/cartSlice";
import languageReducer from "./languageSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
