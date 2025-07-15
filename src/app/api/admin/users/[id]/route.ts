// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/middleware/auth';
import { query, transaction } from '@/lib/db';
import { z } from 'zod';

// Validation schema for ID parameter
const idSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid user ID')
});

export async function DELETE(
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Apply admin authentication
  return requireAdmin(async (req: AuthenticatedRequest) => {
    try {
      // Await and validate params
      const { id } = await params;
      const validated = idSchema.parse({ id });
      const userIdToDelete = parseInt(validated.id);

      const adminId = req.user!.userId;

      // Prevent admin from deleting themselves
      if (userIdToDelete === adminId) {
        return NextResponse.json(
          { error: 'Cannot delete your own account' },
          { status: 400 }
        );
      }

      // Check if the user to be deleted is also an admin
      const [targetAdminCheck] = await query<{ isAdmin: number }>(
        `SELECT COUNT(*) as isAdmin 
         FROM characters 
         WHERE accountid = ? AND gm >= 6`,
        [userIdToDelete]
      );

      if (targetAdminCheck.isAdmin > 0) {
        return NextResponse.json(
          { error: 'Cannot delete admin accounts' },
          { status: 403 }
        );
      }

      // Delete user and their characters in a transaction
      await transaction(async (connection) => {
        // Delete user's characters
        await connection.execute(
          'DELETE FROM characters WHERE accountid = ?',
          [userIdToDelete]
        );

        // Delete the account
        await connection.execute(
          'DELETE FROM accounts WHERE id = ?',
          [userIdToDelete]
        );
      });

      console.log(`Admin ${req.user!.username} deleted user ID: ${userIdToDelete}`);

      return NextResponse.json({ 
        success: true,
        message: 'Account deleted successfully'
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 400 }
        );
      }

      console.error('Delete user error:', error);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }
  })(request);
}