"use client";

import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCartOpen,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from "@/features/cart/store/cartSlice";
import { formatPrice } from "@/lib/utils";
import { t } from "@/lib/i18n";

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((s) => s.cart);
  const lang = useAppSelector((s) => s.language.current);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => dispatch(setCartOpen(false))}
      />

      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 shadow-2xl flex flex-col animate-slide-in-right border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag size={18} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t(lang, "yourCart")}
            </h2>
            {totalItems > 0 && (
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems} items
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                onClick={() => dispatch(clearCart())}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => dispatch(setCartOpen(false))}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center">
                <ShoppingBag size={40} className="text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-bold text-foreground text-lg mb-1">{t(lang, "emptyCart")}</p>
                <p className="text-sm text-muted-foreground">{t(lang, "emptyCartDesc")}</p>
              </div>
              <Link
                href="/products"
                onClick={() => dispatch(setCartOpen(false))}
                className="btn-primary"
              >
                {t(lang, "continueShopping")} <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <ul className="px-4 space-y-3">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-muted/50 rounded-2xl border border-border"
                >
                  <div className="w-16 h-16 rounded-xl bg-background overflow-hidden flex-shrink-0 border border-border">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatPrice(item.product.price)} / {item.product.unit}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => dispatch(decrementQuantity(item.product.id))}
                          className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(incrementQuantity(item.product.id))}
                          className="w-7 h-7 rounded-lg bg-primary hover:brightness-110 text-primary-foreground flex items-center justify-center transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => dispatch(removeFromCart(item.product.id))}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3 bg-background">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t(lang, "subtotal")} ({totalItems} items)</span>
              <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span className="text-foreground">{t(lang, "total")}</span>
              <span className="text-primary">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => dispatch(setCartOpen(false))}
              className="btn-primary w-full py-4 text-base shadow-lg shadow-primary/25"
            >
              {t(lang, "checkout")} <ArrowRight size={18} />
            </Link>
            <button
              onClick={() => dispatch(setCartOpen(false))}
              className="w-full py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              {t(lang, "continueShopping")}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
