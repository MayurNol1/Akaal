"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { CartWithItems } from "@/modules/cart/types";

interface CartItemsProps {
  cart: CartWithItems;
}

export function CartItems({ cart }: CartItemsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    startTransition(async () => {
      await fetch("/api/cart/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      router.refresh();
    });
  };

  const handleRemove = (productId: string) => {
    startTransition(async () => {
      await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      router.refresh();
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {cart.items.map((item) => {
        const priceNumber = Number(item.product.price);
        const lineTotal = priceNumber * item.quantity;
        const imgSrc = item.product.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBfdsGV6aNSxqvazDqkT7tcstkj-L8oBUe0ArkfkL_J5tK7luTCM_4wySIyuD9UHwMC-s0nSNtfVbkjLMGeJh6orSysXUnN2IupfunTPLUsRWpn_oUQ-XiMJf0vlu1kUeJWz8zam4yxxQeRmen33focXfDToKydsGGagolfpwG23ZawDPMFO_fja2VkIzAfVDlq9ZAE0641Ymy3cSzBwbI6R-FbGRunWxNcH6Gz2qtWECZcSBDN5nZj2d55dksrBVFO3-B05fvwoV4";

        return (
          <div key={item.id} style={{
            display: "flex", alignItems: "center", gap: "16px",
            padding: "16px",
            background: "#161612",
            border: "1px solid rgba(212,169,74,0.08)",
            borderRadius: "12px",
            marginBottom: "10px",
            opacity: isPending ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}>
            {/* Image */}
            <Link href={`/products/${item.productId}`} style={{
              width: "80px", height: "80px", borderRadius: "10px",
              overflow: "hidden", flexShrink: 0, display: "block",
              background: "#1c1c18", position: "relative",
              border: "1px solid rgba(212,169,74,0.08)",
            }}>
              <Image
                src={imgSrc}
                alt={item.product.name}
                fill
                style={{ objectFit: "cover" }}
                unoptimized={imgSrc.startsWith("/uploads/")}
              />
            </Link>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Link href={`/products/${item.productId}`} style={{ textDecoration: "none" }}>
                <p style={{
                  fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
                  fontSize: "16px", fontWeight: 600, color: "#f0ede6",
                  margin: "0 0 4px", lineHeight: 1.3,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{item.product.name}</p>
              </Link>
              <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", margin: "0 0 10px", fontFamily: "monospace" }}>
                SKU: AKL-{item.productId.slice(-6).toUpperCase()}
              </p>
              {/* Quantity controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                <button
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                  disabled={isPending || item.quantity <= 1}
                  style={{
                    width: "30px", height: "30px",
                    background: "rgba(212,169,74,0.06)", border: "1px solid rgba(212,169,74,0.12)",
                    borderRadius: "6px 0 0 6px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(200,195,178,0.65)", fontSize: "16px",
                    opacity: item.quantity <= 1 ? 0.4 : 1,
                  }}
                >−</button>
                <span style={{
                  minWidth: "40px", height: "30px",
                  background: "rgba(212,169,74,0.04)", border: "1px solid rgba(212,169,74,0.12)",
                  borderLeft: "none", borderRight: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 700, color: "#f0ede6",
                }}>{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                  disabled={isPending}
                  style={{
                    width: "30px", height: "30px",
                    background: "rgba(212,169,74,0.06)", border: "1px solid rgba(212,169,74,0.12)",
                    borderRadius: "0 6px 6px 0", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(200,195,178,0.65)", fontSize: "16px",
                  }}
                >+</button>
              </div>
            </div>

            {/* Price + remove */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", flexShrink: 0 }}>
              <span style={{
                fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
                fontSize: "20px", fontWeight: 700, color: "#d4a94a",
              }}>₹{lineTotal.toLocaleString("en-IN")}</span>
              <span style={{ fontSize: "11px", color: "rgba(160,155,135,0.35)" }}>
                ₹{priceNumber.toLocaleString("en-IN")} each
              </span>
              <button
                onClick={() => handleRemove(item.productId)}
                disabled={isPending}
                style={{
                  width: "30px", height: "30px", borderRadius: "7px",
                  background: "transparent", border: "1px solid rgba(248,113,113,0.12)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(248,113,113,0.4)", transition: "all 0.18s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.4)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                title="Remove"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>delete</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
