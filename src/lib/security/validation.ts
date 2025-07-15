// src/lib/security/validation.ts
// Input validation and sanitization utilities

import { z, ZodIssue } from 'zod';

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

// User registration schema
export const registerSchema = z.object({
  username: z.string()
    .min(4, 'Username must be at least 4 characters')
    .max(13, 'Username must be 13 characters or less')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .transform(val => val.toLowerCase().trim()),
  
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email too long')
    .transform(val => val.toLowerCase().trim()),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  birthday: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine((date) => {
      const birthDate = new Date(date);
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 13); // Minimum age 13
      return birthDate <= minAge;
    }, 'You must be at least 13 years old')
});

// Login schema
export const loginSchema = z.object({
  username: z.string()
    .min(1, 'Username required')
    .max(13, 'Invalid username')
    .transform(val => val.toLowerCase().trim()),
  
  password: z.string()
    .min(1, 'Password required')
    .max(50, 'Invalid password')
});

// Announcement schema
export const announcementSchema = z.object({
  type: z.enum(['event', 'update', 'maintenance']),
  title: z.string()
    .min(1, 'Title required')
    .max(255, 'Title too long')
    .transform(val => val.trim()),
  description: z.string()
    .min(1, 'Description required')
    .max(1000, 'Description too long')
    .transform(val => val.trim()),
  priority: z.number().int().min(0).max(999).default(0)
});

// Password update schema
export const passwordUpdateSchema = z.object({
  userId: z.number().int().positive(),
  newPassword: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password too long')
});

// ==========================================
// SANITIZATION FUNCTIONS
// ==========================================

// Prevent XSS by escaping HTML
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Sanitize for SQL (though we should use parameterized queries)
export function sanitizeForSQL(input: string): string {
  // This is a backup - ALWAYS use parameterized queries!
  return input.replace(/['";\\]/g, '');
}

// ==========================================
// VALIDATION MIDDLEWARE
// ==========================================

import { NextRequest, NextResponse } from 'next/server';

export function validateRequest(schema: z.ZodSchema) {
  return async (handler: Function) => {
    return async (req: NextRequest, ...args: any[]) => {
      try {
        const body = await req.json();
        const validated = schema.parse(body);
        
        // Create new request with validated data
        const newReq = new NextRequest(req.url, {
          method: req.method,
          headers: req.headers,
          body: JSON.stringify(validated),
        });
        
        // Copy cookies
        req.cookies.getAll().forEach(cookie => {
          newReq.cookies.set(cookie.name, cookie.value);
        });
        
        return handler(newReq, ...args);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            { 
              error: 'Validation failed',
              details: error.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message
              }))
            },
            { status: 400 }
          );
        }
        
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }
    };
  };
}

// ==========================================
// RATE LIMITING
// ==========================================

// Simple in-memory rate limiter (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
  keyGenerator?: (req: NextRequest) => string;
}) {
  return (handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>) => {
    return async (req: NextRequest, ...args: any[]) => {
      // Generate key (IP + endpoint by default)
      const ip = req.headers.get('x-forwarded-for') || 
                 req.headers.get('x-real-ip') || 
                 'unknown';
      const key = options.keyGenerator 
        ? options.keyGenerator(req)
        : `${ip}:${req.nextUrl.pathname}`;
      
      const now = Date.now();
      const record = rateLimitStore.get(key);
      
      // Clean up old entries
      if (record && now > record.resetTime) {
        rateLimitStore.delete(key);
      }
      
      // Check rate limit
      if (record && record.count >= options.max) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return NextResponse.json(
          { error: 'Too many requests' },
          { 
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': options.max.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
            }
          }
        );
      }
      
      // Update count
      if (record) {
        record.count++;
      } else {
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + options.windowMs
        });
      }
      
      return handler(req, ...args);
    };
  };
}