"use client";

import ProductForm from "@/components/admin/product-form";

export default function CreateProductPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div style={{ paddingBottom: "24px", borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
        <div style={{ width: "40px", height: "2px", background: "#d4a94a", borderRadius: "99px", marginBottom: "12px" }} />
        <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(160,155,135,0.45)", margin: "0 0 6px" }}>New Product</p>
        <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(26px,3vw,36px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
          Create <em style={{ color: "#d4a94a" }}>Artifact</em>
        </h1>
      </div>
      <div style={{ background: "rgba(22,22,18,0.72)", backdropFilter: "blur(20px)", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "20px", padding: "clamp(24px,4vw,40px)" }}>
        <ProductForm />
      </div>
    </div>
  );
}
