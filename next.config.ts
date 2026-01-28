/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Liberando o Unsplash
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com', // Variação do Unsplash
      },
    ],
  },
};

export default nextConfig;