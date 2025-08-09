/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
    basePath: '',
    
    // Handle client-side routing for static export
    experimental: {
      // This helps with routing on IPFS
      missingSuspenseWithCSRBailout: false,
    },
    
    // Disable server-side features that don't work with static export
    eslint: {
      ignoreDuringBuilds: true,
    },
    
    // Optimize for static hosting
    poweredByHeader: false,
    reactStrictMode: true,
  }
  
  module.exports = nextConfig