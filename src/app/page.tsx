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
  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: { name: 'asc' }
  });

  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: "72px" }}>
        {/* Hero Background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 50% 10%, rgba(212,169,74,0.06) 0%, transparent 70%),
            radial-gradient(circle at 15% 80%, rgba(30,20,60,0.5) 0%, transparent 50%),
            radial-gradient(circle at 85% 20%, rgba(20,10,40,0.6) 0%, transparent 50%),
            linear-gradient(180deg, #10100e 0%, #130f18 50%, #10100e 100%)
          `,
        }} />
        {/* Grain */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }} />

        {/* Ornamental circle */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: "min(700px, 90vw)", height: "min(700px, 90vw)",
          borderRadius: "50%", border: "1px solid rgba(212,169,74,0.05)",
          zIndex: 1, animation: "circle-pulse 8s ease-in-out infinite",
        }} />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "760px", padding: "0 clamp(16px,4vw,48px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
          
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "7px 18px", borderRadius: "99px",
            border: "1px solid rgba(212,169,74,0.12)",
            background: "rgba(212,169,74,0.12)",
            fontSize: "10px", fontWeight: 600,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "#d4a94a",
          }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#d4a94a", animation: "dot-blink 2s ease-in-out infinite" }} />
            Sacred Spiritual Collections
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-serif), 'Cormorant Garamond', serif",
            fontSize: "clamp(52px, 9vw, 96px)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#f0ede6",
            margin: 0,
          }}>
            The{" "}
            <em style={{ fontStyle: "italic", color: "#d4a94a", fontWeight: 400 }}>Eternal</em>
            <br />
            <strong style={{ fontWeight: 700, fontStyle: "normal" }}>Sanctuary</strong>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: "16px", fontWeight: 300, lineHeight: 1.75, color: "rgba(200,195,178,0.65)", maxWidth: "520px", textAlign: "center", margin: 0 }}>
            Handcrafted spiritual artifacts, ethically sourced from the Himalayas — each piece energised with Prana Pratishtha before reaching your home.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center", paddingTop: "8px" }}>
            <Link href="/products" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "#d4a94a", color: "#1a1006",
              border: "none", textDecoration: "none",
              fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "15px 32px", borderRadius: "10px",
              transition: "background 0.2s, box-shadow 0.2s, transform 0.15s",
            }}>
              Shop Collections
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            </Link>
            <Link href="/about" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "transparent", color: "#f0ede6",
              border: "1px solid rgba(255,255,255,0.05)", textDecoration: "none",
              fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "15px 32px", borderRadius: "10px",
              transition: "border-color 0.2s, background 0.2s, transform 0.15s",
            }}>
              Our Philosophy
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "40px", paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            width: "100%", justifyContent: "center", flexWrap: "wrap",
          }}>
            {[
              { num: "2,500+", label: "Sacred Items" },
              { num: "45k+", label: "Devotees" },
              { num: "12+", label: "Years" },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <span style={{
                  fontFamily: "var(--font-serif)", fontSize: "30px", fontWeight: 600,
                  color: "#d4a94a", lineHeight: 1, display: "block", marginBottom: "4px",
                }}>{stat.num}</span>
                <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(160,155,135,0.45)" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.5 }}>
          <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(160,155,135,0.45)" }}>Scroll</span>
          <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(212,169,74,0.6), transparent)", animation: "scroll-drop 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div style={{ background: "#161612", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px clamp(16px,4vw,48px)", display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(24px,4vw,60px)", flexWrap: "wrap" }}>
          {[
            { icon: "verified", label: "Lab Certified Authenticity" },
            { icon: "autorenew", label: "30-Day Easy Returns" },
            { icon: "local_shipping", label: "Free Shipping ₹999+" },
            { icon: "spa", label: "Energised Before Dispatch" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "rgba(200,195,178,0.65)" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", opacity: 0.7, color: "#d4a94a" }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding: "clamp(60px,8vw,120px) clamp(16px,4vw,48px)", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "clamp(40px,5vw,72px)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "12px", display: "block" }}>
                Curated for You
              </span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, lineHeight: 1.15, color: "#f0ede6", margin: 0 }}>
                Sacred <em style={{ fontStyle: "italic", color: "#d4a94a" }}>Collections</em>
              </h2>
            </div>
            <Link href="/products" style={{
              fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#d4a94a", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
              whiteSpace: "nowrap",
            }}>
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

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section style={{ padding: "clamp(60px,8vw,120px) clamp(16px,4vw,48px)", maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "clamp(40px,5vw,72px)" }}>
            <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "12px", display: "block" }}>
              Browse By
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 400, lineHeight: 1.15, color: "#f0ede6", margin: 0 }}>
              Our <em style={{ fontStyle: "italic", color: "#d4a94a" }}>Categories</em>
            </h2>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat: Category) => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} style={{
                padding: "10px 22px", borderRadius: "99px",
                fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em",
                textTransform: "uppercase", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "rgba(200,195,178,0.65)",
                background: "transparent",
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
          background: "#161612",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "32px",
          padding: "clamp(40px,6vw,80px) clamp(24px,5vw,72px)",
          textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
            width: "300px", height: "300px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,169,74,0.08), transparent 70%)",
            pointerEvents: "none",
          }} />
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "12px", display: "block" }}>
            Stay Connected
          </span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px,4vw,44px)", fontWeight: 400, color: "#f0ede6", marginBottom: "16px" }}>
            Join the <em style={{ fontStyle: "italic", color: "#d4a94a" }}>Eternal Path</em>
          </h2>
          <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.7, color: "rgba(200,195,178,0.65)", maxWidth: "480px", margin: "0 auto" }}>
            Subscribe to receive spiritual insights, exclusive mantras, and early access to our rarest collections.
          </p>
          <div style={{ display: "flex", gap: "10px", maxWidth: "480px", margin: "32px auto 0", flexWrap: "wrap", justifyContent: "center" }}>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "clamp(48px,6vw,88px) clamp(16px,4vw,48px) clamp(24px,3vw,40px)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "clamp(24px,4vw,60px)", marginBottom: "clamp(32px,4vw,60px)" }}>
            
            {/* Brand column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                <svg width="24" height="24" viewBox="0 0 48 48" fill="#d4a94a">
                  <path d="M8.578 8.578C5.528 11.628 3.451 15.515 2.61 19.745 1.768 23.976 2.2 28.361 3.85 32.346 5.501 36.331 8.297 39.738 11.883 42.134 15.47 44.53 19.686 45.81 24 45.81c4.313 0 8.53-1.28 12.117-3.676 3.586-2.396 6.382-5.803 8.033-9.788 1.65-3.985 2.082-8.37 1.241-12.601-.842-4.23-2.919-8.117-5.969-11.167L24 24 8.578 8.578Z"/>
                </svg>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "19px", fontWeight: 700, letterSpacing: "0.1em", color: "#f0ede6" }}>AKAAL</span>
              </Link>
              <p style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.7, color: "rgba(160,155,135,0.45)", maxWidth: "260px" }}>
                Dedicated to bringing sacred ancient wisdom into the modern home through ethically sourced spiritual artifacts.
              </p>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                {["language", "mail", "share"].map(icon => (
                  <a key={icon} href="#" style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: "#161612", border: "1px solid rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "15px", textDecoration: "none", color: "rgba(200,195,178,0.65)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>{icon}</span>
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
              { label: "Contact Us", href: "mailto:support@akal.com" },
            ]} />
          </div>

          <div style={{ paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)" }}>© 2026 Akaal Spiritual Arts. All rights reserved.</p>
            <div style={{ display: "flex", gap: "20px" }}>
              {["Privacy Policy", "Terms of Service", "Support"].map(item => (
                <a key={item} href="#" style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", textDecoration: "none", transition: "color 0.2s" }}>{item}</a>
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
    <div style={{
      background: "#161612",
      border: "1px solid rgba(212,169,74,0.1)",
      borderRadius: "14px",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
      cursor: "pointer", position: "relative",
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.4)";
        el.style.borderColor = "rgba(212,169,74,0.2)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        el.style.borderColor = "rgba(212,169,74,0.1)";
      }}
    >
      <Link href={`/products/${id}`} style={{ aspectRatio: "1", position: "relative", overflow: "hidden", background: "#1c1c18", display: "block" }}>
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-500" />
      </Link>
      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
        <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,169,74,0.6)" }}>Spiritual Artifact</span>
        <Link href={`/products/${id}`} style={{ textDecoration: "none" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", fontWeight: 600, lineHeight: 1.25, color: "#f0ede6", margin: 0, transition: "color 0.2s" }}>
            {title}
          </h3>
        </Link>
        <p style={{ fontSize: "13px", fontWeight: 300, lineHeight: 1.65, color: "rgba(200,195,178,0.65)", margin: 0 }}>
          {desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "22px", fontWeight: 600, color: "#d4a94a", letterSpacing: "-0.01em" }}>{price}</span>
          <AddToCartButton productId={id} />
        </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h5 style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#f0ede6", margin: 0 }}>{title}</h5>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", padding: 0, margin: 0 }}>
        {links.map(link => (
          <li key={link.label}>
            <Link href={link.href} style={{ fontSize: "13px", fontWeight: 300, color: "rgba(160,155,135,0.45)", textDecoration: "none", transition: "color 0.2s" }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
