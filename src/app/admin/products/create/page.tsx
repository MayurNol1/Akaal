import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/admin/product-form";

export default function CreateProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      <header className="flex items-center gap-6">
        <Link 
          href="/admin/products"
          className="h-12 w-12 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all active:scale-90"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Listing</h1>
          <p className="text-zinc-500 font-medium">Draft a new product for your digital store.</p>
        </div>
      </header>

      <ProductForm />
    </div>
  );
}
