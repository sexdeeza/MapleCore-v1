// src/app/api/admin/users/update-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/middleware/auth';
import { passwordUpdateSchema } from '@/lib/security/validation';
import { hashPassword } from '@/lib/security/password';
import { secureQueries } from '@/lib/db';
import { z } from 'zod';

export const POST = requireAdmin(async (req: AuthenticatedRequest) => {
  try {
    // Parse and validate body
    const body = await req.json();
    const validatedData = passwordUpdateSchema.parse(body);
    const { userId, newPassword } = validatedData;

    // Prevent admin from changing their own password through this route
    if (userId === req.user!.userId) {
      return NextResponse.json(
        { error: 'Cannot update your own password through admin panel' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await secureQueries.updatePassword(userId, hashedPassword);

    console.log(`Admin ${req.user!.username} updated password for user ID: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });

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

    console.error('Update password error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
});