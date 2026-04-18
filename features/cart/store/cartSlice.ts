import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const saveToStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("simba-cart", JSON.stringify(items));
  }
};

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      saveToStorage(state.items);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      saveToStorage(state.items);
    },
    incrementQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (item) => item.product.id === action.payload
      );
      if (item) {
        item.quantity += 1;
        saveToStorage(state.items);
      }
    },
    decrementQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find(
        (item) => item.product.id === action.payload
      );
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter(
            (i) => i.product.id !== action.payload
          );
        } else {
          item.quantity -= 1;
        }
        saveToStorage(state.items);
      }
    },
    clearCart(state) {
      state.items = [];
      saveToStorage([]);
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
