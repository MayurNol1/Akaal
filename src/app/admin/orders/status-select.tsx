"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  OrderStatus,
  OrderStatusLabels,
  type OrderStatusType,
} from "@/constants/order-status";

interface OrderStatusSelectProps {
  orderId: string;
  status: OrderStatusType;
}

export function OrderStatusSelect({ orderId, status }: OrderStatusSelectProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as OrderStatusType;
    if (next === status) return;

    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("orderId", orderId);
      formData.set("status", next);

      const res = await fetch("/api/admin/orders", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Update failed");
      }
      router.refresh();
    } catch (err) {
      console.error("Order status update failed:", err);
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <select
        defaultValue={status}
        onChange={handleChange}
        disabled={saving}
        aria-label="Update order status"
        style={{
          background: "rgba(212,169,74,0.05)",
          border: "1px solid rgba(212,169,74,0.18)",
          borderRadius: "8px",
          padding: "6px 10px",
          fontSize: "11px",
          fontWeight: 600,
          color: "#f0ede6",
          cursor: saving ? "wait" : "pointer",
          opacity: saving ? 0.6 : 1,
          outline: "none",
        }}
      >
        {Object.values(OrderStatus).map((value) => (
          <option key={value} value={value} style={{ background: "#161612" }}>
            {OrderStatusLabels[value]}
          </option>
        ))}
      </select>
      {error && (
        <span style={{ fontSize: "10px", color: "#f87171" }}>{error}</span>
      )}
    </div>
  );
}
