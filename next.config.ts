import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY' // Prevents clickjacking attacks
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Prevents MIME type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin' // Controls referrer information
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block' // Legacy XSS protection (for older browsers)
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()' // Restricts browser features
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains' // Forces HTTPS (only works if site uses HTTPS)
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';"
          }
        ]
      },
      {
        // Security headers for API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0' // Prevents caching of API responses
          }
        ]
      }
    ];
  },

  // Optimize images
  images: {
    domains: [], // Add external image domains if needed
    formats: ['image/avif', 'image/webp'],
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable strict mode for better error detection
  reactStrictMode: true,

  // Compress responses
  compress: true,
};

export default nextConfig;