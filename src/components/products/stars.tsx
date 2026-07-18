interface StarsProps {
  /** Average rating 0–5; rendered to the nearest half star. */
  value: number;
  size?: number;
}

/**
 * Shared star renderer so every rating in the app reads the same.
 * 4.3 → 4½ stars instead of the old Math.round() which showed 4.4 as 4
 * and 4.5 as 5 with nothing in between.
 */
export function Stars({ value, size = 14 }: StarsProps) {
  const half = Math.round(Math.min(Math.max(value, 0), 5) * 2) / 2;

  return (
    <span style={{ display: "inline-flex", gap: "2px" }} aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const icon = half >= i ? "star" : half >= i - 0.5 ? "star_half" : "star";
        const filled = half >= i - 0.5;
        return (
          <span
            key={i}
            className="material-symbols-outlined"
            aria-hidden
            style={{
              fontSize: `${size}px`,
              color: filled ? "#d4a94a" : "rgba(160,155,135,0.25)",
              fontVariationSettings: half >= i ? "'FILL' 1" : half >= i - 0.5 ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {icon}
          </span>
        );
      })}
    </span>
  );
}
