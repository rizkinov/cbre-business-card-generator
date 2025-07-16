/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove development-only settings for production library
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false
  },
  webpack: (config, { isServer }) => {
    // Fix for PDFKit font loading issues
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    
    // Handle .afm and .map files that PDFKit needs
    config.module.rules.push({
      test: /\.(afm|map)$/,
      use: 'raw-loader',
    });
    
    return config;
  },
};

export default nextConfig; 