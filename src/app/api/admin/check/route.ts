// src/app/api/admin/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { secureQueries } from '@/lib/db';

export const GET = requireAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user!.userId;
    const username = req.user!.username;

    // Check if user has admin privileges
    const isAdmin = await secureQueries.isUserAdmin(userId);

    return NextResponse.json({ 
      isAdmin,
      userId,
      username
    });

  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
});