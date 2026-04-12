import Link from 'next/link';
import Image from "next/image";
import { ProductService } from "@/modules/products/service";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import prisma from "@/lib/prisma";
import { Category } from "@prisma/client";
import { NewsletterForm } from "@/components/home/newsletter-form";

export const dynamic = "force-dynamic";

type FeaturedProduct = {
  id: string;
  name: string;
  price: number | { toString: () => string };
  description: string | null;
  imageUrl: string | null;
};

export default async function HomePage() {
  const featuredProducts = await ProductService.getProducts({ isActive: true, limit: 6 });
  const categories = await prisma.category.findMany({ take: 6, orderBy: { name: "asc" } });

  return (
    <div style={{ background: "#0a0908", color: "#f0ede6", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ══════════════════════════════════════════════════════
          HERO — Cinematic full-height with layered logo
      ══════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>

        {/* ── BACKGROUND: full mandala image as atmospheric backdrop ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "#0a0908",
        }} />


        {/* ── DEEP SPACE GRADIENTS ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: `
            radial-gradient(ellipse 60% 80% at 15% 50%, rgba(212,169,74,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 40% 60% at 80% 20%, rgba(120,60,180,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(20,10,50,0.5) 0%, transparent 55%)
          `,
          pointerEvents: "none",
        }} />

        {/* ── GRAIN TEXTURE ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, opacity: 0.028,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
          pointerEvents: "none",
        }} />

        {/* ── MAIN CONTENT: LEFT COLUMN ── */}
        <div style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: "1320px",
          margin: "0 auto",
          padding: "100px clamp(20px,5vw,80px) 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
          minHeight: "100vh",
        }}>

          {/* LEFT — Text + CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>



            {/* Headline */}
            <div>
              <h1 style={{
                fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
                fontSize: "clamp(52px, 7.5vw, 96px)",
                fontWeight: 300, lineHeight: 1.0,
                letterSpacing: "-0.025em",
                color: "#f0ede6", margin: 0,
              }}>
                The{" "}
                <em style={{ fontStyle: "italic", color: "#d4a94a", fontWeight: 400 }}>Eternal</em>
                <br />
                <strong style={{ fontWeight: 700 }}>Sanctuary</strong>
              </h1>
            </div>

            {/* Body */}
            <p style={{
              fontSize: "16px", fontWeight: 300, lineHeight: 1.8,
              color: "rgba(200,195,178,0.6)", maxWidth: "440px", margin: 0,
            }}>
              Handcrafted spiritual artifacts, ethically sourced from the Himalayas — each piece energised with Prana Pratishtha before reaching your home.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/products" className="transition-all duration-200 hover:bg-gold-light hover:shadow-[0_8px_32px_rgba(212,169,74,0.35)] hover:-translate-y-[2px]" style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                background: "#d4a94a", color: "#0a0908",
                textDecoration: "none",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "15px 32px", borderRadius: "8px",
                transition: "all 0.2s",
                boxShadow: "0 0 0 0 rgba(212,169,74,0.4)",
              }}>
                Shop Collections
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
              </Link>
              <Link href="/about" className="transition-all duration-200 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(212,169,74,0.2)]" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(255,255,255,0.04)", color: "#f0ede6",
                border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none",
                fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "15px 28px", borderRadius: "8px",
                transition: "all 0.2s",
              }}>
                Our Philosophy
              </Link>
            </div>


          </div>

          {/* RIGHT — The logo visual centrepiece */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", height: "min(600px, 70vw)",
          }}>

            {/* Outer ambient glow */}
            <div style={{
              position: "absolute", width: "110%", height: "110%",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,169,74,0.06) 0%, rgba(120,60,180,0.03) 50%, transparent 70%)",
              animation: "ambientPulse 6s ease-in-out infinite",
              pointerEvents: "none",
            }} />

            {/* Spinning ring 1 — large dotted */}
            <div style={{
              position: "absolute",
              width: "92%", height: "92%",
              borderRadius: "50%",
              border: "1px solid rgba(212,169,74,0.08)",
              pointerEvents: "none",
            }}>
              {/* Ring tick marks */}
              {[0,45,90,135,180,225,270,315].map(deg => (
                <div key={deg} style={{
                  position: "absolute",
                  top: "50%", left: "50%",
                  width: "6px", height: "6px",
                  marginTop: "-3px", marginLeft: "-3px",
                  transform: `rotate(${deg}deg) translateX(calc(50vw * 0.46 + 0px))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(212,169,74,0.3)" }} />
                </div>
              ))}
            </div>

            {/* Spinning ring 2 — counter-rotate */}
            <div style={{
              position: "absolute",
              width: "75%", height: "75%",
              borderRadius: "50%",
              border: "1px dashed rgba(212,169,74,0.1)",
              pointerEvents: "none",
            }} />

            {/* Inner glow ring */}
            <div style={{
              position: "absolute",
              width: "60%", height: "60%",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,169,74,0.1) 0%, rgba(212,169,74,0.04) 50%, transparent 70%)",
              animation: "ambientPulse 4s ease-in-out infinite reverse",
              pointerEvents: "none",
            }} />

            {/* THE LOGO — bg-removed with multi-layer glow */}
            <div style={{
              position: "relative", zIndex: 5,
              width: "min(380px, 60vw)",
              height: "min(472px, 74vw)",
              animation: "logoFloat 7s ease-in-out infinite",
            }}>
              {/* Glow layers behind logo */}
              <div style={{
                position: "absolute",
                inset: "-20%",
                background: "radial-gradient(circle at 50% 48%, rgba(212,169,74,0.18) 0%, rgba(180,120,40,0.08) 40%, transparent 70%)",
                borderRadius: "50%",
                filter: "blur(24px)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute",
                inset: "-5%",
                background: "radial-gradient(circle at 50% 50%, rgba(212,169,74,0.08) 0%, transparent 65%)",
                borderRadius: "50%",
                pointerEvents: "none",
              }} />

              <Image
                src="/images/bg-removed-logo.png"
                alt="Akaal — The Eternal Trishul"
                fill
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 40px rgba(212,169,74,0.35)) drop-shadow(0 0 80px rgba(212,169,74,0.12)) drop-shadow(0 20px 60px rgba(0,0,0,0.6))",
                }}
                priority
              />
            </div>


          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)",
          zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.45,
        }}>
          <span style={{ fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(160,155,135,0.55)" }}>Scroll</span>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, #d4a94a, transparent)", animation: "scroll-drop 2s ease-in-out infinite" }} />
        </div>

        {/* Hero keyframes */}
        <style>{`

          @keyframes logoFloat {
            0%, 100% { transform: translateY(0px) rotate(-1deg); }
            50%       { transform: translateY(-18px) rotate(1deg); }
          }

          @keyframes ambientPulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50%       { opacity: 1;   transform: scale(1.08); }
          }
          @media (max-width: 768px) {
            .hero-right { display: none !important; }
            .hero-grid  { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>



      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding: "clamp(60px,8vw,120px) clamp(16px,4vw,48px)", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "clamp(40px,5vw,72px)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "12px", display: "block" }}>Curated for You</span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, lineHeight: 1.12, color: "#f0ede6", margin: 0 }}>
                Sacred <em style={{ fontStyle: "italic", color: "#d4a94a" }}>Collections</em>
              </h2>
            </div>
            <Link href="/products" style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d4a94a", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
              View All <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
            </Link>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {featuredProducts.slice(0, 6).map((product: FeaturedProduct) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBfdsGV6aNSxqvazDqkT7tcstkj-L8oBUe0ArkfkL_J5tK7luTCM_4wySIyuD9UHwMC-s0nSNtfVbkjLMGeJh6orSysXUnN2IupfunTPLUsRWpn_oUQ-XiMJf0vlu1kUeJWz8zam4yxxQeRmen33focXfDToKydsGGagolfpwG23ZawDPMFO_fja2VkIzAfVDlq9ZAE0641Ymy3cSzBwbI6R-FbGRunWxNcH6Gz2qtWECZcSBDN5nZj2d55dksrBVFO3-B05fvwoV4"}
              title={product.name}
              price={`₹${parseFloat(product.price.toString()).toFixed(0)}`}
              desc={product.description || "Authentic sacred item from the Himalayas."}
            />
          ))}
        </div>
      </section>

      {/* ── BRAND STORY SPLIT — bg-removed symbol with text ── */}
      <section style={{ padding: "clamp(60px,8vw,120px) clamp(16px,4vw,48px)", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px,6vw,80px)", alignItems: "center",
          background: "linear-gradient(135deg, #111009 0%, #140f1a 100%)",
          border: "1px solid rgba(212,169,74,0.08)",
          borderRadius: "24px",
          padding: "clamp(32px,5vw,72px)",
          overflow: "hidden", position: "relative",
        }}>
          {/* BG accent */}
          <div style={{ position: "absolute", top: 0, right: 0, width: "60%", height: "100%", background: "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(120,60,180,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,169,74,0.05), transparent 70%)", pointerEvents: "none" }} />

          {/* Symbol */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
            <div style={{ width: "min(320px,85%)", position: "relative" }}>
              {/* Concentric glow rings */}
              <div style={{ position: "absolute", inset: "-15%", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,169,74,0.1) 0%, transparent 65%)", animation: "ambientPulse 5s ease-in-out infinite" }} />
              <div style={{ position: "absolute", inset: "5%", borderRadius: "50%", border: "1px solid rgba(212,169,74,0.06)", animation: "ringRotate1 25s linear infinite" }} />
              <Image
                src="/images/bg-removed-logo.png"
                alt="Akaal Sacred Symbol"
                width={320}
                height={397}
                style={{
                  objectFit: "contain", width: "100%", height: "auto",
                  filter: "drop-shadow(0 4px 24px rgba(212,169,74,0.22)) drop-shadow(0 0 60px rgba(212,169,74,0.08))",
                  position: "relative", zIndex: 2,
                }}
              />
            </div>
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "#d4a94a" }}>Our Sacred Symbol</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,3vw,44px)", fontWeight: 400, color: "#f0ede6", margin: 0, lineHeight: 1.15 }}>
              The <em style={{ color: "#d4a94a" }}>Trishul</em> of<br />Eternity
            </h2>
            <div style={{ width: "40px", height: "2px", background: "linear-gradient(90deg, #d4a94a, transparent)", borderRadius: "99px" }} />
            <p style={{ fontSize: "15px", lineHeight: 1.8, color: "rgba(200,195,178,0.6)", margin: 0 }}>
              Our emblem unites the Trishul of Shiva, the crescent moon of cosmic time, the Om of universal consciousness, and the Damaru of creation.
            </p>
            <p style={{ fontSize: "15px", lineHeight: 1.8, color: "rgba(200,195,178,0.6)", margin: 0 }}>
              Every artifact we curate carries this intention — bridging ancient wisdom with modern devotion.
            </p>
            <Link href="/about" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#d4a94a", textDecoration: "none",
              borderBottom: "1px solid rgba(212,169,74,0.3)",
              paddingBottom: "4px", width: "fit-content",
              transition: "all 0.2s",
            }}>
              Read Our Story <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
            </Link>
          </div>

          {/* Mobile responsive */}
          <style>{`@media (max-width: 768px) { .brand-split { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section style={{ padding: "clamp(60px,8vw,120px) clamp(16px,4vw,48px)", maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "clamp(32px,5vw,56px)" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "12px", display: "block" }}>Browse By</span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, lineHeight: 1.12, color: "#f0ede6", margin: 0 }}>
              Our <em style={{ fontStyle: "italic", color: "#d4a94a" }}>Categories</em>
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat: Category) => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} className="transition-all duration-200 hover:border-[rgba(212,169,74,0.3)] hover:text-[#d4a94a] hover:bg-[rgba(212,169,74,0.08)]" style={{
                padding: "10px 22px", borderRadius: "99px",
                fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em",
                textTransform: "uppercase", textDecoration: "none",
                border: "1px solid rgba(212,169,74,0.12)",
                color: "rgba(200,195,178,0.6)",
                background: "rgba(212,169,74,0.03)",
                transition: "all 0.2s",
              }}>
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ── */}
      <section style={{ padding: "clamp(60px,8vw,120px) clamp(16px,4vw,48px)", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, #111009 0%, #13101a 100%)",
          border: "1px solid rgba(212,169,74,0.08)",
          borderRadius: "28px",
          padding: "clamp(40px,6vw,80px) clamp(24px,5vw,72px)",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          {/* BG effects */}
          <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,169,74,0.06), transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-40px", right: "-40px", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(120,60,180,0.04), transparent 70%)", pointerEvents: "none" }} />

          {/* Decorative symbol */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
            <div style={{ position: "relative", width: "60px", height: "74px", opacity: 0.3 }}>
              <Image src="/images/bg-removed-logo.png" alt="" fill style={{ objectFit: "contain", filter: "drop-shadow(0 0 12px rgba(212,169,74,0.4))" }} />
            </div>
          </div>

          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "12px", display: "block" }}>Stay Connected</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,46px)", fontWeight: 400, color: "#f0ede6", marginBottom: "16px" }}>
            Join the <em style={{ fontStyle: "italic", color: "#d4a94a" }}>Eternal Path</em>
          </h2>
          <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "rgba(200,195,178,0.55)", maxWidth: "480px", margin: "0 auto" }}>
            Subscribe to receive spiritual insights, exclusive mantras, and early access to our rarest collections.
          </p>
          <div style={{ maxWidth: "480px", margin: "32px auto 0" }}>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(212,169,74,0.07)", padding: "clamp(48px,6vw,88px) clamp(16px,4vw,48px) clamp(24px,3vw,40px)", background: "#0a0908" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "clamp(24px,4vw,60px)", marginBottom: "clamp(32px,4vw,60px)" }}>
            {/* Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                <div style={{ width: "36px", height: "36px", position: "relative", flexShrink: 0 }}>
                  <Image src="/images/bg-removed-logo.png" alt="Akaal" fill style={{ objectFit: "contain" }} />
                </div>
                <div>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 700, letterSpacing: "0.14em", color: "#f0ede6", display: "block" }}>AKAAL</span>
                  <span style={{ fontSize: "7px", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(212,169,74,0.5)" }}>Eternal Sanctuary</span>
                </div>
              </Link>
              <p style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.7, color: "rgba(160,155,135,0.4)", maxWidth: "260px" }}>
                Dedicated to bringing sacred ancient wisdom into the modern home through ethically sourced spiritual artifacts.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["language", "mail", "share"].map(icon => (
                  <a key={icon} href="#" style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "rgba(200,195,178,0.5)", transition: "all 0.2s" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>{icon}</span>
                  </a>
                ))}
              </div>
            </div>
            <FooterColumn title="Shop" links={categories.map((c: Category) => ({ label: c.name, href: `/products?category=${c.id}` }))} />
            <FooterColumn title="Explore" links={[
              { label: "Our Story", href: "/about" },
              { label: "Wishlist", href: "/wishlist" },
              { label: "Dashboard", href: "/dashboard" },
            ]} />
            <FooterColumn title="Support" links={[
              { label: "My Orders", href: "/orders" },
              { label: "Settings", href: "/settings" },
              { label: "Contact Us", href: "mailto:support@akaal.com" },
            ]} />
          </div>
          <div style={{ paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.35)" }}>© 2026 Akaal Spiritual Arts. All rights reserved.</p>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Privacy Policy", "Terms of Service", "Support"].map(item => (
                <a key={item} href="#" style={{ fontSize: "11px", color: "rgba(160,155,135,0.35)", textDecoration: "none", transition: "color 0.2s" }}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ id, image, title, price, desc }: { id: string; image: string; title: string; price: string; desc: string }) {
  return (
    <div className="transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.5)] hover:border-[rgba(212,169,74,0.22)]" style={{
      background: "#111009",
      border: "1px solid rgba(212,169,74,0.09)",
      borderRadius: "14px",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
      cursor: "pointer", position: "relative",
    }}>
      <Link href={`/products/${id}`} style={{ aspectRatio: "1", position: "relative", overflow: "hidden", background: "#1a1814", display: "block" }}>
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500" sizes="(max-width:768px) 100vw, 33vw" />
      </Link>
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>

        <Link href={`/products/${id}`} style={{ textDecoration: "none" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", fontWeight: 600, lineHeight: 1.25, color: "#f0ede6", margin: 0 }}>{title}</h3>
        </Link>
        <p style={{ fontSize: "12.5px", fontWeight: 300, lineHeight: 1.65, color: "rgba(200,195,178,0.55)", margin: 0 }}>
          {desc.slice(0, 75)}{desc.length > 75 ? "…" : ""}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "14px", borderTop: "1px solid rgba(212,169,74,0.07)" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "21px", fontWeight: 600, color: "#d4a94a" }}>{price}</span>
          <AddToCartButton productId={id} />
        </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <h5 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,230,0.8)", margin: 0 }}>{title}</h5>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", padding: 0, margin: 0 }}>
        {links.map(link => (
          <li key={link.label}>
            <Link href={link.href} style={{ fontSize: "13px", fontWeight: 300, color: "rgba(160,155,135,0.4)", textDecoration: "none", transition: "color 0.2s" }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
