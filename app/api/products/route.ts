import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ProductsData, Product } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "public", "simba_products.json");

async function readData(): Promise<ProductsData> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeData(data: ProductsData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(req: NextRequest) {
  try {
    const data = await readData();
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
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await readData();

    const maxId = Math.max(...data.products.map((p) => Number(p.id)));
    const newProduct: Product = {
      id: maxId + 1,
      name: body.name,
      price: parseFloat(body.price),
      category: body.category,
      subcategoryId: parseInt(body.subcategoryId) || 0,
      inStock: body.inStock !== false,
      image:
        body.image ||
        `https://placehold.co/300x300/f0f0f0/555?text=${encodeURIComponent(body.name.substring(0, 20))}`,
      unit: body.unit || "Pcs",
      description: body.description || "",
    };

    data.products.push(newProduct);
    await writeData(data);

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
