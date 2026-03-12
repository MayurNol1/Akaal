"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductSchema, type CreateProductInput } from "@/modules/products/product.validation";
import { useState } from "react";
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
    price: any; // Prisma Decimal
    stock: number;
    imageUrl?: string | null;
    categoryId?: string | null;
    isActive: boolean;
  };
  productId?: string;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, productId, isEdit }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: initialData ? {
      ...initialData,
      description: initialData.description || "",
      imageUrl: initialData.imageUrl || "",
      categoryId: initialData.categoryId || null,
      price: parseFloat(initialData.price.toString()),
      stock: initialData.stock,
      isActive: initialData.isActive,
    } : {
      name: "",
      description: "",
      stock: 0,
      isActive: true,
      price: 0,
      imageUrl: "",
      categoryId: null
    },
  });

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
    <form onSubmit={handleSubmit(onSubmit as any)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Info size={18} className="text-zinc-500" />
            <h2 className="text-lg font-bold">Base Information</h2>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-400 ml-1">Product Name</label>
            <input 
              {...register("name")}
              className={`w-full bg-black/60 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner`}
              placeholder="e.g., Premium Leather Jacket"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-400 ml-1">Description</label>
            <textarea 
              {...register("description")}
              rows={5}
              className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner resize-none"
              placeholder="Describe the product..."
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Layers size={18} className="text-zinc-500" />
            <h2 className="text-lg font-bold">Inventory & Pricing</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Price (USD)</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-white transition-colors" size={18} />
                <input 
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className={`w-full bg-black/60 border ${errors.price ? 'border-red-500' : 'border-white/10'} rounded-2xl p-4 pl-12 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner`}
                  placeholder="29.99"
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Initial Stock</label>
              <input 
                {...register("stock", { valueAsNumber: true })}
                type="number"
                className={`w-full bg-black/60 border ${errors.stock ? 'border-red-500' : 'border-white/10'} rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.stock.message}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ImageIcon size={18} className="text-zinc-500" />
                <h2 className="text-lg font-bold">Media Assets</h2>
              </div>
              
              <div className="space-y-4">
                <div 
                  className="aspect-square w-full bg-black/40 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/20 transition-all cursor-pointer"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="animate-spin text-gold mb-2" size={32} />
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Uploading...</p>
                    </div>
                  ) : watch("imageUrl") ? (
                    <>
                      <Image 
                        src={watch("imageUrl") || ""} 
                        alt="Preview" 
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform">
                        <ImageIcon className="text-zinc-500" size={24} />
                      </div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Upload Artwork</p>
                      <p className="text-[10px] text-zinc-600 mt-2">JPG, PNG or WEBP (Max 5MB)</p>
                    </>
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
                      } catch (err: any) {
                        setError(err.message);
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Server Path / URL</label>
                  <input 
                    {...register("imageUrl")}
                    className={`w-full bg-black/60 border ${errors.imageUrl ? 'border-red-500' : 'border-white/5'} rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-white/10 transition-all`}
                    placeholder="/uploads/..."
                  />
                  {errors.imageUrl && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.imageUrl.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Published State</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-1">Live in catalog</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValue("isActive", !watch("isActive"), { shouldValidate: true })}
                    className={`h-6 w-11 rounded-full p-1 transition-all duration-300 relative ${watch("isActive") ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'}`}
                  >
                    <div className={`h-4 w-4 bg-white rounded-full transition-all duration-300 ${watch("isActive") ? 'ml-5' : 'ml-0'}`} />
                  </button>
               </div>
            </div>

            <div className="space-y-3">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    <span>{isEdit ? "Save Modifications" : "Publish to Store"}</span>
                  </>
                )}
              </button>

              {isEdit && (
                <button 
                  type="button"
                  onClick={handleDelete}
                  className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-500/20 border border-red-500/20 transition-all group active:scale-95"
                >
                  <Trash2 size={20} className="group-hover:rotate-12 transition-transform" />
                  <span>Archive & Delete</span>
                </button>
              )}
            </div>
          </div>

        {(success || error) && (
          <div className={`p-6 rounded-3xl border flex items-start gap-4 animate-in slide-in-from-top-4 duration-500 ${success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            {success ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertCircle size={24} className="shrink-0" />}
            <div className="flex flex-col">
              <span className="font-bold">{success ? "Success!" : "Action Failed"}</span>
              <span className="text-xs font-medium mt-1 leading-relaxed">
                {success ? `The product has been ${isEdit ? 'updated' : 'added'}. Redirecting...` : error}
              </span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
