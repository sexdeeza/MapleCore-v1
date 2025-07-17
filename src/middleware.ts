// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the origin from the request
  const origin = request.headers.get('origin') || '';
  
  // Get allowed origins from environment
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://0.0.0.0:3000',
    process.env.NEXT_PUBLIC_API_URL || '',
  ].filter(Boolean);
  
  // Add your specific IPs
  if (process.env.NEXT_PUBLIC_HOSTNAME) {
    allowedOrigins.push(`http://${process.env.NEXT_PUBLIC_HOSTNAME}:3000`);
    allowedOrigins.push(`https://${process.env.NEXT_PUBLIC_HOSTNAME}:3000`);
  }
  
  // Check if origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin) || 
                         origin === '' || // Same origin
                         process.env.NODE_ENV === 'development'; // Allow all in dev
  
  // Clone the response
  const response = NextResponse.next();
  
  // Set CORS headers
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers });
  }
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove server header
  response.headers.delete('X-Powered-By');
  
  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all pages except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};