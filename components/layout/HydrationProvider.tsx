"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateCart } from "@/features/cart/store/cartSlice";
import { hydrateLanguage } from "@/store/languageSlice";
import { Language } from "@/lib/types";

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate cart
    try {
      const cartData = localStorage.getItem("simba-cart");
      if (cartData) {
        dispatch(hydrateCart(JSON.parse(cartData)));
      }
    } catch {}

    // Hydrate language
    try {
      const lang = localStorage.getItem("simba-lang") as Language | null;
      if (lang && ["en", "fr", "rw"].includes(lang)) {
        dispatch(hydrateLanguage(lang));
      }
    } catch {}
  }, [dispatch]);

  return <>{children}</>;
}
