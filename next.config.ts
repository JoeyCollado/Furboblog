import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "tough-rook-353.convex.cloud", // switch to prod url from convex
        protocol: "https",
        port: "",
      }
    ]
  }
};

export default nextConfig;
