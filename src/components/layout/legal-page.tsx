interface Section {
  heading: string;
  body: string;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  sections: Section[];
}

/** Shared shell for the static Privacy / Terms / Support pages. */
export function LegalPage({ eyebrow, title, titleAccent, intro, sections }: LegalPageProps) {
  return (
    <div style={{ background: "#10100e", color: "#f0ede6", minHeight: "100vh", paddingTop: "72px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px clamp(16px,4vw,48px) 0" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#d4a94a", marginBottom: "8px" }}>{eyebrow}</p>
        <h1 style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, color: "#f0ede6", margin: "0 0 16px" }}>
          {title} <em style={{ color: "#d4a94a" }}>{titleAccent}</em>
        </h1>
        <p style={{ fontSize: "14px", lineHeight: 1.75, color: "rgba(200,195,178,0.65)", marginBottom: "40px" }}>{intro}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {sections.map((section) => (
            <section key={section.heading} style={{ background: "#161612", border: "1px solid rgba(212,169,74,0.08)", borderRadius: "14px", padding: "24px" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "#f0ede6", margin: "0 0 10px" }}>{section.heading}</h2>
              <p style={{ fontSize: "13px", lineHeight: 1.75, color: "rgba(160,155,135,0.6)", margin: 0 }}>{section.body}</p>
            </section>
          ))}
        </div>

        <p style={{ fontSize: "11px", color: "rgba(160,155,135,0.35)", marginTop: "40px" }}>
          Last updated: July 2026 · Questions? Write to <a href="mailto:support@akaal.com" style={{ color: "rgba(212,169,74,0.6)", textDecoration: "none" }}>support@akaal.com</a>
        </p>
      </div>
    </div>
  );
}
