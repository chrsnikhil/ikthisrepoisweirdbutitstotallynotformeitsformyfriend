/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['fonts.googleapis.com'],
  }
}

module.exports = nextConfig 