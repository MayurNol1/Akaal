import { ProductService } from "@/modules/products/product.service";
import Link from "next/link";
import { Plus, Search, Filter, Edit2, Trash2, Eye, Package } from "lucide-react";
import Image from "next/image";

export default async function AdminProductsPage() {
  const products = await ProductService.getProducts();

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Inventory Catalog</h1>
          <p className="text-zinc-500 font-medium">Manage your products, visibility, and stock levels.</p>
        </div>
        <Link 
          href="/admin/products/create"
          className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          Create Product
        </Link>
      </header>

      {/* Filter Bar */}
      <div className="flex gap-4 items-center bg-zinc-900/50 border border-white/10 p-4 rounded-2xl">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-white transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..."
            className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm"
          />
        </div>
        <button className="bg-white/5 hover:bg-white/10 border border-white/5 p-2.5 rounded-xl transition-all">
          <Filter size={18} className="text-zinc-400 hover:text-white" />
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-900/80 border-b border-white/10 text-left text-xs uppercase tracking-widest text-zinc-500">
              <th className="px-8 py-5 font-bold">Product Details</th>
              <th className="px-8 py-5 font-bold">Category</th>
              <th className="px-8 py-5 font-bold">Status</th>
              <th className="px-8 py-5 font-bold text-right">Price / Stock</th>
              <th className="px-8 py-5 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden relative shrink-0">
                      {product.imageUrl ? (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <Package size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:underline underline-offset-4 decoration-zinc-600 truncate max-w-[200px]">
                        {product.name}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tight font-medium">#{product.id.slice(-8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-zinc-400 text-sm font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {product.category?.name || "Uncategorized"}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${product.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-700"}`} />
                    <span className={`text-xs font-bold ${product.isActive ? "text-emerald-500" : "text-zinc-600"}`}>
                      {product.isActive ? "ACTIVE" : "HIDDEN"}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <p className="font-bold text-white">${parseFloat(product.price.toString()).toFixed(2)}</p>
                  <p className={`text-xs mt-1 font-bold ${product.stock <= 5 ? "text-amber-500" : "text-zinc-500"}`}>
                    {product.stock} units
                  </p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
                    <Link href={`/admin/products/edit/${product.id}`} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-all">
                      <Edit2 size={16} />
                    </Link>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-500 transition-all">
                      <Trash2 size={16} />
                    </button>
                    <Link href={`/admin/products/view/${product.id}`} className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-zinc-100 transition-all">
                      <Eye size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-zinc-600 bg-black/40">
            <Package size={64} className="mb-4 text-zinc-800" />
            <p className="text-lg font-bold">No products found in your catalog.</p>
            <p className="text-sm mt-2">Start by creating your first product listing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
