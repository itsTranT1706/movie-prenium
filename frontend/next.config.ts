import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any remote source (CDN)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allow all HTTP domains (for development)
      },
    ],
  },
};

export default nextConfig;
