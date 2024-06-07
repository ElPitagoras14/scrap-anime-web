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
        hostname: '**.net',
        port: "",
      },
    ],
  },
};

export default nextConfig;