/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Adicionar esta configuração
  staticPageGenerationTimeout: 1000,
  images: {
    unoptimized: true,
    domains: ['fonts.googleapis.com', 'fonts.gstatic.com'],
  },
}

module.exports = nextConfig
