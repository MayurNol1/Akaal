import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/admin/product-form";
import { ProductService } from "@/modules/products/service";
import { notFound } from "next/navigation";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  let product;
  try {
    product = await ProductService.getProductById(id);
    if (!product) notFound();
  } catch {
    notFound();
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"28px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"16px", paddingBottom:"24px", borderBottom:"1px solid rgba(212,169,74,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
          <Link 
            href="/admin/products"
            style={{ width:"56px", height:"56px", background:"rgba(22,22,18,0.72)", backdropFilter:"blur(20px)", border:"1px solid rgba(212,169,74,0.1)", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s", cursor:"pointer", color:"rgba(200,195,178,0.65)", textDecoration:"none" }}
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
             <div style={{ width:"36px", height:"2px", background:"#d4a94a", borderRadius:"99px" }} />
             <p style={{ fontSize:"10px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.25em", color:"rgba(160,155,135,0.45)", margin:0 }}>Edit Product</p>
             <h1 style={{ fontFamily:"var(--font-serif),'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,40px)", fontWeight:600, background:"linear-gradient(135deg,#e8c06c,#d4a94a,#b87a2a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:0 }}>Modify <span style={{ WebkitTextFillColor:"#f0ede6" }}>Listing</span></h1>
          </div>
        </div>
        
        <div style={{ display:"flex", alignItems:"center", gap:"12px", fontSize:"10px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:"rgba(160,155,135,0.45)" }}>
           <span className="material-symbols-outlined" style={{ fontSize:"14px", color:"rgba(212,169,74,0.4)" }}>auto_awesome</span>
    <span style={{ fontStyle:"italic", color:"rgba(200,195,178,0.55)", fontSize:"11px" }}>&ldquo;{product.name}&rdquo;</span>
        </div>
      </div>

      <div style={{ maxWidth:"1200px" }}>
        <ProductForm initialData={product} productId={id} isEdit />
      </div>
    </div>
  );
}
