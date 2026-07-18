"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LikeButton } from "@/components/products/like-button";

interface QuantityAddToCartProps {
  productId: string;
  maxStock: number;
  /** Product price in INR — shown in the sticky mobile buy bar. */
  price?: number;
}

/** Working quantity stepper feeding the Add-to-Cart action. */
export function QuantityAddToCart({ productId, maxStock, price }: QuantityAddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const cap = Math.max(1, Math.min(maxStock, 10));

  if (maxStock <= 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          disabled
          style={{
            flex: 1, padding: "13px 24px", borderRadius: "10px",
            background: "rgba(160,155,135,0.08)", color: "rgba(160,155,135,0.5)",
            border: "1px solid rgba(160,155,135,0.15)", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase", cursor: "not-allowed",
          }}
        >
          Out of Stock
        </button>
        <LikeButton productId={productId} />
      </div>
    );
  }

  const stepStyle: React.CSSProperties = {
    width: "36px", height: "44px", background: "none", border: "none",
    cursor: "pointer", color: "rgba(160,155,135,0.65)", fontSize: "18px",
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          display: "flex", alignItems: "center",
          border: "1px solid rgba(212,169,74,0.1)", borderRadius: "10px", overflow: "hidden",
        }}>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            style={{ ...stepStyle, opacity: quantity <= 1 ? 0.35 : 1 }}
          >−</button>
          <span aria-live="polite" style={{ padding: "0 16px", fontSize: "14px", fontWeight: 600, color: "#f0ede6", minWidth: "20px", textAlign: "center" }}>{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(cap, q + 1))}
            disabled={quantity >= cap}
            aria-label="Increase quantity"
            style={{ ...stepStyle, opacity: quantity >= cap ? 0.35 : 1 }}
          >+</button>
        </div>
        <div style={{ flex: 1 }}>
          <AddToCartButton productId={productId} quantity={quantity} />
        </div>
        <LikeButton productId={productId} />
      </div>

      {/* Sticky buy bar — phones only, so the CTA is always one thumb-tap away.
          Display comes from the classes only: an inline display would override md:hidden. */}
      <div
        className="flex md:hidden"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 80,
          alignItems: "center", gap: "14px",
          padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
          background: "rgba(16,16,14,0.96)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(212,169,74,0.18)",
        }}
      >
        {typeof price === "number" && (
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(160,155,135,0.5)" }}>
              {quantity > 1 ? `${quantity} × ₹${Math.round(price).toLocaleString("en-IN")}` : "Total"}
            </span>
            <span style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 700, color: "#d4a94a", whiteSpace: "nowrap" }}>
              ₹{Math.round(price * quantity).toLocaleString("en-IN")}
            </span>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <AddToCartButton productId={productId} quantity={quantity} />
        </div>
      </div>
    </>
  );
}
