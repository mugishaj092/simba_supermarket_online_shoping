"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Edit2, Trash2, Package, AlertCircle,
  CheckCircle, X, Save, Loader2, BarChart3, ShoppingBag,
  TrendingUp, RefreshCw, ChevronLeft, ChevronRight
} from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = [
  "Cosmetics & Personal Care","Alcoholic Drinks","Food Products",
  "Cleaning & Sanitary","Kitchenware & Electronics","Baby Products",
  "Sports & Fitness","Stationery","General",
];

const EMPTY_FORM = {
  name: "", price: "", category: "Food Products",
  subcategoryId: "131", unit: "Pcs", image: "", inStock: true, description: "",
};

type ModalMode = "add" | "edit" | null;

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } finally { setLoading(false); }
  }, [search, category]);

  useEffect(() => { fetchProducts(1); }, [fetchProducts]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditProduct(null); setModalMode("add"); };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, price: String(p.price), category: p.category,
      subcategoryId: String(p.subcategoryId), unit: p.unit, image: p.image,
      inStock: p.inStock, description: p.description || "" });
    setModalMode("edit");
  };
  const closeModal = () => { setModalMode(null); setEditProduct(null); setForm(EMPTY_FORM); };

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    setSaving(true);
    try {
      let res;
      if (modalMode === "add") {
        res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      } else if (modalMode === "edit" && editProduct) {
        res = await fetch(`/api/products/${editProduct.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      }
      if (res?.ok) { toast.success(modalMode === "add" ? "Product added!" : "Product updated!", { icon: "✅" }); closeModal(); fetchProducts(page); }
      else { toast.error("Failed to save product"); }
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Product deleted", { icon: "🗑️" }); setDeleteId(null); fetchProducts(page); }
      else { toast.error("Failed to delete"); }
    } catch { toast.error("Something went wrong"); }
    finally { setDeleting(false); }
  };

  const toggleStock = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, inStock: !product.inStock }) });
      if (res.ok) { toast.success(`Stock updated`); fetchProducts(page); }
    } catch {}
  };

  const inStockCount = products.filter(p => p.inStock).length;
  const avgPrice = products.length ? products.reduce((s,p) => s+p.price, 0)/products.length : 0;

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your Simba Supermarket products</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95 text-sm">
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Package size={20} className="text-green-600"/>, label: "Total Products", value: total.toLocaleString(), bg: "bg-green-50 dark:bg-green-900/20" },
            { icon: <CheckCircle size={20} className="text-emerald-600"/>, label: "In Stock (page)", value: inStockCount, bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { icon: <TrendingUp size={20} className="text-blue-600"/>, label: "Avg Price", value: formatPrice(avgPrice), bg: "bg-blue-50 dark:bg-blue-900/20" },
            { icon: <BarChart3 size={20} className="text-purple-600"/>, label: "Categories", value: "9", bg: "bg-purple-50 dark:bg-purple-900/20" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white/60 dark:border-gray-800`}>
              <div className="flex items-center gap-2 mb-2">{s.icon}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"/>
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[180px]">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => fetchProducts(1)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <RefreshCw size={14}/> Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hidden lg:table-cell">Unit</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {loading ? (
                  Array.from({length: 8}).map((_,i) => (
                    <tr key={i}>{Array.from({length:6}).map((_,j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded shimmer"/></td>
                    ))}</tr>
                  ))
                ) : products.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-16 text-center">
                    <ShoppingBag size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3"/>
                    <p className="text-gray-500 dark:text-gray-400">No products found</p>
                  </td></tr>
                ) : products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1"
                            onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/100x100/f0fdf4/166534?text=${product.name.slice(0,2)}`; }}/>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
                        {product.category.split(" & ")[0]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <button onClick={() => toggleStock(product)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${product.inStock
                          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 hover:bg-green-200"
                          : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}/>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{product.unit}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit2 size={14}/>
                        </button>
                        <button onClick={() => setDeleteId(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">Page {page} of {totalPages} · {total.toLocaleString()} total</p>
              <div className="flex items-center gap-1">
                <button onClick={() => fetchProducts(page-1)} disabled={page===1} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 text-gray-600 dark:text-gray-400 transition-colors">
                  <ChevronLeft size={16}/>
                </button>
                {Array.from({length: Math.min(5, totalPages)}, (_,i) => {
                  const pg = Math.min(Math.max(1, page-2+i), totalPages-Math.min(4,totalPages-1)+i);
                  return (
                    <button key={i} onClick={() => fetchProducts(pg)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${pg===page ? "bg-green-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                      {pg}
                    </button>
                  );
                })}
                <button onClick={() => fetchProducts(page+1)} disabled={page===totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 text-gray-600 dark:text-gray-400 transition-colors">
                  <ChevronRight size={16}/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}/>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                {modalMode==="add" ? "Add New Product" : "Edit Product"}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Product Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Coca-Cola 500ml"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Price (RWF) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="5000" min="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Unit</label>
                  <input value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="Pcs, Kg, L..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Subcategory ID</label>
                  <input type="number" value={form.subcategoryId} onChange={e => setForm({...form, subcategoryId: e.target.value})} placeholder="131"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Image URL</label>
                <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://... (auto-generated if empty)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
                {form.image && (
                  <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img src={form.image} alt="preview" className="w-full h-full object-contain p-1"/>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Short product description..." rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">In Stock</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Available for purchase</p>
                </div>
                <button onClick={() => setForm({...form, inStock: !form.inStock})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.inStock ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${form.inStock ? "translate-x-6" : "translate-x-0.5"}`}/>
                </button>
              </div>
              {form.price && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-green-700 dark:text-green-400 font-medium">Price preview:</span>
                  <span className="text-lg font-bold text-green-700 dark:text-green-400">{formatPrice(parseFloat(form.price)||0)}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900">
              <button onClick={closeModal} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                {saving ? "Saving..." : modalMode==="add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)}/>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-red-500"/>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Delete Product?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This will permanently remove the product from your store. Cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting}
                className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60">
                {deleting ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
