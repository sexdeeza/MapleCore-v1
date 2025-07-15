// src/app/api/server/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { rateLimit } from '@/lib/security/validation';

// Rate limit to prevent abuse
const statusRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30 // 30 requests per minute
});

async function statusHandler(request: NextRequest) {
  try {
    // Count online players (loggedin = 2 means online)
    const [result] = await query<{ onlineCount: number }>(
      'SELECT COUNT(*) as onlineCount FROM accounts WHERE loggedin = 2'
    );
    
    const onlineCount = result?.onlineCount || 0;
    
    return NextResponse.json({
      online: true,
      players: onlineCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Server status error:', error);
    return NextResponse.json({
      online: false,
      players: 0,
      error: 'Failed to fetch server status'
    });
  }
}

// Export with rate limiting
export const GET = statusRateLimit(statusHandler);