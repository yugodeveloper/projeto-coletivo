import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Autoriza o Unsplash (fotos de teste)
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Autoriza seu Supabase (fotos reais futuras)
      },
    ],
  },
};

export default nextConfig;