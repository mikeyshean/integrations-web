/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_HOST: process.env.API_HOST,
    API_TOKEN: process.env.API_TOKEN
  },
  // output: 'standalone',
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig
