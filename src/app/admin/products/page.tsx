"use client";

import Link from "next/link";
import { Plus, Search, Filter, Edit2, Trash2, Eye, Package, Sparkles, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

type ProductWithCategory = {
  id: string;
  name: string;
  stock: number;
  price: string | number | { toString(): string };
  isActive: boolean;
  imageUrl: string | null;
  category: { name: string } | null;
};

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, [searchParams]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products')
      .then(res => res.json())
      .then(response => {
        setProducts(response.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to return ${name} to the void?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`${name} has been erased.`);
        setProducts(products.filter(p => p.id !== id));
      } else {
        showToast(data.error || "Failed to erase artifact.", 'error');
      }
    } catch {
      showToast("Ethereal connection failed.", 'error');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in relative z-10">
      {toast && (
        <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 fade-in duration-500">
           <div className={`backdrop-blur-3xl border px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl ${toast.type === 'success' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              {toast.type === 'success' ? <Package size={20} /> : <AlertCircle size={20} />}
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Vault Ritual</p>
                 <p className="text-xs text-white">{toast.message}</p>
              </div>
           </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
           <div className="h-px w-12 bg-primary/50" />
           <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">Sacred Inventory Hub</p>
           <h1 className="text-5xl font-serif italic text-white tracking-tight">Artifact <span className="text-primary not-italic">Vault</span></h1>
        </div>
        <Link 
          href="/admin/products/create"
          className="bg-primary text-background-dark px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white transition-all duration-500 shadow-2xl active:scale-95 whitespace-nowrap"
        >
          <Plus size={16} />
          Forge New Offering
        </Link>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-primary transition-colors duration-500" size={18} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artifacts by name or vibration..."
            className="w-full bg-white/2 border border-white/5 rounded-[20px] py-4 pl-14 pr-6 focus:outline-none focus:border-primary/30 transition-all text-xs font-medium placeholder:text-zinc-800 text-white"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <div className="bg-white/2 px-6 py-4 rounded-[20px] border border-white/5 flex items-center gap-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest cursor-pointer hover:border-white/10 transition-colors w-full md:w-auto whitespace-nowrap">
              <Filter size={16} />
              Filter Essences
           </div>
        </div>
      </div>

      {/* Product Table from Stitch UI */}
      <div className="bg-white/2 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl transition-all duration-700 hover:border-primary/5">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/1 border-b border-white/5 text-left text-[9px] uppercase tracking-[0.4em] text-zinc-600">
              <th className="px-10 py-6 font-bold">Artifact Details</th>
              <th className="px-10 py-6 font-bold">Category</th>
              <th className="px-10 py-6 font-bold">Energy Level (Stock)</th>
              <th className="px-10 py-6 font-bold text-right">Investment</th>
              <th className="px-10 py-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-white/3 transition-all duration-500 group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 bg-white/5 border border-white/5 rounded-2xl overflow-hidden relative shrink-0 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-700">
                      {product.imageUrl ? (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name} 
                          fill 
                          unoptimized
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-800 group-hover:text-primary/40 transition-colors">
                          <Package size={24} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif italic text-xl text-white group-hover:text-primary transition-colors duration-500">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{product.category?.name || "Ancient Relic"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${product.isActive ? "bg-primary shadow-[0_0_10px_rgba(236,149,19,0.4)]" : "bg-zinc-800"}`} />
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${product.isActive ? "text-primary" : "text-zinc-700"}`}>
                      {product.isActive ? "VIBRANT" : "DORMANT"}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <p className={`text-[11px] font-serif font-bold italic tracking-wide group-hover:text-white transition-colors ${product.stock <= 5 ? "text-saffron shadow-[0_0_8px_rgba(255,153,51,0.2)]" : "text-zinc-500"}`}>
                    {product.stock} units available
                  </p>
                </td>
                <td className="px-10 py-8 text-right">
                  <p className="text-xl font-serif font-black text-white italic tracking-widest group-hover:text-primary transition-colors duration-500">
                    ₹{parseFloat(product.price.toString()).toLocaleString()}
                  </p>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center justify-center gap-4 group-hover:translate-x-0 transition-all duration-700">
                    <Link href={`/admin/products/edit/${product.id}`} className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-xl text-zinc-600 hover:text-primary hover:border-primary/20 border border-transparent transition-all">
                      <Edit2 size={14} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-xl text-zinc-600 hover:text-red-400 hover:border-red-400/20 border border-transparent transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                    <Link href={`/products/${product.id}`} className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-xl text-zinc-600 hover:text-white hover:border-white/20 border border-transparent transition-all">
                      <Eye size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && !loading && (
          <div className="p-32 flex flex-col items-center justify-center text-center space-y-8 bg-black/40">
            <div className="relative group">
               <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150" />
               <Sparkles size={80} strokeWidth={1} className="relative z-10 text-zinc-900" />
            </div>
            <div className="space-y-2">
               <p className="font-serif italic text-2xl tracking-widest text-white">The vault is currently silent.</p>
               <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.4em]">No artifacts have been manifested yet</p>
            </div>
            <Link href="/admin/products/create" className="px-10 py-5 rounded-[20px] bg-primary text-background-dark text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-white transition-all duration-700">
               Begin Forging
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
