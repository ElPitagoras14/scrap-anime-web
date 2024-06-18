/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**lokoloko.es',
        port: "",
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_IMAGE_URL,
        port: "",
      },
    ],
  },
};

export default nextConfig;