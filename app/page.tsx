import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles, Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Product } from "@/lib/types";

async function getData() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/products?limit=10`, { cache: "no-store" });
  return res.json();
}

const CATEGORIES = [
  { name: "Cosmetics & Personal Care", icon: "✨", color: "from-pink-500 to-rose-500", bg: "bg-pink-50 dark:bg-pink-950/30" },
  { name: "Alcoholic Drinks", icon: "🍷", color: "from-violet-600 to-purple-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
  { name: "Food Products", icon: "🍯", color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { name: "Cleaning & Sanitary", icon: "🧹", color: "from-sky-500 to-cyan-500", bg: "bg-sky-50 dark:bg-sky-950/30" },
  { name: "Kitchenware & Electronics", icon: "🍳", color: "from-orange-500 to-red-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { name: "Baby Products", icon: "👶", color: "from-purple-500 to-pink-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { name: "Sports & Fitness", icon: "💪", color: "from-emerald-500 to-green-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { name: "Stationery", icon: "✏️", color: "from-blue-500 to-indigo-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { name: "General", icon: "🛒", color: "from-gray-500 to-slate-600", bg: "bg-gray-50 dark:bg-gray-900/50" },
];

const TRUST_ITEMS = [
  { icon: Truck, title: "Fast Delivery", desc: "Same-day in Kigali", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  { icon: ShieldCheck, title: "Quality Assured", desc: "All products verified", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40" },
  { icon: CreditCard, title: "Easy Payment", desc: "MTN MoMo & Airtel", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/40" },
  { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free policy", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40" },
];

export default async function HomePage() {
  const { products, store, total } = await getData();

  return (
    <div className="pt-16">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[500px] flex items-center bg-gradient-to-br from-emerald-950 via-green-900 to-teal-900">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-teal-300/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-green-500/5 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-green-200 text-xs font-semibold mb-6 backdrop-blur-sm">
              <Sparkles size={12} className="text-amber-300" />
              📍 {store?.location || "Kigali, Rwanda"} — Rwanda&apos;s #1 Online Supermarket
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-5 text-white tracking-tight">
              Shop Fresh,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-teal-200">
                Shop Smart
              </span>
            </h1>

            <p className="text-green-100/75 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
              {total?.toLocaleString() || "552"}+ products across 9 categories. Delivered fresh to your door in Kigali.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/products"
                className="flex items-center gap-2 px-7 py-3.5 bg-white text-emerald-900 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-xl shadow-black/20 active:scale-95 text-sm"
              >
                <ShoppingBag size={17} /> Shop Now
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all backdrop-blur-sm text-sm"
              >
                Browse All <ArrowRight size={15} />
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-8 border-t border-white/10">
              {[
                { val: "552+", label: "Products" },
                { val: "9", label: "Categories" },
                { val: "24h", label: "Delivery" },
                { val: "100%", label: "Secure" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white">{s.val}</p>
                  <p className="text-xs text-green-300/70 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Browse</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Shop by Category</h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`group flex flex-col items-center gap-2.5 p-3 rounded-2xl ${cat.bg} hover:scale-105 transition-all duration-200 border border-transparent hover:border-border`}
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
              >
                {cat.icon}
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-foreground/70 text-center leading-tight line-clamp-2">
                {cat.name.split(" & ")[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-muted/40 border-y border-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Handpicked</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Products</h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
            >
              See all <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {(products || []).map((product: Product, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="btn-primary shadow-lg shadow-primary/25 text-base px-8 py-4"
            >
              Browse All {total?.toLocaleString() || "552"} Products <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className={`flex flex-col items-center text-center gap-3 p-6 rounded-2xl ${bg} border border-border transition-all hover:scale-105 duration-200`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-card flex items-center justify-center shadow-sm`}>
                <Icon size={22} className={color} />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 md:p-12 text-white">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-amber-100 text-sm font-semibold mb-2">🎉 Special Offer</p>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">Fresh Deals Every Day</h3>
              <p className="text-amber-100/80 text-base">Discover new discounts on your favourite products.</p>
            </div>
            <Link
              href="/products"
              className="shrink-0 flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-2xl hover:bg-orange-50 transition-all shadow-xl active:scale-95 text-sm"
            >
              Shop Deals <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 dark:bg-black text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base">S</span>
                </div>
                <div>
                  <p className="text-white font-bold leading-tight">Simba Supermarket</p>
                  <p className="text-emerald-400 text-xs">Rwanda&apos;s Online Supermarket</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-500">
                Your trusted online supermarket in Kigali, Rwanda. Quality products, fast delivery.
              </p>
            </div>

            <div>
              <p className="text-white font-semibold mb-4">Quick Links</p>
              <div className="space-y-2.5 text-sm">
                {[["Home", "/"], ["Products", "/products"], ["Cart", "/cart"], ["Admin", "/admin"]].map(([l, h]) => (
                  <Link key={h} href={h} className="block hover:text-emerald-400 transition-colors">
                    {l}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white font-semibold mb-4">Contact Us</p>
              <div className="space-y-2.5 text-sm">
                <p className="flex items-center gap-2"><span>📍</span> Kigali, Rwanda</p>
                <p className="flex items-center gap-2"><span>📞</span> +250 788 123 456</p>
                <p className="flex items-center gap-2"><span>✉️</span> info@simbasupermarket.rw</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
            <p>© 2025 Simba Supermarket. All rights reserved.</p>
            <p>Made with ❤️ in Rwanda 🇷🇼</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
