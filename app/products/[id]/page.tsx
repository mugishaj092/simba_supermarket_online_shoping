"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart, ArrowLeft, Package, CheckCircle, XCircle, Minus, Plus, Share2
} from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/features/cart/store/cartSlice";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductGridSkeleton } from "@/features/products/components/ProductSkeleton";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const lang = useAppSelector((s) => s.language.current);
  const cartItems = useAppSelector((s) => s.cart.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  const cartItem = cartItems.find((i) => i.product.id === product?.id);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setRelated(data.related || []);
        } else {
          router.push("/products");
        }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`${qty}x ${product.name} added to cart`, { icon: "🛒" });
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl shimmer" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded shimmer" />
            <div className="h-8 w-3/4 bg-gray-100 dark:bg-gray-800 rounded shimmer" />
            <div className="h-6 w-32 bg-gray-100 dark:bg-gray-800 rounded shimmer" />
            <div className="h-12 w-48 bg-gray-100 dark:bg-gray-800 rounded-xl shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const imageSrc = imgError
    ? `https://placehold.co/400x400/f0fdf4/166534?text=${encodeURIComponent(product.name.substring(0, 20))}`
    : product.image;

  return (
    <div className="pt-16 min-h-screen bg-white dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-green-600 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <span>/</span>
        <Link href="/products" className="hover:text-green-600 transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-green-600 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white truncate max-w-xs">{product.name}</span>
      </div>

      {/* Product detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-hidden p-8">
              <img
                src={imageSrc}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                onError={() => setImgError(true)}
              />
            </div>
            {/* Stock badge */}
            <div className="absolute top-4 left-4">
              {product.inStock ? (
                <span className="flex items-center gap-1.5 text-xs font-bold bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full">
                  <CheckCircle size={12} /> In Stock
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full">
                  <XCircle size={12} /> Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {/* Category & ID */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full hover:bg-green-100 transition-colors"
              >
                {product.category}
              </Link>
              <span className="text-xs text-gray-400">ID: {product.id}</span>
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-3">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </p>
              <p className="text-base text-gray-500 mb-1">per {product.unit}</p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Unit</p>
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                  <Package size={14} className="text-green-600" /> {product.unit}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 mb-1">Availability</p>
                <p className={`font-semibold flex items-center gap-1 ${product.inStock ? "text-green-600" : "text-red-500"}`}>
                  {product.inStock ? <><CheckCircle size={14} /> In Stock</> : <><XCircle size={14} /> Out of Stock</>}
                </p>
              </div>
            </div>

            {/* Cart in info */}
            {cartItem && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2.5 rounded-xl border border-green-100 dark:border-green-800">
                <ShoppingCart size={15} />
                <span className="font-semibold">{cartItem.quantity} already in your cart</span>
              </div>
            )}

            {/* Qty + Add to cart */}
            {product.inStock && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900 dark:text-white text-lg">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors text-green-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-green-500/25"
                >
                  <ShoppingCart size={18} /> Add {qty > 1 ? `${qty}x` : ""} to Cart
                </button>
              </div>
            )}

            {/* Total for qty */}
            {qty > 1 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Total: <span className="font-bold text-gray-900 dark:text-white">{formatPrice(product.price * qty)}</span>
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <Share2 size={14} /> Share
              </button>
              <Link
                href="/cart"
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-medium"
              >
                <ShoppingCart size={14} /> View Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              More from {product.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {related.slice(0, 6).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
