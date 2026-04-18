"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeFromCart, incrementQuantity, decrementQuantity, clearCart
} from "@/features/cart/store/cartSlice";
import { formatPrice } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { toast } from "sonner";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);
  const lang = useAppSelector((s) => s.language.current);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const deliveryFee = subtotal > 50000 ? 0 : 2000;

  const handleRemove = (name: string, id: number) => {
    dispatch(removeFromCart(id));
    toast.error(`${name} removed from cart`, { icon: "🗑️" });
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t(lang, "yourCart")}
          </h1>
          {totalItems > 0 && (
            <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {totalItems}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-6 shadow-sm">
              <ShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t(lang, "emptyCart")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              {t(lang, "emptyCartDesc")}
            </p>
            <Link href="/products" className="flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg">
              <ShoppingBag size={18} /> {t(lang, "continueShopping")}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-3">
              {/* Clear all */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => { dispatch(clearCart()); toast.success("Cart cleared"); }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex gap-4 transition-all hover:shadow-md"
                >
                  {/* Image */}
                  <Link href={`/products/${item.product.id}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-0.5">
                          {item.product.category}
                        </p>
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base leading-snug hover:text-green-700 dark:hover:text-green-400 transition-colors line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">Unit: {item.product.unit}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.product.name, item.product.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Qty */}
                      <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-xl p-0.5">
                        <button
                          onClick={() => dispatch(decrementQuantity(item.product.id))}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(incrementQuantity(item.product.id))}
                          className="w-7 h-7 flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors text-green-600"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400">{formatPrice(item.product.price)} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 sticky top-20">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Delivery fee</span>
                    <span className={`font-semibold ${deliveryFee === 0 ? "text-green-600" : "text-gray-900 dark:text-white"}`}>
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-gray-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg">
                      Add {formatPrice(50000 - subtotal)} more for free delivery!
                    </p>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-lg">
                    <span className="text-gray-900 dark:text-white">{t(lang, "total")}</span>
                    <span className="text-green-600">{formatPrice(subtotal + deliveryFee)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
                >
                  {t(lang, "checkout")} <ArrowRight size={18} />
                </Link>
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-1 w-full py-2.5 mt-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft size={14} /> {t(lang, "continueShopping")}
                </Link>

                {/* Payment methods */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 text-center mb-2">Accepted payments</p>
                  <div className="flex justify-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg">MTN MoMo</span>
                    <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">Airtel</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">Cash</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
