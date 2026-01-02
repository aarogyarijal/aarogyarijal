import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Enable compression for better performance
  compress: true,
  // Generate ETags for better caching
  generateEtags: true,
  // Enable poweredByHeader: false for security
  poweredByHeader: false,
};

export default nextConfig;
