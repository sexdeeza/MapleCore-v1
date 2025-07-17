import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from your assets
  images: {
    unoptimized: process.env.NODE_ENV === 'development', // Disable optimization in dev
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'discord.com',
      },
      // Add dynamic hostname support
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_HOSTNAME || 'localhost',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_HOSTNAME || 'localhost',
      }
    ],
  },
  
  // Configure allowed origins for development
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' 
              ? '*' // Allow all origins in development
              : process.env.NEXT_PUBLIC_API_URL || '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  
  // Developer indicators configuration
  devIndicators: {
    position: 'bottom-right', // Position of the indicator
  },
  
  // Experimental features for better external access
  experimental: {
    // Allow external requests in development
    externalDir: true,
  },
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // In development, configure webpack to accept external connections
    if (dev && !isServer) {
      // This helps with HMR (Hot Module Replacement) from external IPs
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    return config;
  },
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;