import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductService } from "@/modules/products/service";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LikeButton } from "@/components/products/like-button";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;
  let product;
  let relatedProducts: import("@prisma/client").Product[] = [];

  try {
    product = await ProductService.getProductById(id);
    relatedProducts = await ProductService.getProducts({ isActive: true, limit: 4 });
  } catch {
    return notFound();
  }

  const price = parseFloat(product.price.toString()).toFixed(0);
  const isOutOfStock = product.stock === 0;
  const isLow = product.stock > 0 && product.stock <= 10;

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "clamp(80px,8vw,110px) clamp(16px,4vw,48px) 0" }}>

        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "rgba(160,155,135,0.45)", marginBottom: "40px" }}>
          <Link href="/" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none", transition: "color 0.2s" }}>Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>chevron_right</span>
          <Link href="/products" style={{ color: "rgba(160,155,135,0.45)", textDecoration: "none" }}>Collections</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>chevron_right</span>
          <span style={{ color: "#d4a94a" }}>{product.name}</span>
        </nav>

        {/* Product Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,5vw,72px)", alignItems: "start" }}>

          {/* ── GALLERY ── */}
          <div style={{ position: "sticky", top: "96px" }}>
            <div style={{
              aspectRatio: "1 / 1", borderRadius: "18px",
              background: "#161612", border: "1px solid rgba(212,169,74,0.1)",
              overflow: "hidden", position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Gold glow */}
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(circle at 50% 70%, rgba(212,169,74,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <Image
                src={product.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDhUoQEqkA_Om7CkOE64DQkjxkQPVHY0m6kCVlGMqoa27iyAsb1tNY2oEznkAdBjGDHarZRnkOZAClq7cDZbCbsnGcugUpKtKzddOm_AkZrOGrCdyfUIfDuT7oYFN35Qxpmw9O1_noM9nCLDQgNcar9aAOw4riOnly6gAJNlGux8KA0cg-AO9O5jSOpnO2splk7K60h0xzHKGPDHrCX42ZIxNDIynPEo-6tMLFHSVw9Mk6eYcDcfRFOcpztZCVX-xzCWlD_s3sYqRE"}
                alt={product.name}
                fill
                className="object-contain"
                style={{ padding: "40px", filter: "drop-shadow(0 20px 60px rgba(212,169,74,0.1))" }}
                priority
              />
              {isOutOfStock && (
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(16,16,14,0.8)",
                  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
                }}>
                  <span style={{
                    fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                    color: "rgba(160,155,135,0.7)", border: "1px solid rgba(160,155,135,0.2)",
                    padding: "8px 18px", borderRadius: "99px",
                  }}>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  flex: 1, aspectRatio: "1 / 1",
                  borderRadius: "10px", background: "#161612",
                  border: i === 1 ? "2px solid #d4a94a" : "1px solid rgba(212,169,74,0.1)",
                  overflow: "hidden", position: "relative", cursor: "pointer",
                }}>
                  <Image
                    src={product.imageUrl || ""}
                    alt="thumbnail"
                    fill
                    style={{ objectFit: "cover", opacity: i === 1 ? 1 : 0.5 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── INFO ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Verified badge */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 13px", borderRadius: "99px",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              background: "rgba(212,169,74,0.08)", border: "1px solid rgba(212,169,74,0.18)", color: "#d4a94a",
              width: "fit-content",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>verified</span>
              Sacred Origins Verified
            </span>

            <div>
              <h1 style={{
                fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
                fontSize: "clamp(32px,4vw,48px)", fontWeight: 600,
                color: "#f0ede6", lineHeight: 1.1, margin: "0 0 16px",
              }}>
                {product.name}
              </h1>

              {/* Stars */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="material-symbols-outlined" style={{ fontSize: "14px", color: "#d4a94a", fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <span style={{ fontSize: "12px", color: "rgba(160,155,135,0.45)" }}>4.8 (124 reviews)</span>
              </div>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
                <span style={{
                  fontFamily: "var(--font-serif)", fontSize: "38px", fontWeight: 700,
                  color: "#d4a94a", letterSpacing: "-0.01em",
                }}>₹{parseInt(price).toLocaleString("en-IN")}</span>
                {isLow && (
                  <span style={{
                    fontSize: "11px", fontWeight: 700, color: "#ff9933",
                    background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.2)",
                    padding: "3px 10px", borderRadius: "99px",
                  }}>Only {product.stock} left</span>
                )}
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(212,169,74,0.1)" }} />

            <p style={{ fontSize: "14px", lineHeight: 1.75, color: "rgba(200,195,178,0.65)", margin: 0, fontStyle: "italic" }}>
              {product.description || "A divine instrument for meditation and spiritual alignment. Each piece is sourced with ancient intention and resonates with timeless devotion."}
            </p>

            {/* Feature icons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { icon: "energy_savings_leaf", label: "Pure Energy", sub: "Ritualized Sourcing" },
                { icon: "eco", label: "Sustainable", sub: "Eco-Conscious" },
                { icon: "workspace_premium", label: "Authentic", sub: "Lab Certified" },
                { icon: "local_shipping", label: "Free Shipping", sub: "Orders ₹999+" },
              ].map(f => (
                <div key={f.label} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px", borderRadius: "10px",
                  background: "#161612", border: "1px solid rgba(212,169,74,0.08)",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d4a94a" }}>{f.icon}</span>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#f0ede6", margin: "0 0 2px" }}>{f.label}</p>
                    <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)", margin: 0 }}>{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                display: "flex", alignItems: "center",
                border: "1px solid rgba(212,169,74,0.1)", borderRadius: "10px", overflow: "hidden",
              }}>
                <button style={{ width: "36px", height: "44px", background: "none", border: "none", cursor: "pointer", color: "rgba(160,155,135,0.45)", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ padding: "0 16px", fontSize: "14px", fontWeight: 600, color: "#f0ede6" }}>1</span>
                <button style={{ width: "36px", height: "44px", background: "none", border: "none", cursor: "pointer", color: "rgba(160,155,135,0.45)", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
              <div style={{ flex: 1 }}>
                <AddToCartButton productId={product.id} />
              </div>
              <LikeButton productId={product.id} />
            </div>

            <div style={{ height: "1px", background: "rgba(212,169,74,0.1)" }} />

            {/* Accordions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { title: "Spiritual Essence", content: "This artifact is governed by cosmic principles that enhance mental peace, spiritual growth, and meditative focus. Energised through Prana Pratishtha before dispatch." },
                { title: "Care & Maintenance", content: "Clean gently with a dry cloth. Avoid exposure to chemicals or water. Store in the provided silk pouch when not in use." },
                { title: "Dimensions & Materials", content: product.specifications || "Hand-crafted using traditional methods. Each unit is unique in its physical form yet identical in spiritual energy." },
                { title: "Shipping & Returns", content: "Free shipping on orders above ₹999. Express delivery available. 30-day easy returns with no questions asked." },
              ].map((item, idx) => (
                <details key={idx} style={{ borderTop: "1px solid rgba(212,169,74,0.08)" }}>
                  <summary style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 0", cursor: "pointer", listStyle: "none",
                    fontSize: "14px", fontWeight: 600, color: "#f0ede6",
                    userSelect: "none",
                  }}>
                    {item.title}
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "rgba(160,155,135,0.45)" }}>add</span>
                  </summary>
                  <div style={{ paddingBottom: "16px", fontSize: "13px", lineHeight: 1.75, color: "rgba(200,195,178,0.65)" }}>
                    {item.content}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* ── REVIEWS ── */}
        <section style={{ marginTop: "80px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
              Customer <em style={{ color: "#d4a94a" }}>Reviews</em>
            </h2>
            <button style={{
              padding: "9px 20px", background: "#d4a94a", color: "#10100e",
              border: "none", borderRadius: "8px", cursor: "pointer",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Write a Review</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {[
              { name: "Priya S.", date: "15 Mar 2026", rating: 5, text: "Absolutely divine! The energy from this piece has transformed my meditation practice. Highly recommend." },
              { name: "Rahul M.", date: "10 Mar 2026", rating: 5, text: "Beautifully crafted and authentic. Arrived well-packaged and energised. Worth every rupee." },
              { name: "Ananya K.", date: "01 Mar 2026", rating: 4, text: "Great quality and fast shipping. The piece feels genuine and sacred. Very happy with my purchase." },
            ].map((review, idx) => (
              <div key={idx} style={{
                padding: "20px", background: "#161612",
                border: "1px solid rgba(212,169,74,0.08)", borderRadius: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "rgba(212,169,74,0.12)", display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: 700, color: "#d4a94a",
                  }}>{review.name[0]}</div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#f0ede6", margin: 0 }}>{review.name}</p>
                    <p style={{ fontSize: "10px", color: "rgba(160,155,135,0.45)", margin: 0 }}>{review.date}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{ fontSize: "12px", color: "#d4a94a", fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p style={{ fontSize: "13px", color: "rgba(200,195,178,0.65)", lineHeight: 1.65, margin: 0 }}>{review.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RELATED PRODUCTS ── */}
        <section style={{ marginTop: "80px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
              You may also <em style={{ color: "#d4a94a" }}>like</em>
            </h2>
            <Link href="/products" style={{ fontSize: "12px", color: "#d4a94a", textDecoration: "none", fontWeight: 600 }}>View All</Link>
          </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {relatedProducts.slice(0, 4).map((rp) => (
                <Link key={rp.id} href={`/products/${rp.id}`} style={{ textDecoration: "none" }}>
                  <div 
                    className="hover-lift"
                    style={{
                      background: "#161612", border: "1px solid rgba(212,169,74,0.1)",
                      borderRadius: "120px 12px 12px 12px", overflow: "hidden", // Added some style to match the premium feel
                      height: "100%",
                    }}
                  >
                  <div style={{ aspectRatio: "1 / 1", position: "relative", background: "#1c1c18" }}>
                    <Image src={rp.imageUrl || ""} alt={rp.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "12px" }}>
                    <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: 600, color: "#f0ede6", margin: "0 0 4px", lineHeight: 1.2 }}>{rp.name}</h4>
                    <span style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 700, color: "#d4a94a" }}>₹{parseFloat(rp.price.toString()).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
