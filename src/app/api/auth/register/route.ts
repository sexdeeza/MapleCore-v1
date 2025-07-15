// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { registerSchema, rateLimit } from '@/lib/security/validation';
import { hashPassword, checkPasswordStrength, generateToken } from '@/lib/security/password';
import { secureQueries } from '@/lib/db';
import { z } from 'zod';

// Rate limiting: 3 registration attempts per hour per IP
const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3
});

async function registerHandler(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    const { username, email, password, birthday } = validatedData;

    // Additional password strength check
    const strength = checkPasswordStrength(password);
    if (strength.score < 3) {
      return NextResponse.json(
        { 
          error: 'Password is too weak',
          feedback: strength.feedback 
        },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await secureQueries.getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Hash password securely
    const hashedPassword = await hashPassword(password);

    // Create user account
    const userId = await secureQueries.createUser(
      username,
      hashedPassword,
      email,
      birthday
    );

    // Generate token for auto-login
    const token = generateToken({
      userId,
      username,
      isAdmin: false
    });

    const response = NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: userId,
        username
      }
    }, { status: 201 });

    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    console.log(`New user registered: ${username} from IP: ${request.headers.get('x-forwarded-for') || 'unknown'}`);

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

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

// Export with rate limiting
export const POST = registerRateLimit(registerHandler);