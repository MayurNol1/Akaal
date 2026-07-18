import Link from "next/link";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div style={{ background: "#10100e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "440px", width: "100%", textAlign: "center", background: "#161612", border: "1px solid rgba(212,169,74,0.1)", borderRadius: "24px", padding: "56px 40px" }}>
        <p style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "72px", fontWeight: 600, color: "rgba(212,169,74,0.25)", margin: "0 0 8px", lineHeight: 1 }}>404</p>
        <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600, color: "#f0ede6", marginBottom: "10px" }}>
          This Path Does Not Exist
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(160,155,135,0.5)", lineHeight: 1.7, marginBottom: "28px" }}>
          The page you seek has dissolved into the void, or perhaps it never manifested at all.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#d4a94a", color: "#10100e", borderRadius: "10px", padding: "12px 24px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}
          >
            Return Home
          </Link>
          <Link
            href="/products"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", color: "#d4a94a", borderRadius: "10px", padding: "12px 24px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "1px solid rgba(212,169,74,0.3)", textDecoration: "none" }}
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
