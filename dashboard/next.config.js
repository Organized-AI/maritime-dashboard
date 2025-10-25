/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow integration with existing PHP application
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:80/api/:path*', // Proxy to PHP backend
      },
    ]
  },
}

module.exports = nextConfig
