"use client";

export function AdminImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Crect width='56' height='56' fill='%232a2a2a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10px' font-family='sans-serif'%3ENo Img%3C/text%3E%3C/svg%3E";
      }}
    />
  );
}
