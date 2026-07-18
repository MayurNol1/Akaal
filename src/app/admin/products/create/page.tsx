"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/product-form";

export default function CreateProductPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header — same pattern as every admin page */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", paddingBottom: "24px", borderBottom: "1px solid rgba(212,169,74,0.08)" }}>
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
            Create <em style={{ color: "#d4a94a" }}>Artifact</em>
          </h1>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
