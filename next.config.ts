import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
