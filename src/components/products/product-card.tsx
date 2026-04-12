"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LikeButton } from "./like-button";

const FALLBACK = "https://lh3.googleusercontent.com/aida-public/AB6AXuBfdsGV6aNSxqvazDqkT7tcstkj-L8oBUe0ArkfkL_J5tK7luTCM_4wySIyuD9UHwMC-s0nSNtfVbkjLMGeJh6orSysXUnN2IupfunTPLUsRWpn_oUQ-XiMJf0vlu1kUeJWz8zam4yxxQeRmen33focXfDToKydsGGagolfpwG23ZawDPMFO_fja2VkIzAfVDlq9ZAE0641Ymy3cSzBwbI6R-FbGRunWxNcH6Gz2qtWECZcSBDN5nZj2d55dksrBVFO3-B05fvwoV4";

export function ProductCardStitch({ product }: { product: Product }) {
  const price = parseFloat(product.price.toString());
  const isNew = product.stock > 50;
  const isLow = product.stock > 0 && product.stock <= 10;
  const isSold = product.stock === 0;
  const imgSrc = product.imageUrl || FALLBACK;
  const isLocal = imgSrc.startsWith("/");

  return (
    <div
      style={{
        background: "#161612",
        border: "1px solid rgba(212,169,74,0.1)",
        borderRadius: "14px",
        overflow: "hidden",
        transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
        cursor: "pointer",
        position: "relative",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.45)";
        el.style.borderColor = "rgba(212,169,74,0.22)";
        const img = el.querySelector(".pcard-img") as HTMLElement | null;
        if (img) img.style.transform = "scale(1.05)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        el.style.borderColor = "rgba(212,169,74,0.1)";
        const img = el.querySelector(".pcard-img") as HTMLElement | null;
        if (img) img.style.transform = "scale(1)";
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden", background: "#1c1c18" }}>
        <Link href={`/products/${product.id}`} style={{ display: "block", position: "absolute", inset: 0 }}>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="pcard-img"
            style={{ objectFit: "cover", transition: "transform 0.45s ease" }}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            unoptimized={isLocal}
          />
        </Link>

        {/* Badges */}
        {isNew && !isLow && (
          <span style={{ position: "absolute", top: "10px", left: "10px", zIndex: 2, padding: "3px 9px", borderRadius: "99px", fontSize: "10px", fontWeight: 700, background: "rgba(212,169,74,0.92)", color: "#10100e" }}>
            Bestseller
          </span>
        )}
        {isLow && (
          <span style={{ position: "absolute", top: "10px", left: "10px", zIndex: 2, padding: "3px 9px", borderRadius: "99px", fontSize: "10px", fontWeight: 700, background: "rgba(255,153,51,0.92)", color: "#10100e" }}>
            Low Stock
          </span>
        )}
        {isSold && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(16,16,14,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,195,178,0.65)", background: "rgba(16,16,14,0.9)", padding: "6px 14px", borderRadius: "99px", border: "1px solid rgba(200,195,178,0.15)" }}>
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 3 }}>
          <LikeButton productId={product.id} variant="card" />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontSize: "9.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(212,169,74,0.55)", margin: 0 }}>
          Spiritual Artifact
        </span>
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          <h3 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 600, color: "#f0ede6", lineHeight: 1.25, margin: "0 0 2px" }}>
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p style={{ fontSize: "11.5px", color: "rgba(160,155,135,0.5)", lineHeight: 1.5, margin: 0 }}>
            {product.description.slice(0, 65)}{product.description.length > 65 ? "…" : ""}
          </p>
        )}

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px", marginTop: "2px" }}>
          {[1,2,3,4,5].map(i => (
            <span key={i} className="material-symbols-outlined" style={{ fontSize: "11px", color: "#d4a94a", fontVariationSettings: "'FILL' 1" }}>star</span>
          ))}
          <span style={{ fontSize: "10px", color: "rgba(160,155,135,0.4)", marginLeft: "4px" }}>(42)</span>
        </div>

        {/* Footer — price + add to cart */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(212,169,74,0.07)" }}>
          <span style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 700, color: "#d4a94a" }}>
            ₹{price.toLocaleString("en-IN")}
          </span>
          <AddToCartButton productId={product.id} variant="minimal" />
        </div>
      </div>
    </div>
  );
}
