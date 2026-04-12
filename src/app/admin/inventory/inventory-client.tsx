"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";

type Category = {
  id: string;
  name: string;
};

export type InventoryProduct = {
  id: string;
  name: string;
  categoryName: string;
  categoryId: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  createdAt: string;
};

type InventoryFilter = "all" | "active" | "inactive" | "low" | "out";

type NewProductForm = {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

const LOW_STOCK = 10;

function toSku(id: string) {
  return `AKL-${id.slice(0, 6).toUpperCase()}`;
}

function statusOf(stock: number) {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK) return "low";
  return "in";
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function InventoryClient({
  initialProducts,
  categories,
}: {
  initialProducts: InventoryProduct[];
  categories: Category[];
}) {
  const [products, setProducts] = useState<InventoryProduct[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InventoryFilter>("all");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formState, setFormState] = useState<NewProductForm>({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    isActive: true,
  });

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q) ||
        toSku(product.id).toLowerCase().includes(q);

      if (!matchQuery) return false;
      if (filter === "all") return true;
      if (filter === "active") return product.isActive;
      if (filter === "inactive") return !product.isActive;
      if (filter === "low") return product.stock > 0 && product.stock <= LOW_STOCK;
      return product.stock <= 0;
    });
  }, [products, query, filter]);

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.isActive).length,
      low: products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).length,
      out: products.filter((p) => p.stock <= 0).length,
    }),
    [products],
  );

  async function patchProduct(id: string, body: Record<string, unknown>) {
    setSavingId(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) return;
      const raw = await response.json();
      const updated = (raw.data ?? raw) as { id: string; stock: number; isActive: boolean };
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                stock: typeof updated.stock === "number" ? updated.stock : p.stock,
                isActive: typeof updated.isActive === "boolean" ? updated.isActive : p.isActive,
              }
            : p,
        ),
      );
    } finally {
      setSavingId(null);
    }
  }

  async function createProduct() {
    const name = formState.name.trim();
    const price = Number(formState.price);
    const stock = Number(formState.stock || 0);

    if (!name || Number.isNaN(price) || price <= 0 || Number.isNaN(stock) || stock < 0) return;

    const payload = {
      name,
      categoryId: formState.categoryId || null,
      price,
      stock,
      description: formState.description.trim() || null,
      imageUrl: formState.imageUrl.trim() || null,
      isActive: formState.isActive,
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return;

    const created = (await response.json()) as {
      id: string;
      name: string;
      categoryId: string | null;
      price: number | string;
      stock: number;
      isActive: boolean;
      imageUrl: string | null;
      createdAt: string;
    };

    const categoryName = categories.find((c) => c.id === created.categoryId)?.name ?? "Uncategorized";
    setProducts((prev) => [
      {
        id: created.id,
        name: created.name,
        categoryName,
        categoryId: created.categoryId ?? null,
        price: Number(created.price),
        stock: created.stock,
        isActive: created.isActive,
        imageUrl: created.imageUrl,
        createdAt: created.createdAt,
      },
      ...prev,
    ]);

    setShowCreateModal(false);
    setFormState({
      name: "",
      categoryId: "",
      price: "",
      stock: "",
      description: "",
      imageUrl: "",
      isActive: true,
    });
  }

  return (
    <div style={{ display: "grid", gap: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(37,226,244,0.7)" }}>
            Inventory Control
          </p>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "30px", color: "#f0ede6" }}>
            Product <em style={{ color: "#25e2f4" }}>Inventory</em>
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          style={{
            border: "none",
            background: "#25e2f4",
            color: "#031416",
            borderRadius: "10px",
            padding: "10px 14px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Add Product
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
        <StatCard label="Total Products" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Low Stock" value={stats.low} />
        <StatCard label="Out of Stock" value={stats.out} />
      </div>

      <div style={{ background: "#161612", border: "1px solid rgba(37,226,244,0.14)", borderRadius: "14px", padding: "14px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, or SKU..."
            style={{
              flex: 1,
              minWidth: "240px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(37,226,244,0.2)",
              background: "rgba(37,226,244,0.04)",
              color: "#f0ede6",
              fontSize: "12px",
            }}
          />
          {(["all", "active", "inactive", "low", "out"] as InventoryFilter[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              style={{
                padding: "9px 12px",
                borderRadius: "8px",
                border: filter === key ? "1px solid rgba(37,226,244,0.35)" : "1px solid rgba(37,226,244,0.18)",
                color: filter === key ? "#25e2f4" : "rgba(160,155,135,0.7)",
                background: filter === key ? "rgba(37,226,244,0.08)" : "transparent",
                fontSize: "11px",
                textTransform: "capitalize",
                cursor: "pointer",
              }}
            >
              {key}
            </button>
          ))}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(37,226,244,0.12)" }}>
                {["Product", "SKU", "Category", "Price", "Stock", "Visibility", "Actions"].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "rgba(160,155,135,0.65)",
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const status = statusOf(product.stock);
                const statusColor = status === "in" ? "#25e2f4" : status === "low" ? "#ff9933" : "#f87171";
                const saving = savingId === product.id;

                return (
                  <tr key={product.id} style={{ borderBottom: "1px solid rgba(37,226,244,0.08)" }}>
                    <td style={{ padding: "12px 10px", minWidth: "220px" }}>
                      <p style={{ margin: 0, color: "#f0ede6", fontSize: "12px", fontWeight: 700 }}>{product.name}</p>
                      <p style={{ margin: "3px 0 0", color: "rgba(160,155,135,0.6)", fontSize: "11px" }}>
                        Created {new Date(product.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </td>
                    <td style={{ padding: "12px 10px", color: "#25e2f4", fontFamily: "monospace", fontSize: "11px" }}>{toSku(product.id)}</td>
                    <td style={{ padding: "12px 10px", color: "rgba(200,195,178,0.7)", fontSize: "11px" }}>{product.categoryName}</td>
                    <td style={{ padding: "12px 10px", color: "#f0ede6", fontSize: "12px", fontWeight: 700 }}>{formatCurrency(product.price)}</td>
                    <td style={{ padding: "12px 10px", minWidth: "160px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          type="button"
                          disabled={saving || product.stock <= 0}
                          onClick={() => patchProduct(product.id, { stock: Math.max(0, product.stock - 1) })}
                          style={stockBtnStyle}
                        >
                          -
                        </button>
                        <span style={{ minWidth: "24px", textAlign: "center", color: "#f0ede6", fontSize: "12px" }}>{product.stock}</span>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => patchProduct(product.id, { stock: product.stock + 1 })}
                          style={stockBtnStyle}
                        >
                          +
                        </button>
                        <span
                          style={{
                            border: `1px solid ${statusColor}55`,
                            color: statusColor,
                            borderRadius: "999px",
                            padding: "3px 8px",
                            fontSize: "10px",
                            fontWeight: 700,
                            marginLeft: "4px",
                          }}
                        >
                          {status === "in" ? "In Stock" : status === "low" ? "Low" : "Out"}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => patchProduct(product.id, { isActive: !product.isActive })}
                        style={{
                          border: product.isActive ? "1px solid rgba(37,226,244,0.35)" : "1px solid rgba(160,155,135,0.35)",
                          color: product.isActive ? "#25e2f4" : "rgba(160,155,135,0.75)",
                          borderRadius: "999px",
                          background: "transparent",
                          padding: "5px 10px",
                          fontSize: "10px",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        {product.isActive ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        style={{
                          border: "1px solid rgba(37,226,244,0.25)",
                          color: "#25e2f4",
                          borderRadius: "8px",
                          padding: "6px 10px",
                          textDecoration: "none",
                          fontSize: "11px",
                        }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setShowCreateModal(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setShowCreateModal(false);
          }}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.55)" }}
        >
          <section
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(700px, calc(100vw - 28px))",
              background: "#0f1718",
              border: "1px solid rgba(37,226,244,0.25)",
              borderRadius: "14px",
              margin: "5vh auto",
              padding: "16px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ margin: "0 0 12px", color: "#f0ede6", fontSize: "18px" }}>Add Product</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <Input label="Name" value={formState.name} onChange={(value) => setFormState((s) => ({ ...s, name: value }))} />
              <SelectInput
                label="Category"
                value={formState.categoryId}
                onChange={(value) => setFormState((s) => ({ ...s, categoryId: value }))}
                options={[{ value: "", label: "Uncategorized" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
              />
              <Input
                label="Price"
                type="number"
                value={formState.price}
                onChange={(value) => setFormState((s) => ({ ...s, price: value }))}
              />
              <Input
                label="Stock"
                type="number"
                value={formState.stock}
                onChange={(value) => setFormState((s) => ({ ...s, stock: value }))}
              />
              <Input
                label="Image URL"
                value={formState.imageUrl}
                onChange={(value) => setFormState((s) => ({ ...s, imageUrl: value }))}
              />
              <label style={{ display: "grid", gap: "5px", color: "rgba(160,155,135,0.7)", fontSize: "11px" }}>
                Visible in Store
                <input
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(e) => setFormState((s) => ({ ...s, isActive: e.target.checked }))}
                  style={{ width: "18px", height: "18px" }}
                />
              </label>
              <label style={{ display: "grid", gap: "5px", gridColumn: "1 / -1", color: "rgba(160,155,135,0.7)", fontSize: "11px" }}>
                Description
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    minHeight: "90px",
                    background: "rgba(37,226,244,0.04)",
                    border: "1px solid rgba(37,226,244,0.2)",
                    color: "#f0ede6",
                    fontSize: "12px",
                    padding: "10px",
                  }}
                />
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "14px" }}>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{
                  border: "1px solid rgba(160,155,135,0.3)",
                  color: "rgba(160,155,135,0.8)",
                  background: "transparent",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createProduct}
                style={{
                  border: "none",
                  color: "#031416",
                  background: "#25e2f4",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create Product
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: "#161612", border: "1px solid rgba(37,226,244,0.14)", borderRadius: "12px", padding: "12px" }}>
      <p style={{ margin: "0 0 6px", fontSize: "11px", color: "rgba(160,155,135,0.65)" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "24px", color: "#f0ede6", fontWeight: 700 }}>{value}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label style={{ display: "grid", gap: "5px", color: "rgba(160,155,135,0.7)", fontSize: "11px" }}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          borderRadius: "8px",
          background: "rgba(37,226,244,0.04)",
          border: "1px solid rgba(37,226,244,0.2)",
          color: "#f0ede6",
          fontSize: "12px",
          padding: "10px",
        }}
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label style={{ display: "grid", gap: "5px", color: "rgba(160,155,135,0.7)", fontSize: "11px" }}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          borderRadius: "8px",
          background: "rgba(37,226,244,0.04)",
          border: "1px solid rgba(37,226,244,0.2)",
          color: "#f0ede6",
          fontSize: "12px",
          padding: "10px",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const stockBtnStyle: CSSProperties = {
  width: "22px",
  height: "22px",
  borderRadius: "6px",
  border: "1px solid rgba(37,226,244,0.25)",
  background: "transparent",
  color: "#25e2f4",
  cursor: "pointer",
  fontSize: "12px",
  lineHeight: 1,
};
