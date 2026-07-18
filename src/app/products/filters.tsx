"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductFiltersProps {
  categories: { id: string; name: string; count: number }[];
  currentCategory: string;
  /** Price bucket like "0-500", "10000-" or "" for any. */
  currentPrice: string;
  currentRating: boolean;
  currentNew: boolean;
}

export const PRICE_RANGES = [
  { value: "0-500", label: "Under ₹500" },
  { value: "500-2000", label: "₹500 – ₹2,000" },
  { value: "2000-10000", label: "₹2,000 – ₹10,000" },
  { value: "10000-", label: "Over ₹10,000" },
];

interface FilterState {
  category: string;
  price: string;
  rating: boolean;
  newOnly: boolean;
}

export function ProductFilters({ categories, currentCategory, currentPrice, currentRating, currentNew }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  // On phones the filters collapse behind a toggle so products stay above the fold
  const [mobileOpen, setMobileOpen] = useState(false);

  // Local mirror of the URL state so controls respond INSTANTLY while the
  // server result streams in (without this, clicks feel dead for a second)
  const [local, setLocal] = useState<FilterState>({
    category: currentCategory,
    price: currentPrice,
    rating: currentRating,
    newOnly: currentNew,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocal({ category: currentCategory, price: currentPrice, rating: currentRating, newOnly: currentNew });
  }, [currentCategory, currentPrice, currentRating, currentNew]);

  const apply = (next: FilterState) => {
    setLocal(next);
    const params = new URLSearchParams(searchParams?.toString());
    const set = (key: string, value: string | null) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    };
    set("category", next.category || null);
    set("price", next.price || null);
    set("rating", next.rating ? "4" : null);
    set("new", next.newOnly ? "1" : null);
    params.delete("page"); // any filter change restarts pagination
    startTransition(() => {
      router.push(`/products${params.size ? `?${params}` : ""}`);
    });
  };

  const hasActiveFilters = Boolean(local.category || local.price || local.rating || local.newOnly);
  const activeCount = [local.category, local.price, local.rating, local.newOnly].filter(Boolean).length;

  const rowStyle = (active: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: "10px",
    padding: "9px 12px", borderRadius: "9px", cursor: "pointer",
    border: `1px solid ${active ? "rgba(212,169,74,0.35)" : "transparent"}`,
    background: active ? "rgba(212,169,74,0.08)" : "transparent",
    transition: "background 0.15s, border-color 0.15s",
  });
  const checkStyle: React.CSSProperties = { width: "15px", height: "15px", accentColor: "#d4a94a", cursor: "pointer", flexShrink: 0 };
  const textStyle = (active: boolean): React.CSSProperties => ({
    fontSize: "12.5px", color: active ? "#f0ede6" : "rgba(200,195,178,0.65)", fontWeight: active ? 600 : 400, flex: 1,
  });
  const countStyle: React.CSSProperties = { fontSize: "10px", color: "rgba(160,155,135,0.4)" };
  const headStyle: React.CSSProperties = {
    fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em",
    color: "rgba(160,155,135,0.45)", margin: "0 0 10px", display: "flex", alignItems: "center", justifyContent: "space-between",
  };
  const divider = <div style={{ height: "1px", background: "rgba(212,169,74,0.1)", margin: "20px 0" }} />;

  return (
    <>
      {/* Mobile-only filter toggle */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        aria-expanded={mobileOpen}
        className="flex md:hidden"
        style={{
          width: "100%", alignItems: "center", justifyContent: "space-between",
          padding: "13px 16px", marginBottom: mobileOpen ? "20px" : 0,
          background: "rgba(212,169,74,0.05)", border: "1px solid rgba(212,169,74,0.18)",
          borderRadius: "10px", color: "#f0ede6", fontSize: "13px", fontWeight: 600, cursor: "pointer",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>tune</span>
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </span>
        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "rgba(160,155,135,0.6)" }}>
          {mobileOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      <div className={mobileOpen ? "block" : "hidden md:block"} style={{ opacity: isPending ? 0.55 : 1, transition: "opacity 0.2s" }}>

        {/* Category */}
        <div>
          <p style={headStyle}>
            Category
            {isPending && (
              <span className="material-symbols-outlined" style={{ fontSize: "13px", color: "#d4a94a", animation: "akaal-filter-spin 0.8s linear infinite" }}>progress_activity</span>
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <label style={rowStyle(!local.category)}>
              <input
                type="checkbox"
                checked={!local.category}
                onChange={() => apply({ ...local, category: "" })}
                style={checkStyle}
              />
              <span style={textStyle(!local.category)}>All Items</span>
            </label>
            {categories.map((cat) => {
              const active = local.category === cat.id;
              return (
                <label key={cat.id} style={rowStyle(active)}>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => apply({ ...local, category: active ? "" : cat.id })}
                    style={checkStyle}
                  />
                  <span style={textStyle(active)}>{cat.name}</span>
                  <span style={countStyle}>{cat.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {divider}

        {/* Price */}
        <div>
          <p style={headStyle}>Price</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {PRICE_RANGES.map((range) => {
              const active = local.price === range.value;
              return (
                <label key={range.value} style={rowStyle(active)}>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => apply({ ...local, price: active ? "" : range.value })}
                    style={checkStyle}
                  />
                  <span style={textStyle(active)}>{range.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {divider}

        {/* Refine */}
        <div>
          <p style={headStyle}>Refine</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <label style={rowStyle(local.rating)}>
              <input
                type="checkbox"
                checked={local.rating}
                onChange={() => apply({ ...local, rating: !local.rating })}
                style={checkStyle}
              />
              <span style={textStyle(local.rating)}>
                <span style={{ color: "#d4a94a" }}>★★★★</span>&nbsp;&amp; Up
              </span>
            </label>
            <label style={rowStyle(local.newOnly)}>
              <input
                type="checkbox"
                checked={local.newOnly}
                onChange={() => apply({ ...local, newOnly: !local.newOnly })}
                style={checkStyle}
              />
              <span style={textStyle(local.newOnly)}>New Arrivals <span style={countStyle}>(30 days)</span></span>
            </label>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => apply({ category: "", price: "", rating: false, newOnly: false })}
            style={{ width: "100%", marginTop: "20px", padding: "10px", background: "transparent", color: "#d4a94a", border: "1px solid rgba(212,169,74,0.22)", borderRadius: "9px", cursor: "pointer", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      <style>{`@keyframes akaal-filter-spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
