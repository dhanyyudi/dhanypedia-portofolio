import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow external image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Match any Supabase subdomain
      },
    ],
    
    // Preferred formats (WebP first, then AVIF)
    formats: ['image/webp', 'image/avif'],
    
    // Responsive breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Cache optimization (30 days)
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
