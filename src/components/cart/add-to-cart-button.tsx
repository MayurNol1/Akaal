"use client";

import { useState, useTransition } from "react";

interface AddToCartButtonProps {
  productId: string;
  variant?: "primary" | "minimal";
}

export function AddToCartButton({ productId, variant = "primary" }: AddToCartButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: 1 }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.error ?? "Failed to add to cart.");
          return;
        }
        setShowToast(true);
        window.dispatchEvent(new CustomEvent("cart-updated"));
        setTimeout(() => setShowToast(false), 2800);
      } catch {
        setError("Something went wrong.");
      }
    });
  };

  const toast = showToast ? (
    <div style={{
      position: "fixed", top: "84px", right: "20px", zIndex: 9999,
      background: "rgba(16,16,14,0.97)",
      border: "1px solid rgba(212,169,74,0.28)",
      borderRadius: "12px",
      padding: "14px 18px",
      display: "flex", alignItems: "center", gap: "12px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
      backdropFilter: "blur(16px)",
      animation: "fadeIn 0.25s ease-out",
    }}>
      <div style={{
        width: "32px", height: "32px", borderRadius: "8px",
        background: "rgba(212,169,74,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "#d4a94a" }}>check_circle</span>
      </div>
      <div>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#d4a94a", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 2px" }}>Added to Cart</p>
        <p style={{ fontSize: "12px", color: "rgba(200,195,178,0.75)", margin: 0 }}>Your item has been added.</p>
      </div>
    </div>
  ) : null;

  if (variant === "minimal") {
    return (
      <>
        {toast}
        <button
          onClick={handleClick}
          disabled={isPending}
          title="Add to cart"
          style={{
            width: "34px", height: "34px", borderRadius: "8px",
            background: "rgba(212,169,74,0.08)",
            border: "1px solid rgba(212,169,74,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: isPending ? "not-allowed" : "pointer",
            opacity: isPending ? 0.6 : 1,
            transition: "all 0.18s", flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!isPending) {
              (e.currentTarget as HTMLElement).style.background = "rgba(212,169,74,0.18)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,169,74,0.4)";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(212,169,74,0.08)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,169,74,0.18)";
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#d4a94a" }}>add_shopping_cart</span>
        </button>
      </>
    );
  }

  // Primary variant
  return (
    <>
      {toast}
      <button
        onClick={handleClick}
        disabled={isPending}
        style={{
          width: "100%",
          background: isPending ? "rgba(212,169,74,0.7)" : "#d4a94a",
          color: "#10100e",
          padding: "13px 24px",
          borderRadius: "10px",
          fontSize: "12px", fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase" as const,
          border: "none", cursor: isPending ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          transition: "background 0.2s, box-shadow 0.2s, transform 0.15s",
          boxShadow: isPending ? "none" : "0 4px 16px rgba(212,169,74,0.18)",
        }}
        onMouseEnter={e => { if (!isPending) { (e.currentTarget as HTMLElement).style.background = "#e8c06c"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(212,169,74,0.3)"; } }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isPending ? "rgba(212,169,74,0.7)" : "#d4a94a"; (e.currentTarget as HTMLElement).style.boxShadow = isPending ? "none" : "0 4px 16px rgba(212,169,74,0.18)"; }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>shopping_bag</span>
        {isPending ? "Adding…" : "Add to Cart"}
      </button>
      {error && <p style={{ fontSize: "11px", color: "#f87171", marginTop: "6px", textAlign: "center" }}>{error}</p>}
    </>
  );
}
