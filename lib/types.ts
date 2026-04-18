export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategoryId: number;
  inStock: boolean;
  image: string;
  unit: string;
  description?: string;
  featured?: boolean;
  tags?: string[];
}

export interface Store {
  name: string;
  tagline: string;
  location: string;
  currency: string;
}

export interface ProductsData {
  store: Store;
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export interface FilterState {
  category: string;
  subcategoryId: number | null;
  search: string;
  sort: SortOption;
  inStockOnly: boolean;
  priceMin: number;
  priceMax: number;
}

export type Language = "en" | "fr" | "rw";

export interface CategoryMeta {
  name: string;
  icon: string;
  color: string;
  gradient: string;
}

export const SUBCATEGORY_NAMES: Record<number, string> = {
  13: "Perfumes",
  15: "Fitness Equipment",
  19: "Electronics",
  22: "Office Supplies",
  27: "Wines",
  29: "Nail Care",
  58: "Baby Nutrition",
  62: "Snacks",
  76: "Spirits",
  101: "Air Fresheners",
  103: "Deodorants",
  105: "Cleaning Products",
  131: "Honey & Spreads",
  148: "Irons",
  165: "Blenders",
  166: "Kettles",
  167: "Toasters",
  168: "Bottles",
  176: "Brushes",
  177: "Mops",
  184: "Skincare",
  187: "Cooking Equipment",
  195: "Storage",
  197: "Grills",
  198: "Coffee Makers",
  199: "Cookware",
  203: "Beers",
  204: "Body Lotions",
  205: "Hair Care",
  206: "Soaps",
  208: "Sunscreen",
  209: "Foot Care",
  211: "Oral Care",
  212: "Shampoos",
  214: "Eye Care",
  215: "Kitchen Tools",
  220: "Juicers",
  233: "Whiskey",
  234: "Vodka",
  235: "Rum",
  236: "Gin",
  237: "Brandy",
  238: "Champagne",
  244: "Sanitizers",
  245: "Makeup",
  246: "Energy Drinks",
  247: "Soft Drinks",
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  "Cosmetics & Personal Care": {
    name: "Cosmetics & Personal Care",
    icon: "✨",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-400",
  },
  "Alcoholic Drinks": {
    name: "Alcoholic Drinks",
    icon: "🍷",
    color: "#7c3aed",
    gradient: "from-violet-600 to-purple-500",
  },
  "Food Products": {
    name: "Food Products",
    icon: "🍯",
    color: "#f59e0b",
    gradient: "from-amber-500 to-yellow-400",
  },
  "Cleaning & Sanitary": {
    name: "Cleaning & Sanitary",
    icon: "🧹",
    color: "#0ea5e9",
    gradient: "from-sky-500 to-cyan-400",
  },
  "Kitchenware & Electronics": {
    name: "Kitchenware & Electronics",
    icon: "🍳",
    color: "#f97316",
    gradient: "from-orange-500 to-amber-400",
  },
  "Baby Products": {
    name: "Baby Products",
    icon: "👶",
    color: "#8b5cf6",
    gradient: "from-purple-500 to-violet-400",
  },
  "Sports & Fitness": {
    name: "Sports & Fitness",
    icon: "💪",
    color: "#10b981",
    gradient: "from-emerald-500 to-green-400",
  },
  Stationery: {
    name: "Stationery",
    icon: "✏️",
    color: "#3b82f6",
    gradient: "from-blue-500 to-indigo-400",
  },
  General: {
    name: "General",
    icon: "🛒",
    color: "#6b7280",
    gradient: "from-gray-500 to-slate-400",
  },
};
