// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { loginSchema, rateLimit } from '@/lib/security/validation';
import { verifyPassword, generateToken, migratePasswordIfNeeded } from '@/lib/security/password';
import { secureQueries } from '@/lib/db';
import { z } from 'zod';

// Rate limiting: 5 attempts per 15 minutes per IP
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});

async function loginHandler(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    const { username, password } = validatedData;

    // Get user from database using secure query
    const user = await secureQueries.getUserByUsername(username);
    
    if (!user) {
      // Don't reveal if username exists
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Check if account is banned
    if (user.banned > 0) {
      return NextResponse.json(
        { error: 'Account is banned' },
        { status: 403 }
      );
    }

    // Verify password with migration support for old hashes
    let isValidPassword = false;
    
    // Check if password needs migration from old format
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
      // Already using bcrypt
      isValidPassword = await verifyPassword(password, user.password);
    } else {
      // Try migration from old format
      isValidPassword = await migratePasswordIfNeeded(
        user.id,
        password,
        user.password,
        async (userId, newHash) => {
          await secureQueries.updatePassword(userId, newHash);
        }
      );
    }

    if (!isValidPassword) {
      console.log(`Failed login attempt for user: ${username} from IP: ${request.headers.get('x-forwarded-for') || 'unknown'}`);
      
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const isAdmin = await secureQueries.isUserAdmin(user.id);

    // Get additional user data for response
    const userData = await secureQueries.getUserById(user.id);

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.name,
      isAdmin
    });

    // Create response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.name,
        email: userData?.email || '',
        nx: userData?.nxCredit || 0,
        votePoints: userData?.votePoints || 0,
        isAdmin
      }
    });

    // FIXED: Set cookie with proper settings for cross-origin access
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Set to false for HTTP (true only for HTTPS)
      sameSite: 'lax', // Changed from 'strict' to 'lax' to allow cross-origin requests
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      // Don't set domain - let browser handle it automatically
    });

    console.log(`Successful login: ${username} from IP: ${request.headers.get('x-forwarded-for') || 'unknown'}`);

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.issues 
        },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

// Export with rate limiting
export const POST = loginRateLimit(loginHandler);