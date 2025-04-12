/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add output: 'standalone' for better Vercel deployment
  output: "standalone",
  // Ensure images from placeholder.svg are allowed
  images: {
    domains: ["placeholder.svg"],
  },
}

module.exports = nextConfig
