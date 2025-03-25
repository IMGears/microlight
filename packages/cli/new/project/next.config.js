const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // If you're using turbopack
    turbopack: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
      '@microlight/local': path.join(__dirname, '.microlight'),
    }
    return config
  }
}

module.exports = nextConfig