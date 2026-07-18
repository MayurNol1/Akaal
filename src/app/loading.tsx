export default function Loading() {
  return (
    <div style={{ background: "#10100e", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "18px" }}>
      <div style={{ position: "relative", width: "56px", height: "56px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(212,169,74,0.12)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#d4a94a", animation: "akaal-spin 0.9s linear infinite" }} />
      </div>
      <p style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: "rgba(200,195,178,0.5)", margin: 0 }}>
        Aligning energies…
      </p>
      <style>{`@keyframes akaal-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
