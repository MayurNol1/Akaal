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
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header — same pattern as every admin page */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", paddingBottom: "24px", borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link
            href="/admin/products"
            aria-label="Back to products"
            style={{ width: "48px", height: "48px", background: "rgba(22,22,18,0.72)", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(200,195,178,0.65)", textDecoration: "none", flexShrink: 0 }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div style={{ width: "40px", height: "2px", background: "#d4a94a", borderRadius: "99px", marginBottom: "12px" }} />
            <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(160,155,135,0.45)", margin: "0 0 6px" }}>Product Management</p>
            <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(26px,3vw,36px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
              Edit <em style={{ color: "#d4a94a" }}>Artifact</em>
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "rgba(160,155,135,0.45)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "rgba(212,169,74,0.4)" }}>auto_awesome</span>
          <span style={{ fontStyle: "italic", color: "rgba(200,195,178,0.55)" }}>&ldquo;{product.name}&rdquo;</span>
        </div>
      </div>

      <ProductForm initialData={product} productId={id} isEdit />
    </div>
  );
}
