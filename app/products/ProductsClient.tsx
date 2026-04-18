"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductGridSkeleton } from "@/features/products/components/ProductSkeleton";
import { useAppSelector } from "@/store/hooks";
import { t } from "@/lib/i18n";

const CATEGORIES = [
  "Cosmetics & Personal Care",
  "Alcoholic Drinks",
  "Food Products",
  "Cleaning & Sanitary",
  "Kitchenware & Electronics",
  "Baby Products",
  "Sports & Fitness",
  "Stationery",
  "General",
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
];

type ViewMode = "grid" | "list";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const lang = useAppSelector((s) => s.language.current);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);

  const fetchProducts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (sort !== "default") params.set("sort", sort);
      if (inStockOnly) params.set("inStockOnly", "true");
      params.set("page", String(p));
      params.set("limit", "24");

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      if (p === 1) {
        setProducts(data.products || []);
      } else {
        setProducts((prev) => [...prev, ...(data.products || [])]);
      }
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, inStockOnly]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("default");
    setInStockOnly(false);
  };

  const hasFilters = search || category || sort !== "default" || inStockOnly;

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-0.5">
                {category ? "Category" : "All"}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {category || "All Products"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {loading ? "Loading..." : `${total.toLocaleString()} products`}
              </p>
            </div>
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t(lang, "search")}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {t(lang, "categories")}
                </h3>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      !category ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    All Products
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(category === cat ? "" : cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        category === cat ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="truncate block">{cat.length > 20 ? cat.substring(0, 18) + "…" : cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {t(lang, "sortBy")}
                </h3>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Availability
                </h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${inStockOnly ? "bg-primary" : "bg-muted"}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow m-0.5 transition-transform ${inStockOnly ? "translate-x-5" : ""}`} />
                  </div>
                  <span className="text-sm text-muted-foreground">{t(lang, "inStockOnly")}</span>
                </label>
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 px-3 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 flex items-center justify-center gap-1 transition-colors"
                >
                  <X size={13} /> {t(lang, "clearFilters")}
                </button>
              )}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: mobile filters + view toggle */}
            <div className="flex items-center justify-between gap-2 mb-4">
              {/* Mobile filter bar */}
              <div className="flex gap-2 flex-wrap flex-1 lg:hidden">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-medium text-foreground"
                >
                  <SlidersHorizontal size={14} /> Filters
                  {hasFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
                </button>
                {CATEGORIES.slice(0, 3).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(category === cat ? "" : cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                      category === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {cat.split(" & ")[0].substring(0, 10)}
                  </button>
                ))}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* View mode toggle — always visible */}
              <div className="flex items-center gap-1 p-1 bg-muted rounded-xl shrink-0 ml-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Mobile sidebar drawer */}
            {sidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                <div className="absolute left-0 top-0 bottom-0 w-72 bg-background p-5 overflow-y-auto animate-slide-in-right border-r border-border">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-foreground">Filters</h2>
                    <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-xl hover:bg-muted">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-0.5 mb-5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Categories</p>
                    <button onClick={() => { setCategory(""); setSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm ${!category ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"}`}>
                      All Products
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => { setCategory(cat === category ? "" : cat); setSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm ${category === cat ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="mb-5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Sort By</p>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none"
                    >
                      {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <div onClick={() => setInStockOnly(!inStockOnly)}
                      className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${inStockOnly ? "bg-primary" : "bg-muted"}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow m-0.5 transition-transform ${inStockOnly ? "translate-x-5" : ""}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">In Stock Only</span>
                  </label>
                  {hasFilters && (
                    <button onClick={() => { clearFilters(); setSidebarOpen(false); }}
                      className="w-full py-2 border border-destructive/30 text-destructive rounded-xl text-sm font-medium hover:bg-destructive/10">
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Products */}
            {loading && products.length === 0 ? (
              <ProductGridSkeleton count={viewMode === "list" ? 6 : 9} viewMode={viewMode} />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{t(lang, "noProducts")}</h3>
                <p className="text-muted-foreground mb-6">{t(lang, "tryAdjusting")}</p>
                <button onClick={clearFilters} className="btn-primary">
                  {t(lang, "clearFilters")}
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "list"
                      ? "flex flex-col gap-4"
                      : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  }
                >
                  {products.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i % 24}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {page < totalPages && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => fetchProducts(page + 1)}
                      disabled={loading}
                      className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? "Loading..." : `Load More (${total - products.length} remaining)`}
                    </button>
                  </div>
                )}

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Showing {products.length} of {total} products
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
