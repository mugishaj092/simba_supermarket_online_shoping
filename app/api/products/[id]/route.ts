import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ProductsData } from "@/lib/types";

const DATA_PATH = path.join(process.cwd(), "public", "simba_products.json");

async function readData(): Promise<ProductsData> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeData(data: ProductsData): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readData();
    const product = data.products.find((p) => p.id === parseInt(id));
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const related = data.products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 8);
    return NextResponse.json({ product, related });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await readData();
    const idx = data.products.findIndex((p) => p.id === parseInt(id));
    if (idx === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    data.products[idx] = {
      ...data.products[idx],
      ...body,
      id: parseInt(id),
      price: parseFloat(body.price) || data.products[idx].price,
      subcategoryId:
        parseInt(body.subcategoryId) || data.products[idx].subcategoryId,
    };
    await writeData(data);
    return NextResponse.json({ product: data.products[idx] });
  } catch {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readData();
    const idx = data.products.findIndex((p) => p.id === parseInt(id));
    if (idx === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const deleted = data.products.splice(idx, 1)[0];
    await writeData(data);
    return NextResponse.json({ deleted });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
