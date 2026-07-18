"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function ReviewForm({ productId }: { productId: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Choose a star rating.");
      return;
    }
    if (body.trim().length < 10) {
      setError("Share at least a few words (10+ characters).");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title: title.trim() || undefined, body: body.trim() }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Could not submit review.");
        return;
      }
      setDone(true);
      setOpen(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (status === "unauthenticated") {
    return (
      <Link href="/login" style={{
        padding: "9px 20px", background: "transparent", color: "#d4a94a",
        border: "1px solid rgba(212,169,74,0.3)", borderRadius: "8px",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
        textDecoration: "none",
      }}>Sign in to Review</Link>
    );
  }

  if (done && !open) {
    return (
      <span style={{ fontSize: "12px", color: "#25e2f4", fontWeight: 600 }}>
        ✓ Review submitted — thank you!
      </span>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        padding: "9px 20px", background: "#d4a94a", color: "#10100e",
        border: "none", borderRadius: "8px", cursor: "pointer",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
      }}>Write a Review</button>
    );
  }

  return (
    <form onSubmit={submit} style={{
      width: "100%", background: "#161612", border: "1px solid rgba(212,169,74,0.14)",
      borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: 600, color: "#f0ede6", margin: 0 }}>
          Share Your <em style={{ color: "#d4a94a" }}>Experience</em>
        </p>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close review form" style={{ background: "none", border: "none", color: "rgba(160,155,135,0.5)", cursor: "pointer", fontSize: "16px" }}>✕</button>
      </div>

      {/* Star picker */}
      <div style={{ display: "flex", gap: "4px" }} role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
          >
            <span className="material-symbols-outlined" style={{
              fontSize: "26px",
              color: (hovered || rating) >= star ? "#d4a94a" : "rgba(160,155,135,0.25)",
              fontVariationSettings: (hovered || rating) >= star ? "'FILL' 1" : "'FILL' 0",
            }}>star</span>
          </button>
        ))}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        maxLength={100}
        style={{ background: "rgba(212,169,74,0.03)", border: "1px solid rgba(212,169,74,0.12)", borderRadius: "9px", padding: "11px 14px", fontSize: "13px", color: "#f0ede6", outline: "none", fontFamily: "var(--font-sans)" }}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="How has this artifact served your practice?"
        rows={4}
        maxLength={1000}
        style={{ background: "rgba(212,169,74,0.03)", border: "1px solid rgba(212,169,74,0.12)", borderRadius: "9px", padding: "11px 14px", fontSize: "13px", color: "#f0ede6", outline: "none", fontFamily: "var(--font-sans)", resize: "vertical" }}
      />

      {error && <p role="alert" style={{ fontSize: "12px", color: "#f87171", margin: 0 }}>{error}</p>}

      <button type="submit" disabled={busy} style={{
        alignSelf: "flex-start", padding: "11px 24px", background: "#d4a94a", color: "#10100e",
        border: "none", borderRadius: "9px", cursor: busy ? "wait" : "pointer",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
        opacity: busy ? 0.7 : 1,
      }}>
        {busy ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
