"use client";

import Link from "next/link";
import { Plus, Search, Filter, Edit2, Trash2, Eye, Package, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
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
    if (q && q !== search) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch(q);
    }
  }, [searchParams, search]);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div style={{ display:"flex", flexDirection:"column", gap:"28px" }}>
      {toast && (
        <div style={{ position:"fixed", top:"84px", right:"20px", zIndex:50, animation:"fadeIn 0.3s ease-out" }}>
           <div className={`backdrop-blur-3xl border px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl`} style={{ background: toast.type==='success' ? 'rgba(212,169,74,0.1)' : 'rgba(248,113,113,0.1)', border: toast.type==='success' ? '1px solid rgba(212,169,74,0.22)' : '1px solid rgba(248,113,113,0.22)', color: toast.type==='success' ? '#d4a94a' : '#f87171' }}>
              {toast.type === 'success' ? <Package size={20} /> : <AlertCircle size={20} />}
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Vault Ritual</p>
                 <p className="text-xs text-white">{toast.message}</p>
              </div>
           </div>
        </div>
      )}

      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"16px", paddingBottom:"24px", borderBottom:"1px solid rgba(212,169,74,0.08)" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
           <div style={{ width:"40px", height:"2px", background:"#d4a94a", borderRadius:"99px", marginBottom:"8px" }} />
           <p style={{ fontSize:"10px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.25em", color:"rgba(160,155,135,0.45)", margin:0 }}>Product Management</p>
           <h1 className="text-5xl font-serif italic text-white tracking-tight">Artifact <span className="not-italic" style={{ color:"#d4a94a" }}>Vault</span></h1>
        </div>
        <Link 
          href="/admin/products/create"
          style={{ background:"#d4a94a", color:"#10100e", padding:"10px 20px", borderRadius:"10px", fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", display:"flex", alignItems:"center", gap:"8px", textDecoration:"none", border:"none", cursor:"pointer", whiteSpace:"nowrap" }}
        >
          <Plus size={16} />
          Forge New Offering
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 group w-full">
          <Search style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", color:"rgba(160,155,135,0.4)" }} size={16} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artifacts by name or vibration..."
            style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(212,169,74,0.1)", borderRadius:"12px", padding:"10px 10px 10px 44px", outline:"none", fontSize:"12px", color:"#f0ede6", fontFamily:"var(--font-sans)" }}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <div style={{ padding:"10px 16px", borderRadius:"10px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(212,169,74,0.1)", display:"flex", alignItems:"center", gap:"8px", fontSize:"10px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(160,155,135,0.45)", cursor:"pointer", whiteSpace:"nowrap" }}>
              <Filter size={16} />
              Filter Essences
           </div>
        </div>
      </div>

      {/* Product Table from Stitch UI */}
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(212,169,74,0.1)", borderRadius:"16px", overflow:"hidden" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.01)", borderBottom:"1px solid rgba(212,169,74,0.07)" }}>
              <th className="px-10 py-6 font-bold">Artifact Details</th>
              <th className="px-10 py-6 font-bold">Category</th>
              <th className="px-10 py-6 font-bold">Energy Level (Stock)</th>
              <th className="px-10 py-6 font-bold text-right">Investment</th>
              <th className="px-10 py-6 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom:"1px solid rgba(212,169,74,0.04)", transition:"background 0.15s", cursor:"default" }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.02)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent"}}>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-6">
                    <div style={{ width:"56px", height:"56px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(212,169,74,0.1)", borderRadius:"10px", overflow:"hidden", position:"relative", flexShrink:0 }}>
                      {product.imageUrl ? (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name} 
                          fill 
                          unoptimized
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                      ) : (
                        <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(212,169,74,0.2)" }}>
                          <Package size={24} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
                      <h4 style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontSize:"16px", color:"#f0ede6", margin:0 }}>
                        {product.name}
                      </h4>
                      <p style={{ fontSize:"10px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.14em", color:"rgba(160,155,135,0.35)", margin:0 }}>{product.category?.name || "Uncategorised"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-3">
                    <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:product.isActive ? "#d4a94a" : "#3a3a3a", boxShadow:product.isActive ? "0 0 8px rgba(212,169,74,0.4)" : "none" }} />
                    <span style={{ fontSize:"9px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:product.isActive ? "#d4a94a" : "#4a4a4a" }}>
                      {product.isActive ? "VIBRANT" : "DORMANT"}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <p className="text-[11px]" style={{ fontSize:"11px", fontStyle:"italic", color:product.stock <= 5 ? "#ff9933" : "rgba(160,155,135,0.45)" }}>
                    {product.stock} units available
                  </p>
                </td>
                <td className="px-10 py-8 text-right">
                  <p style={{ fontFamily:"var(--font-serif)", fontSize:"17px", fontWeight:700, color:"#f0ede6", fontStyle:"italic", margin:0 }}>
                    ₹{parseFloat(product.price.toString()).toLocaleString()}
                  </p>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center justify-center gap-4 group-hover:translate-x-0 transition-all duration-700">
                    <Link href={`/admin/products/edit/${product.id}`} style={{ width:"34px", height:"34px", background:"rgba(212,169,74,0.06)", border:"1px solid rgba(212,169,74,0.12)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(160,155,135,0.6)", textDecoration:"none", transition:"all 0.18s" }}>
                      <Edit2 size={14} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      style={{ width:"34px", height:"34px", background:"rgba(248,113,113,0.04)", border:"1px solid rgba(248,113,113,0.1)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(248,113,113,0.45)", cursor:"pointer", transition:"all 0.18s" }}
                    >
                      <Trash2 size={14} />
                    </button>
                    <Link href={`/products/${product.id}`} style={{ width:"34px", height:"34px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(160,155,135,0.5)", textDecoration:"none" }}>
                      <Eye size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && !loading && (
          <div style={{ padding:"80px 32px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:"16px", background:"rgba(0,0,0,0.3)" }}>
            <div className="relative group">
               <div style={{ position:"absolute", inset:0, background:"rgba(212,169,74,0.05)", filter:"blur(24px)", borderRadius:"50%", transform:"scale(1.5)" }} />
               <span className="material-symbols-outlined" style={{ fontSize:"64px", color:"rgba(212,169,74,0.1)", position:"relative", zIndex:1 }}>inventory_2</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
               <p className="font-serif italic text-2xl tracking-widest text-white">The vault is currently silent.</p>
               <p style={{ fontSize:"10px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.2em", color:"rgba(160,155,135,0.3)", margin:0 }}>No products created yet</p>
            </div>
            <Link href="/admin/products/create" style={{ padding:"11px 24px", borderRadius:"10px", background:"#d4a94a", color:"#10100e", fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", textDecoration:"none" }}>
               Begin Forging
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
