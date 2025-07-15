// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/middleware/auth';
import { query } from '@/lib/db';

export const GET = requireAdmin(async (req: AuthenticatedRequest) => {
  try {
    // Get all users with essential fields
    const users = await query<any>(
      `SELECT 
        id, 
        name, 
        email, 
        createdat,
        lastlogin,
        banned,
        nxCredit,
        votepoints,
        webadmin,
        loggedin
      FROM accounts 
      ORDER BY id DESC
      LIMIT 200`
    );

    return NextResponse.json({ 
      users,
      total: users.length
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
});