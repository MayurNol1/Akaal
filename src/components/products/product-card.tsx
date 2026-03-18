import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LikeButton } from "./like-button";

export function ProductCardStitch({ product }: { product: Product }) {
  const price = parseFloat(product.price.toString());
  const isNew = product.stock > 50;
  const isLow = product.stock > 0 && product.stock <= 10;
  const isSold = product.stock === 0;

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
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)";
        el.style.borderColor = "rgba(212,169,74,0.2)";
        const img = el.querySelector(".pcard-img") as HTMLElement;
        if (img) img.style.transform = "scale(1.04)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        el.style.borderColor = "rgba(212,169,74,0.1)";
        const img = el.querySelector(".pcard-img") as HTMLElement;
        if (img) img.style.transform = "scale(1)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "1 / 1", background: "#1c1c18" }}>
        <Link href={`/products/${product.id}`} style={{ display: "block", width: "100%", height: "100%", position: "absolute", inset: 0 }}>
          <Image
            src={product.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBfdsGV6aNSxqvazDqkT7tcstkj-L8oBUe0ArkfkL_J5tK7luTCM_4wySIyuD9UHwMC-s0nSNtfVbkjLMGeJh6orSysXUnN2IupfunTPLUsRWpn_oUQ-XiMJf0vlu1kUeJWz8zam4yxxQeRmen33focXfDToKydsGGagolfpwG23ZawDPMFO_fja2VkIzAfVDlq9ZAE0641Ymy3cSzBwbI6R-FbGRunWxNcH6Gz2qtWECZcSBDN5nZj2d55dksrBVFO3-B05fvwoV4"}
            alt={product.name}
            fill
            className="pcard-img object-cover"
            style={{ transition: "transform 0.4s ease" }}
          />
        </Link>

        {/* Badge */}
        {isNew && (
          <span style={{
            position: "absolute", top: "12px", left: "12px", zIndex: 2,
            padding: "3px 9px", borderRadius: "99px",
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
            background: "rgba(212,169,74,0.9)", color: "#10100e",
          }}>Bestseller</span>
        )}
        {isLow && (
          <span style={{
            position: "absolute", top: "12px", left: "12px", zIndex: 2,
            padding: "3px 9px", borderRadius: "99px",
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
            background: "rgba(255,153,51,0.9)", color: "#10100e",
          }}>Low Stock</span>
        )}
        {isSold && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(16,16,14,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
          }}>
            <span style={{
              fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(160,155,135,0.7)", background: "rgba(16,16,14,0.9)",
              padding: "6px 14px", borderRadius: "99px", border: "1px solid rgba(160,155,135,0.2)",
            }}>Out of Stock</span>
          </div>
        )}

        {/* Wishlist */}
        <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 3 }}>
          <LikeButton productId={product.id} variant="card" />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(212,169,74,0.6)", margin: 0 }}>
          Spiritual Artifact
        </p>
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          <h3 style={{
            fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
            fontSize: "17px", fontWeight: 600, color: "#f0ede6",
            lineHeight: 1.2, margin: "0 0 4px",
            transition: "color 0.2s",
          }}>
            {product.name}
          </h3>
        </Link>
        <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", lineHeight: 1.4, margin: 0 }}>
          Authentic sacred item. Ethically sourced and energised.
        </p>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: "3px", margin: "4px 0 8px" }}>
          {[1,2,3,4,5].map(i => (
            <span key={i} className="material-symbols-outlined" style={{
              fontSize: "11px", color: "#d4a94a",
              fontVariationSettings: "'FILL' 1",
            }}>star</span>
          ))}
          <span style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)", marginLeft: "2px" }}>(42)</span>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: "12px", borderTop: "1px solid rgba(212,169,74,0.08)",
        }}>
          <div>
            <span style={{
              fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
              fontSize: "20px", fontWeight: 700, color: "#d4a94a",
            }}>₹{price.toLocaleString("en-IN")}</span>
          </div>
          <AddToCartButton productId={product.id} variant="minimal" />
        </div>
      </div>
    </div>
  );
}
