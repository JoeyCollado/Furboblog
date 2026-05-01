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
        hostname: 'giddy-dragon-31.convex.cloud',
        protocol: 'https',
        port: "",
      }
    ]
  }
};

export default nextConfig;
