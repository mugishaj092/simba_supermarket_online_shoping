"use client";

import Link from "next/link";
import { ShoppingCart, Plus, Check, Heart } from "lucide-react";
import { useState } from "react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/features/cart/store/cartSlice";
import { toast } from "sonner";
import { t } from "@/lib/i18n";

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((s) => s.language.current);
  const cartItems = useAppSelector((s) => s.cart.items);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [wished, setWished] = useState(false);

  const inCart = cartItems.some((i) => i.product.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    setAdded(true);
    toast.success(`${product.name} added to cart`, { icon: "🛒" });
    setTimeout(() => setAdded(false), 2000);
  };

  const imageSrc = imgError
    ? `https://placehold.co/300x300/f0fdf4/166534?text=${encodeURIComponent(product.name.substring(0, 15))}`
    : product.image;

  return (
    <Link href={`/products/${product.id}`} className="block">
      <article
        className="product-card group cursor-pointer"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        {/* Image area */}
        <div className="relative aspect-square bg-muted/50 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={() => setImgError(true)}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Stock badge */}
          <div className="absolute top-2.5 left-2.5">
            {product.inStock ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                {t(lang, "inStock")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                {t(lang, "outOfStock")}
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWished(!wished); }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 ${
              wished
                ? "bg-red-500 text-white"
                : "bg-white/90 dark:bg-card/90 text-muted-foreground hover:text-red-500 backdrop-blur-sm"
            }`}
          >
            <Heart size={13} fill={wished ? "currentColor" : "none"} />
          </button>

          {/* Quick add FAB */}
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`absolute bottom-2.5 right-2.5 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 ${
              added
                ? "bg-emerald-600 text-white scale-110"
                : "bg-white dark:bg-card text-primary hover:bg-primary hover:text-white backdrop-blur-sm"
            } ${!product.inStock ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            {added ? <Check size={15} /> : <Plus size={15} />}
          </button>
        </div>

        {/* Content */}
        <div className="p-3.5">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 truncate">
            {product.category}
          </p>
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>

          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-base font-bold text-foreground">
                {formatPrice(product.price)}
              </p>
              {product.unit && (
                <p className="text-[10px] text-muted-foreground">per {product.unit}</p>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                !product.inStock
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : inCart
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                  : "bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/30"
              }`}
            >
              <ShoppingCart size={11} />
              {inCart ? "In cart" : t(lang, "addToCart")}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
