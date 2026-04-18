import { NextRequest, NextResponse } from "next/server";
import productsData from "@/public/simba_products.json";
import { Product } from "@/lib/types";

const data = productsData as { store: { name: string; tagline: string; location: string; currency: string }; products: Product[] };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const subcategoryId = searchParams.get("subcategoryId");
    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const sort = searchParams.get("sort") || "default";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");

    let products = [...data.products];

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }
    if (subcategoryId) {
      products = products.filter(
        (p) => p.subcategoryId === parseInt(subcategoryId)
      );
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (inStockOnly) {
      products = products.filter((p) => p.inStock);
    }

    switch (sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = products.slice(start, start + limit);

    return NextResponse.json({
      products: paginated,
      store: data.store,
      total,
      totalPages,
      page,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to read products" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Write operations are not supported in this deployment" },
    { status: 405 }
  );
}
