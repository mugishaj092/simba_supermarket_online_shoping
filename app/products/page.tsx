import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { ProductGridSkeleton } from "@/features/products/components/ProductSkeleton";

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pt-16 min-h-screen bg-white dark:bg-gray-950">
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 h-24" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <ProductGridSkeleton count={24} />
        </div>
      </div>
    }>
      <ProductsClient />
    </Suspense>
  );
}
