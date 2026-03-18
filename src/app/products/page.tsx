import Link from "next/link";
import { Prisma, Product } from "@prisma/client";
import prisma from "@/lib/prisma";
import { SortSelect } from "./sort-select";
import { Pagination } from "./pagination";
import { ProductCardStitch } from "@/components/products/product-card";

export const dynamic = "force-dynamic";

export default async function ProductListingPage(props: {
  searchParams?: Promise<{ query?: string; category?: string; sort?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const categoryId = searchParams?.category || "";
  const sort = searchParams?.sort || "relevance";
  const page = Number(searchParams?.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  let orderBy: Prisma.ProductOrderByWithRelationInput | undefined = undefined;
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };

  const totalProducts = await prisma.product.count({
    where: {
      isActive: true,
      ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
      ...(categoryId ? { categoryId } : {}),
    },
  });
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy,
    skip,
    take: limit,
  });

  const categoriesDb = await prisma.category.findMany({
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh" }}>

      {/* ── NAV is handled by shared navbar ── */}

      {/* ── HERO BAND ── */}
      <div style={{
        paddingTop: "72px",
        padding: "120px 60px 56px",
        textAlign: "center",
        borderBottom: "1px solid rgba(212,169,74,0.1)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 600px 300px at 50% 100%, rgba(212,169,74,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "14px" }}>
          Handcrafted · Ethically Sourced · Spiritually Curated
        </p>
        <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(36px,6vw,56px)", fontWeight: 600, letterSpacing: "-0.01em", color: "#f0ede6", lineHeight: 1.0, marginBottom: "14px" }}>
          Sacred <em style={{ color: "#d4a94a", fontStyle: "italic" }}>Collections</em>
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(200,195,178,0.65)", maxWidth: "480px", margin: "0 auto 28px", lineHeight: 1.6 }}>
          Each piece is chosen for its energetic quality and spiritual heritage — from Himalayan sources to your home.
        </p>
        {/* Category pills */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/products" style={{
            padding: "7px 18px", borderRadius: "99px",
            border: !categoryId ? "1px solid rgba(212,169,74,0.22)" : "1px solid rgba(212,169,74,0.1)",
            fontSize: "12px", fontWeight: 500, color: !categoryId ? "#d4a94a" : "rgba(200,195,178,0.65)",
            background: !categoryId ? "rgba(212,169,74,0.1)" : "transparent",
            cursor: "pointer", textDecoration: "none", transition: "all 0.18s",
          }}>All Items</Link>
          {categoriesDb.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.id}`} style={{
              padding: "7px 18px", borderRadius: "99px",
              border: categoryId === cat.id ? "1px solid rgba(212,169,74,0.22)" : "1px solid rgba(212,169,74,0.1)",
              fontSize: "12px", fontWeight: 500,
              color: categoryId === cat.id ? "#d4a94a" : "rgba(200,195,178,0.65)",
              background: categoryId === cat.id ? "rgba(212,169,74,0.1)" : "transparent",
              cursor: "pointer", textDecoration: "none", transition: "all 0.18s",
            }}>{cat.name}</Link>
          ))}
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 60px",
        borderBottom: "1px solid rgba(212,169,74,0.1)",
        gap: "16px", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)" }}>Sort by:</span>
          <SortSelect currentSort={sort} />
        </div>
        <p style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)" }}>
          Showing {products.length} of {totalProducts} items
        </p>
      </div>

      {/* ── SHOP LAYOUT ── */}
      <div style={{ display: "flex", gap: 0 }}>

        {/* Sidebar filters */}
        <aside style={{
          width: "240px", flexShrink: 0,
          padding: "28px 24px",
          borderRight: "1px solid rgba(212,169,74,0.1)",
          position: "sticky", top: "72px", height: "calc(100vh - 72px)", overflowY: "auto",
        }}>
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(160,155,135,0.45)", marginBottom: "12px" }}>
              Category
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ width: "14px", height: "14px", accentColor: "#d4a94a", cursor: "pointer" }} />
                <span style={{ fontSize: "12px", color: "rgba(200,195,178,0.65)" }}>All Items</span>
              </label>
              {categoriesDb.map(cat => (
                <label key={cat.id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="checkbox" style={{ width: "14px", height: "14px", accentColor: "#d4a94a", cursor: "pointer" }} />
                  <span style={{ fontSize: "12px", color: "rgba(200,195,178,0.65)" }}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ height: "1px", background: "rgba(212,169,74,0.1)", marginBottom: "24px" }} />
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(160,155,135,0.45)", marginBottom: "12px" }}>
              Price Range
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <input type="range" min={0} max={50000} defaultValue={50000} style={{ accentColor: "#d4a94a", width: "100%" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(160,155,135,0.45)" }}>
                <span>₹0</span><span>₹50,000</span>
              </div>
            </div>
          </div>
          <div style={{ height: "1px", background: "rgba(212,169,74,0.1)", marginBottom: "24px" }} />
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(160,155,135,0.45)", marginBottom: "12px" }}>
              Availability
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ width: "14px", height: "14px", accentColor: "#d4a94a" }} />
                <span style={{ fontSize: "12px", color: "rgba(200,195,178,0.65)" }}>In Stock</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" style={{ width: "14px", height: "14px", accentColor: "#d4a94a" }} />
                <span style={{ fontSize: "12px", color: "rgba(200,195,178,0.65)" }}>Low Stock</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1, padding: "28px 40px 60px" }}>
          {products.length === 0 ? (
            <div style={{
              height: "40vh", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              background: "#161612", border: "1px solid rgba(212,169,74,0.1)",
              borderRadius: "14px", gap: "16px",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "rgba(212,169,74,0.15)" }}>shopping_bag</span>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "rgba(200,195,178,0.65)", fontStyle: "italic", textAlign: "center" }}>
                No items found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {products.map((product: Product) => (
                <ProductCardStitch key={product.id} product={product} />
              ))}
            </div>
          )}
          <div style={{ marginTop: "36px" }}>
            <Pagination totalPages={totalPages} currentPage={page} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ padding: "36px 60px", borderTop: "1px solid rgba(212,169,74,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)" }}>© 2026 Akaal Spiritual Arts. All rights reserved.</p>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy Policy", "Terms of Service", "Support"].map(item => (
            <a key={item} href="#" style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>{item}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
