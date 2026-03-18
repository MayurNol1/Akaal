"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@prisma/client";
import { ProductCardStitch } from "@/components/products/product-card";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      const likedIds: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("liked_")) likedIds.push(key.replace("liked_", ""));
      }
      if (likedIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/products?ids=${likedIds.join(",")}`);
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
        else if (data?.success && Array.isArray(data.data)) setProducts(data.data);
      } catch (err) {
        console.error("Failed to fetch wishlist products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
    window.addEventListener("wishlist-updated", loadWishlist);
    return () => window.removeEventListener("wishlist-updated", loadWishlist);
  }, []);

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px clamp(16px,4vw,48px) 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px", paddingBottom: "32px", borderBottom: "1px solid rgba(212,169,74,0.1)" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "8px" }}>My Account</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
              My <em style={{ color: "#d4a94a" }}>Wishlist</em>
            </h1>
            {!loading && (
              <span style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)", padding: "6px 14px", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "8px" }}>
                {products.length} saved item{products.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p style={{ fontSize: "14px", color: "rgba(200,195,178,0.65)", lineHeight: 1.6, marginTop: "10px", maxWidth: "480px" }}>
            Artifacts that have resonated with your spirit. Revisit them before they&apos;re gone.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ minHeight: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "3px solid rgba(212,169,74,0.15)", borderTopColor: "#d4a94a", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Loading wishlist…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : products.length === 0 ? (
          <div style={{ minHeight: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", background: "#161612", border: "1px solid rgba(212,169,74,0.08)", borderRadius: "16px", textAlign: "center", padding: "56px 40px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "72px", color: "rgba(212,169,74,0.12)" }}>favorite_border</span>
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 600, color: "#f0ede6", fontStyle: "italic", marginBottom: "8px" }}>Your wishlist is empty</h2>
              <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.45)", maxWidth: "320px", margin: "0 auto" }}>
                Browse our collections and tap the heart on any product to save it here.
              </p>
            </div>
            <Link href="/products" style={{ padding: "12px 28px", background: "#d4a94a", color: "#10100e", borderRadius: "10px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
              Browse Collections
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {products.map((product) => (
              <ProductCardStitch key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
