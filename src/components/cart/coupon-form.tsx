"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CouponFormProps {
  appliedCode: string | null;
  discount: number;
}

export function CouponForm({ appliedCode, discount }: CouponFormProps) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const apply = async () => {
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Could not apply coupon");
        return;
      }
      setCode("");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await fetch("/api/cart/coupon", { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  if (appliedCode) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(37,226,244,0.05)", border: "1px solid rgba(37,226,244,0.2)", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#25e2f4" }}>sell</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#25e2f4" }}>{appliedCode}</span>
            <span style={{ fontSize: "11px", color: "rgba(200,195,178,0.65)" }}>−₹{discount.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={remove}
            disabled={busy}
            aria-label="Remove coupon"
            style={{ background: "transparent", border: "none", color: "rgba(160,155,135,0.6)", cursor: "pointer", fontSize: "11px", fontWeight: 600, padding: "2px 4px" }}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") apply(); }}
          placeholder="Coupon code"
          aria-label="Coupon code"
          style={{
            flex: 1, padding: "10px 12px",
            background: "rgba(212,169,74,0.03)",
            border: `1px solid ${error ? "rgba(248,113,113,0.4)" : "rgba(212,169,74,0.1)"}`,
            borderRadius: "8px", color: "#f0ede6",
            fontSize: "12px", outline: "none",
            fontFamily: "var(--font-sans)",
          }}
        />
        <button
          onClick={apply}
          disabled={busy}
          style={{
            padding: "10px 14px",
            background: "transparent", color: "#d4a94a",
            border: "1px solid rgba(212,169,74,0.22)",
            borderRadius: "8px", cursor: busy ? "wait" : "pointer", fontSize: "12px", fontWeight: 700,
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? "..." : "Apply"}
        </button>
      </div>
      {error && (
        <p role="alert" style={{ fontSize: "11px", color: "#f87171", margin: "6px 0 0" }}>{error}</p>
      )}
    </div>
  );
}
