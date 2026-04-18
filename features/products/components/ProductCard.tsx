"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Star, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Product } from "@/lib/types";
import { getDiscountPercentage } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/features/cart/store/cartSlice";
import { toast } from "sonner";
import { t } from "@/lib/i18n";

interface Props {
  product: Product;
  index?: number;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, index = 0, viewMode = "grid" }: Props) {
  const dispatch = useAppDispatch();
  const lang = useAppSelector((s) => s.language.current);
  const cartItems = useAppSelector((s) => s.cart.items);
  const [imgError, setImgError] = useState(false);
  const [wished, setWished] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inCart = cartItems.some((i) => i.product.id === product.id);
  const isOutOfStock = !product.inStock;
  const discountPercent = product.originalPrice
    ? getDiscountPercentage(product.price, product.originalPrice)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAddingToCart) return;

    setIsAddingToCart(true);
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`, { icon: "🛒" });

    setTimeout(() => {
      setIsAddingToCart(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 600);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWished((w) => !w);
    toast(wished ? "Removed from wishlist" : "Added to wishlist", {
      icon: wished ? "💔" : "❤️",
    });
  };

  const imageSrc = imgError
    ? `https://placehold.co/600x400/f5f5f5/888?text=${encodeURIComponent(product.name.substring(0, 20))}`
    : product.image;

  /* ── LIST VIEW ── */
  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.id}`} className="block">
        <article
          className="product-card group cursor-pointer flex flex-row overflow-hidden"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          {/* Image */}
          <div className="relative w-40 sm:w-52 shrink-0 bg-secondary overflow-hidden">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            {discountPercent > 0 && (
              <div className="absolute top-3 left-3">
                <span className="bg-accent/80 border border-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-bold">
                  -{discountPercent}%
                </span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 p-4 gap-1.5 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide truncate">
                  {product.category}
                </p>
                <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors mt-0.5">
                  {product.name}
                </h3>
              </div>
              <button
                onClick={handleWishlist}
                className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  wished
                    ? "bg-red-500 text-white"
                    : "bg-muted text-muted-foreground hover:text-red-500"
                }`}
              >
                <Heart size={14} fill={wished ? "currentColor" : "none"} />
              </button>
            </div>

            {product.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="text-[11px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                  Out of Stock
                </span>
              ) : (
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {t(lang, "inStock")}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 mt-auto pt-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-base font-bold text-foreground">
                  <span className="text-sm font-medium">RWF </span>
                  {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    RWF {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || isOutOfStock}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 shrink-0 ${
                  isOutOfStock
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : justAdded
                    ? "bg-secondary text-secondary-foreground border border-border"
                    : "bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/25"
                }`}
              >
                {justAdded ? (
                  <><Check size={13} /> Added!</>
                ) : isAddingToCart ? (
                  <><Loader2 size={13} className="animate-spin" /> Adding...</>
                ) : (
                  <><ShoppingCart size={13} /> {isOutOfStock ? "Out of Stock" : t(lang, "addToCart")}</>
                )}
              </button>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  /* ── GRID VIEW ── */
  return (
    <Link href={`/products/${product.id}`} className="block">
      <article
        className="product-card group cursor-pointer relative flex flex-col pt-0"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-[calc(var(--radius-xl)-1px)] bg-secondary">
          <img
            src={imageSrc}
            alt={product.name}
            className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out p-1 rounded-2xl"
            loading="lazy"
            onError={() => setImgError(true)}
          />

          {/* Discount badge — top left */}
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-accent/80 border border-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-bold">
                -{discountPercent}%
              </span>
            </div>
          )}

          {/* Out of stock badge — top center */}
          {isOutOfStock && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-destructive text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist — top right */}
          <button
            onClick={handleWishlist}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm
              opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
              ${wished
                ? "bg-red-500 text-white scale-110"
                : "bg-background/90 text-muted-foreground hover:text-red-500 backdrop-blur-sm"
              }`}
          >
            <Heart size={13} fill={wished ? "currentColor" : "none"} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-1">
          {/* Brand / category */}
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide truncate">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200 flex-1">
            {product.name}
          </h3>

          {/* Rating — shown if data exists */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-foreground">{product.rating}</span>
              </div>
              {product.reviewCount && (
                <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 px-3 pb-3 mt-auto">
          {/* Price row */}
          <div className="flex items-baseline flex-wrap gap-2">
            <span className="text-base font-bold text-foreground">
              <span className="text-sm font-medium">RWF </span>
              {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                RWF {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Cart button — full width */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || isOutOfStock}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
              isOutOfStock
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : justAdded
                ? "bg-secondary text-secondary-foreground border border-border"
                : inCart
                ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                : "bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/25"
            }`}
          >
            {justAdded ? (
              <><Check className="w-4 h-4" /> Added!</>
            ) : isAddingToCart ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
            ) : (
              <><ShoppingCart className="w-4 h-4" /> {isOutOfStock ? "Out of Stock" : t(lang, "addToCart")}</>
            )}
          </button>
        </div>
      </article>
    </Link>
  );
}
