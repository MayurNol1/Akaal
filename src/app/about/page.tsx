import Link from "next/link";

export default function AboutPage() {
  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px" }}>

      {/* Hero */}
      <div style={{ padding: "80px clamp(16px,6vw,80px) 60px", textAlign: "center", position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(212,169,74,0.1)" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 800px 400px at 50% 80%, rgba(212,169,74,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "14px" }}>Our Story</p>
        <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(40px,7vw,72px)", fontWeight: 600, color: "#f0ede6", lineHeight: 1.0, marginBottom: "20px" }}>
          Sacred <em style={{ color: "#d4a94a", fontStyle: "italic" }}>Akaal</em>
        </h1>
        <p style={{ fontSize: "16px", color: "rgba(200,195,178,0.65)", maxWidth: "560px", margin: "0 auto 36px", lineHeight: 1.7 }}>
          Bridging ancient spiritual wisdom with modern devotion — one sacred artifact at a time.
        </p>
        <Link href="/products" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "13px 28px", background: "#d4a94a", color: "#10100e",
          borderRadius: "10px", fontSize: "12px", fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>shopping_bag</span>
          Explore Collections
        </Link>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "72px clamp(16px,4vw,48px) 80px" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px", fontSize: "16px", lineHeight: 1.8, color: "rgba(200,195,178,0.65)" }}>
          <p>
            <strong style={{ color: "#f0ede6" }}>Akaal</strong> represents the <em>timeless, the eternal, and the deathless</em>. Born from a profound desire to bridge ancient spiritual wisdom with modern devotion, our sanctuary offers a curated collection of high-vibration relics and artifacts — each chosen with care and intention.
          </p>
          <p>
            Every piece in our collection — whether a Panchmukhi Rudraksha, a Singing Bowl, or a Sandalwood Mala — is ethically sourced and energized to elevate your spiritual practices. We believe in providing instruments of peace that resonate deeply with your inner dharma.
          </p>

          {/* Quote Block */}
          <div style={{
            padding: "28px 32px", background: "#161612",
            border: "1px solid rgba(212,169,74,0.1)",
            borderLeft: "4px solid #d4a94a",
            borderRadius: "0 12px 12px 0",
          }}>
            <p style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, color: "#f0ede6", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
              &ldquo;Through focus and sacred resonance, we touch the eternal. The soul is everywhere and nowhere — timeless as Akaal itself.&rdquo;
            </p>
          </div>

          <p>
            Welcome to your personal sanctuary. May you find what your soul seeks.
          </p>
        </div>

        {/* Values */}
        <div style={{ marginTop: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 600, color: "#f0ede6", marginBottom: "28px" }}>
            Our <em style={{ color: "#d4a94a" }}>Values</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { icon: "eco", title: "Ethically Sourced", desc: "Every artifact is acquired from verified artisans and sacred sites with fair-trade practices." },
              { icon: "verified", title: "Authenticity Guaranteed", desc: "We certify each item's origin, material purity, and energetic quality before listing." },
              { icon: "energy_savings_leaf", title: "Energetically Charged", desc: "Items undergo Prana Pratishtha before dispatch to ensure they carry positive vibrations." },
              { icon: "favorite_border", title: "Community Driven", desc: "A portion of every sale supports preservation of traditional spiritual crafts in India." },
            ].map(v => (
              <div key={v.title} style={{
                background: "#161612", border: "1px solid rgba(212,169,74,0.08)",
                borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px",
              }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(212,169,74,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#d4a94a" }}>{v.icon}</span>
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f0ede6", margin: 0 }}>{v.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(200,195,178,0.65)", lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "48px", padding: "28px", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px" }}>
          {[
            { num: "2000+", label: "Sacred Artifacts" },
            { num: "15000+", label: "Happy Customers" },
            { num: "100%", label: "Authenticity Guaranteed" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 700, color: "#d4a94a", margin: "0 0 4px" }}>{stat.num}</p>
              <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: "56px", textAlign: "center", padding: "48px 32px", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 100%, rgba(212,169,74,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 600, color: "#f0ede6", marginBottom: "12px" }}>
            Begin Your <em style={{ color: "#d4a94a" }}>Journey</em>
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(200,195,178,0.65)", marginBottom: "24px" }}>
            Discover curated artifacts that will elevate your spiritual practice.
          </p>
          <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 32px", background: "#d4a94a", color: "#10100e", borderRadius: "10px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>explore</span>
            Explore the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
