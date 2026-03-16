"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductSchema, type CreateProductInput } from "@/modules/products/validation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Save, 
  Image as ImageIcon, 
  Info,
  DollarSign,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2
} from "lucide-react";

interface ProductFormProps {
  initialData?: {
    name: string;
    description?: string | null;
    price: { toString(): string }; // Prisma Decimal
    stock: number;
    imageUrl?: string | null;
    categoryId?: string | null;
    isActive: boolean;
    spiritualEssence?: string | null;
    specifications?: string | null;
  };
  productId?: string;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, productId, isEdit }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if(data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateProductInput>({
    // @ts-expect-error - Zod/RHF type mismatch
    resolver: zodResolver(CreateProductSchema),
    defaultValues: initialData ? {
      ...initialData,
      description: initialData.description || "",
      imageUrl: initialData.imageUrl || "",
      categoryId: initialData.categoryId || null,
      price: parseFloat(initialData.price.toString()),
      stock: initialData.stock,
      isActive: initialData.isActive,
      spiritualEssence: initialData.spiritualEssence || "",
      specifications: initialData.specifications || "",
    } : {
      name: "",
      description: "",
      stock: 0,
      isActive: true,
      price: 0,
      imageUrl: "",
      categoryId: null,
      spiritualEssence: "",
      specifications: "",
    },
  });

  const handleCreateCategory = async () => {
    if(!newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      });
      const data = await res.json();
      if(data.success && data.data) {
        setCategories(prev => [...prev, data.data].sort((a,b) => a.name.localeCompare(b.name)));
        setValue('categoryId', data.data.id, { shouldValidate: true });
        setIsAddingCategory(false);
        setNewCategoryName("");
      } else {
        setError(data.error || "Failed to create category");
      }
    } catch {
      setError("Failed to create category");
    }
  };

  const onSubmit = async (data: CreateProductInput) => {
    setError(null);
    setSuccess(false);

    try {
      const url = isEdit ? `/api/products/${productId}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${isEdit ? 'update' : 'create'} product`);
      }

      setSuccess(true);
      if (!isEdit) reset();
      
      router.refresh();
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleDelete = async () => {
    if (!productId || !confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      {/* @ts-expect-error - Mismatch between React Hook Form and Zod Input Typings */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
      <div className="lg:col-span-2 space-y-12">
        <div className="glass border border-white/5 rounded-4xl p-10 space-y-10 relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
          
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="h-10 w-10 glass rounded-xl flex items-center justify-center border border-white/10 text-gold/60">
              <Info size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-white">Artifact <span className="text-gold">Essence</span></h2>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 mt-1">Core Identity & Revelation</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] ml-1">Vessel Name</label>
              <input 
                {...register("name")}
                className={`w-full bg-black/40 border ${errors.name ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-5 text-white placeholder:text-zinc-800 focus:outline-none focus:border-gold/30 transition-all shadow-2xl font-light tracking-wide`}
                placeholder="The Eternal Rudraksha"
              />
              {errors.name && <p className="text-red-500 text-[9px] mt-1 ml-1 font-bold uppercase tracking-widest">{errors.name.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] ml-1">Spiritual Category</label>
              {!isAddingCategory ? (
                <div className="flex gap-4">
                  <select
                    {...register("categoryId")}
                    className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-5 text-zinc-300 focus:outline-none focus:border-gold/30 transition-all font-light tracking-wide appearance-none cursor-pointer"
                  >
                    <option value="">Select a Category...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-background-dark text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setIsAddingCategory(true)}
                    className="px-6 rounded-2xl border border-white/10 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/30 transition-all active:scale-95"
                  >
                    + New
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <input
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="New Category Name..."
                    className="flex-1 bg-black/40 border border-gold/30 rounded-2xl p-5 text-white focus:outline-none focus:border-gold/50 transition-all font-light tracking-wide"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-6 rounded-2xl bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all active:scale-95"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-6 rounded-2xl border border-red-500/20 text-red-500/80 hover:bg-red-500/10 transition-all text-xs font-bold uppercase active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] ml-1">Description of Presence</label>
              <textarea 
                {...register("description")}
                rows={3}
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white placeholder:text-zinc-800 focus:outline-none focus:border-gold/30 transition-all shadow-2xl font-light tracking-wide resize-none"
                placeholder="Relate the spiritual properties and divine origin..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] ml-1">Spiritual Essence Details</label>
              <textarea 
                {...register("spiritualEssence")}
                rows={3}
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white placeholder:text-zinc-800 focus:outline-none focus:border-gold/30 transition-all shadow-2xl font-light tracking-wide resize-none"
                placeholder="Governed by cosmic principles..."
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] ml-1">Physical Specifications</label>
              <textarea 
                {...register("specifications")}
                rows={3}
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white placeholder:text-zinc-800 focus:outline-none focus:border-gold/30 transition-all shadow-2xl font-light tracking-wide resize-none"
                placeholder="Hand-crafted using traditional methods..."
              />
            </div>
          </div>
        </div>

        <div className="glass border border-white/5 rounded-4xl p-10 space-y-10 relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-gold/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
          
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="h-10 w-10 glass rounded-xl flex items-center justify-center border border-white/10 text-gold/60">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif italic text-white">Manifestation <span className="text-gold">Exchange</span></h2>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 mt-1">Value & Availability in the Realm</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] ml-1">Energy Required (USD)</label>
              <div className="relative group/price">
                <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within/price:text-gold transition-colors" size={18} />
                <input 
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className={`w-full bg-black/40 border ${errors.price ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-5 pl-12 text-white placeholder:text-zinc-800 focus:outline-none focus:border-gold/30 transition-all shadow-2xl font-light tracking-wide`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="text-red-500 text-[9px] mt-1 ml-1 font-bold uppercase tracking-widest">{errors.price.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] ml-1">Manifested Units</label>
              <input 
                {...register("stock", { valueAsNumber: true })}
                type="number"
                className={`w-full bg-black/40 border ${errors.stock ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-5 text-white placeholder:text-zinc-800 focus:outline-none focus:border-gold/30 transition-all shadow-2xl font-light tracking-wide`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-[9px] mt-1 ml-1 font-bold uppercase tracking-widest">{errors.stock.message}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
          <div className="glass border border-white/5 rounded-4xl p-10 space-y-10 sticky top-32">
            <div className="space-y-8">
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="h-10 w-10 glass rounded-xl flex items-center justify-center border border-white/10 text-gold/60">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-serif italic text-white">Visual <span className="text-gold">Projection</span></h2>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 mt-1">Artwork of the Item</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div 
                  className="aspect-square w-full bg-black/40 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-gold/20 transition-all duration-700 cursor-pointer shadow-inner"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-4 relative z-10">
                      <Loader2 className="animate-spin text-gold" size={32} />
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Harmonizing...</p>
                    </div>
                  ) : watch("imageUrl") ? (
                    <>
                      <Image 
                        src={watch("imageUrl") || ""} 
                        alt="Preview" 
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-gold">Modify Projection</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center relative z-10 text-center px-6">
                      <div className="h-16 w-16 glass rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 group-hover:border-gold/20 transition-all duration-700">
                        <ImageIcon className="text-zinc-600 group-hover:text-gold transition-colors duration-700" size={24} />
                      </div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Reveal Artwork</p>
                      <p className="text-[8px] text-zinc-700 mt-2 font-bold uppercase tracking-widest">Divine Resolution (Max 5MB)</p>
                    </div>
                  )}
                  <input 
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setIsUploading(true);
                      setError(null);

                      try {
                        const formData = new FormData();
                        formData.append("file", file);

                        const response = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });

                        const result = await response.json();

                        if (!response.ok) {
                          throw new Error(result.error || "Upload failed");
                        }

                        setValue("imageUrl", result.url, { shouldValidate: true });
                      } catch (err: unknown) {
                        if (err instanceof Error) setError(err.message);
                        else setError("Upload failed");
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em] ml-1">Universal Path</label>
                  <input 
                    {...register("imageUrl")}
                    className={`w-full bg-black/40 border ${errors.imageUrl ? 'border-red-500/50' : 'border-white/5'} rounded-xl p-4 text-[10px] text-white focus:outline-none focus:border-gold/20 transition-all font-mono opacity-60 hover:opacity-100 focus:opacity-100`}
                    placeholder="/sacred/artifact.jpg"
                  />
                  {errors.imageUrl && <p className="text-red-500 text-[9px] mt-1 ml-1 font-bold uppercase tracking-widest">{errors.imageUrl.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 space-y-10">
               <div className="flex items-center justify-between group/toggle cursor-pointer" onClick={() => setValue("isActive", !watch("isActive"), { shouldValidate: true })}>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">Manifested State</span>
                    <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-[0.4em] mt-1 group-hover:text-gold/60 transition-colors">
                      {watch("isActive") ? "Visible in Realm" : "Hidden in Ether"}
                    </span>
                  </div>
                  <div
                    className={`h-6 w-11 rounded-full p-1 transition-all duration-500 relative ${watch("isActive") ? 'bg-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-zinc-900 border border-white/5'}`}
                  >
                    <div className={`h-4 w-4 bg-white rounded-full transition-all duration-500 shadow-xl ${watch("isActive") ? 'ml-5' : 'ml-0'}`} />
                  </div>
               </div>

              <div className="space-y-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gold transition-all duration-500 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Save size={18} className="group-hover:scale-110 transition-transform duration-500" />
                      <span>{isEdit ? "Harden Modification" : "Release to World"}</span>
                    </>
                  )}
                </button>

                {isEdit && (
                  <button 
                    type="button"
                    onClick={handleDelete}
                    className="w-full bg-red-500/5 text-red-500/60 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white border border-red-500/10 hover:border-red-500 transition-all duration-500 group active:scale-95"
                  >
                    <Trash2 size={18} className="group-hover:rotate-12 transition-transform duration-500" />
                    <span>Return to Void</span>
                  </button>
                )}
              </div>
            </div>

            {(success || error) && (
              <div className={`p-6 rounded-3xl border flex items-start gap-4 animate-in slide-in-from-top-4 duration-700 ${success ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                {success ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{success ? "Divine Success" : "Disturbance Found"}</span>
                  <span className="text-[10px] font-medium leading-relaxed opacity-80">
                    {success ? `The artifact has been successfully ${isEdit ? 'refined' : 'manifested'}.` : error}
                  </span>
                </div>
              </div>
            )}
          </div>
      </div>
      </form>
    </>
  );
}
