import Link from "next/link";
import { Prisma, Product } from "@prisma/client";
import prisma from "@/lib/prisma";
import { serializeData } from "@/lib/serialization";
import { ReviewService } from "@/modules/reviews/service";
import { SortSelect } from "./sort-select";
import { Pagination } from "./pagination";
import { ProductFilters } from "./filters";
import { ShopLayout } from "./shop-layout";
import { ProductCardStitch } from "@/components/products/product-card";

export const dynamic = "force-dynamic";

export default async function ProductListingPage(props: {
  searchParams?: Promise<{ query?: string; category?: string; sort?: string; page?: string; price?: string; rating?: string; new?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const categoryId = searchParams?.category || "";
  const sort = searchParams?.sort || "relevance";
  // Price bucket like "0-500" or "10000-" (open-ended)
  const priceRange = /^\d+-\d*$/.test(searchParams?.price ?? "") ? searchParams!.price! : "";
  const [minPriceStr, maxPriceStr] = priceRange.split("-");
  const minPrice = Number(minPriceStr) || 0;
  const maxPrice = maxPriceStr ? Number(maxPriceStr) : null;
  const ratingFilter = searchParams?.rating === "4";
  const newOnly = searchParams?.new === "1";
  const page = Number(searchParams?.page) || 1;
  const limit = 9;
  const skip = (page - 1) * limit;

  let orderBy: Prisma.ProductOrderByWithRelationInput | undefined = undefined;
  if (sort === "price_asc") orderBy = { price: "asc" };
  else if (sort === "price_desc") orderBy = { price: "desc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };

  // "4★ & up" — products whose average review rating is at least 4
  let ratedIds: string[] | null = null;
  if (ratingFilter) {
    const rated = await prisma.review.groupBy({
      by: ["productId"],
      _avg: { rating: true },
      having: { rating: { _avg: { gte: 4 } } },
    });
    ratedIds = rated.map((r) => r.productId);
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(query ? { name: { contains: query, mode: "insensitive" } } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(priceRange ? { price: { gte: minPrice, ...(maxPrice ? { lte: maxPrice } : {}) } } : {}),
    ...(ratedIds !== null ? { id: { in: ratedIds } } : {}),
    ...(newOnly ? { createdAt: { gte: thirtyDaysAgo } } : {}),
  };

  // Same URL minus the search query — used by the "clear search" chip
  const clearParams = new URLSearchParams();
  if (categoryId) clearParams.set("category", categoryId);
  if (sort !== "relevance") clearParams.set("sort", sort);
  if (priceRange) clearParams.set("price", priceRange);
  if (ratingFilter) clearParams.set("rating", "4");
  if (newOnly) clearParams.set("new", "1");
  const clearQueryHref = clearParams.size ? `?${clearParams}` : "";

  // In-stock items always list before out-of-stock ones. Prisma can't order
  // by a boolean expression, so the page slice is stitched from two queries
  // over a virtual [in-stock…, out-of-stock…] sequence.
  const whereIn: Prisma.ProductWhereInput = { ...where, stock: { gt: 0 } };
  const whereOut: Prisma.ProductWhereInput = { ...where, stock: 0 };
  const [totalIn, totalOut] = await Promise.all([
    prisma.product.count({ where: whereIn }),
    prisma.product.count({ where: whereOut }),
  ]);
  const totalProducts = totalIn + totalOut;
  const totalPages = Math.ceil(totalProducts / limit);

  const takeIn = Math.max(0, Math.min(limit, totalIn - skip));
  const skipOut = Math.max(0, skip - totalIn);
  const takeOut = limit - takeIn;

  const [inStockProducts, outOfStockProducts] = await Promise.all([
    takeIn > 0
      ? prisma.product.findMany({ where: whereIn, orderBy, skip: Math.min(skip, totalIn), take: takeIn })
      : Promise.resolve([]),
    takeOut > 0
      ? prisma.product.findMany({ where: whereOut, orderBy, skip: skipOut, take: takeOut })
      : Promise.resolve([]),
  ]);

  // serializeData strips Prisma Decimal before products cross into the
  // client component <ProductCardStitch>
  const products = serializeData([...inStockProducts, ...outOfStockProducts]);

  const ratings = await ReviewService.getAggregates(products.map((p: { id: string }) => p.id));

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
        padding: "120px clamp(16px,4vw,60px) 56px",
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
        padding: "18px clamp(16px,4vw,60px)",
        borderBottom: "1px solid rgba(212,169,74,0.1)",
        gap: "16px", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)" }}>Sort by:</span>
            <SortSelect currentSort={sort} />
          </div>
          {query && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 8px 6px 14px", borderRadius: "99px", fontSize: "12px", background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.22)", color: "#d4a94a" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>search</span>
              Results for &ldquo;{query}&rdquo;
              <Link
                href={`/products${clearQueryHref}`}
                aria-label={`Clear search for ${query}`}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(212,169,74,0.15)", color: "#d4a94a", textDecoration: "none", fontSize: "12px", lineHeight: 1 }}
              >✕</Link>
            </span>
          )}
        </div>
        <p style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)" }}>
          {query ? `${totalProducts} match${totalProducts !== 1 ? "es" : ""} found` : `Showing ${products.length} of ${totalProducts} items`}
        </p>
      </div>

      {/* ── SHOP LAYOUT ── */}
      <ShopLayout
        sidebar={
          <ProductFilters
            categories={categoriesDb.map((c) => ({ id: c.id, name: c.name, count: c._count.products }))}
            currentCategory={categoryId}
            currentPrice={priceRange}
            currentRating={ratingFilter}
            currentNew={newOnly}
          />
        }
      >
        {/* Product Grid */}
        <div style={{ padding: "28px clamp(16px,3vw,40px) 60px" }}>
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
            <div className="grid-products">
              {products.map((product: Product) => (
                <ProductCardStitch key={product.id} product={product} rating={ratings[product.id]} />
              ))}
            </div>
          )}
          <div style={{ marginTop: "36px" }}>
            <Pagination totalPages={totalPages} currentPage={page} />
          </div>
        </div>
      </ShopLayout>

      {/* Shared <Footer /> is rendered by the root layout */}
    </div>
  );
}
