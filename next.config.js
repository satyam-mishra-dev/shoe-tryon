/** @type { import('next').NextConfig } */
const nextConfig = {
  reactStrictMode: true,
  // Next 14: keep DeepAR out of server bundle to avoid chunk errors (e.g. "./388.js")
  experimental: { serverComponentsExternalPackages: ['deepar'] },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'deepar'];
    }
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    }
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

module.exports = nextConfig;
