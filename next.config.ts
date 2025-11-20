import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      {
        protocol: "https",
        hostname: "lyksia.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.vercel-storage.com",
      },
    ],
    dangerouslyAllowSVG: true,
    // En développement, désactiver l'optimisation pour localhost
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
