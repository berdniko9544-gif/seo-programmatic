/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'export' to enable ISR
  // output: 'export', // REMOVED for ISR support

  images: {
    unoptimized: true,
  },

  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  // ISR is enabled by default in Next.js 14+

  // Optimize bundle
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig
