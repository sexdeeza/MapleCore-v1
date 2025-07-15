// src/lib/middleware/auth.ts
// Authentication middleware for protecting API routes

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/security/password';
import { secureQueries } from '@/lib/db';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: number;
    username: string;
    isAdmin: boolean;
  };
}

/**
 * Middleware to require authentication
 */
export function requireAuth(
  handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      // Get token from cookie
      const token = req.cookies.get('auth-token')?.value;

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Verify token
      const payload = verifyToken(token);

      // Create authenticated request
      const authReq = req as AuthenticatedRequest;
      authReq.user = {
        userId: payload.userId,
        username: payload.username,
        isAdmin: payload.isAdmin || false
      };

      return handler(authReq, ...args);

    } catch (error) {
      console.error('Auth middleware error:', error);
      
      // Clear invalid token
      const response = NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
      
      response.cookies.delete('auth-token');
      
      return response;
    }
  };
}

/**
 * Middleware to require admin privileges
 */
export function requireAdmin(
  handler: (req: AuthenticatedRequest, ...args: any[]) => Promise<NextResponse>
) {
  return requireAuth(async (req: AuthenticatedRequest, ...args: any[]) => {
    // Double-check admin status in database
    const isAdmin = await secureQueries.isUserAdmin(req.user!.userId);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Update admin status in request
    req.user!.isAdmin = true;

    return handler(req, ...args);
  });
}

/**
 * CORS Middleware
 */
export function corsMiddleware(
  handler: Function,
  options: {
    allowedOrigins?: string[];
    allowedMethods?: string[];
    allowCredentials?: boolean;
  } = {}
) {
  const {
    allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
    allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowCredentials = true
  } = options;

  return async (req: NextRequest, ...args: any[]) => {
    const origin = req.headers.get('origin') || '';
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.includes('*') || 
                     allowedOrigins.includes(origin) ||
                     (process.env.NODE_ENV === 'development' && origin.includes('localhost'));

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': isAllowed ? origin : '',
          'Access-Control-Allow-Methods': allowedMethods.join(', '),
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': allowCredentials.toString(),
          'Access-Control-Max-Age': '86400', // 24 hours
        }
      });
    }

    // Execute handler
    const response = await handler(req, ...args);

    // Add CORS headers to response
    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', allowCredentials.toString());
    }

    return response;
  };
}