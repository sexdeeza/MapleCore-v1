// src/app/api/announcements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthenticatedRequest } from '@/lib/middleware/auth';
import { announcementSchema } from '@/lib/security/validation';
import { query } from '@/lib/db';
import { z } from 'zod';

// GET - Fetch all active announcements (Public)
export async function GET(request: NextRequest) {
  try {
    // Get all active announcements
    const announcements = await query<any>(
      `SELECT 
        a.id,
        a.type,
        a.title,
        a.description,
        a.created_at,
        a.priority,
        acc.name as created_by_name
       FROM announcements a
       JOIN accounts acc ON a.created_by = acc.id
       WHERE a.active = 1
       ORDER BY a.priority DESC, a.created_at DESC
       LIMIT 20`
    );

    // Format the announcements
    const formattedAnnouncements = announcements.map((ann: any) => ({
      id: ann.id,
      type: ann.type,
      title: ann.title,
      description: ann.description,
      date: formatTimeAgo(ann.created_at),
      createdBy: ann.created_by_name,
      gradient: getGradientByType(ann.type)
    }));

    return NextResponse.json({ announcements: formattedAnnouncements });

  } catch (error) {
    console.error('Fetch announcements error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

// POST - Create new announcement (Admin only)
export const POST = requireAdmin(async (req: AuthenticatedRequest) => {
  try {
    // Parse and validate body
    const body = await req.json();
    const validatedData = announcementSchema.parse(body);
    const { type, title, description, priority = 0 } = validatedData;

    const userId = req.user!.userId;

    // Create announcement
    await query(
      `INSERT INTO announcements (type, title, description, created_by, priority, created_at, active) 
       VALUES (?, ?, ?, ?, ?, NOW(), 1)`,
      [type, title, description, userId, priority]
    );

    console.log(`Admin ${req.user!.username} created announcement: ${title}`);

    return NextResponse.json({ 
      success: true,
      message: 'Announcement created successfully'
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

    console.error('Create announcement error:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
});

// DELETE - Delete announcement (Admin only)
export const DELETE = requireAdmin(async (req: AuthenticatedRequest) => {
  try {
    // Get announcement ID from query params
    const { searchParams } = new URL(req.url);
    const announcementId = searchParams.get('id');

    if (!announcementId || isNaN(Number(announcementId))) {
      return NextResponse.json(
        { error: 'Invalid announcement ID' },
        { status: 400 }
      );
    }

    // Soft delete (set active = 0)
    await query(
      'UPDATE announcements SET active = 0 WHERE id = ?',
      [Number(announcementId)]
    );

    console.log(`Admin ${req.user!.username} deleted announcement ID: ${announcementId}`);

    return NextResponse.json({ 
      success: true,
      message: 'Announcement deleted successfully'
    });

  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
});

// Helper function to format time ago
function formatTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
}

// Helper function to get gradient by announcement type
function getGradientByType(type: string): string {
  switch (type) {
    case 'event':
      return 'from-purple-600 to-purple-400';
    case 'maintenance':
      return 'from-orange-600 to-orange-400';
    case 'update':
      return 'from-blue-600 to-blue-400';
    default:
      return 'from-gray-600 to-gray-400';
  }
}