// src/app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { secureQueries, query } from '@/lib/db';

export const GET = requireAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user!.userId;

    // Get user data
    const user = await secureQueries.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get main character
    const mainCharacter = await secureQueries.getMainCharacter(userId);

    // Get online count
    const [onlineResult] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM accounts WHERE loggedin = 2'
    );

    return NextResponse.json({
      user: {
        id: userId,
        username: user.name,
        nx: user.nxCredit || 0,
        votePoints: user.votePoints || 0
      },
      onlineCount: onlineResult?.count || 0,
      mainCharacter: mainCharacter ? {
        name: mainCharacter.name,
        level: mainCharacter.level,
        job: getJobName(mainCharacter.job)
      } : null
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
});

// Helper function to convert job ID to job name
function getJobName(jobId: number): string {
  const jobMap: { [key: number]: string } = {
    // Beginner
    0: 'Beginner',
    
    // Warrior
    100: 'Warrior',
    110: 'Fighter',
    111: 'Crusader',
    112: 'Hero',
    120: 'Page',
    121: 'White Knight',
    122: 'Paladin',
    130: 'Spearman',
    131: 'Dragon Knight',
    132: 'Dark Knight',
    
    // Magician
    200: 'Magician',
    210: 'F/P Wizard',
    211: 'F/P Mage',
    212: 'F/P Archmage',
    220: 'I/L Wizard',
    221: 'I/L Mage',
    222: 'I/L Archmage',
    230: 'Cleric',
    231: 'Priest',
    232: 'Bishop',
    
    // Bowman
    300: 'Bowman',
    310: 'Hunter',
    311: 'Ranger',
    312: 'Bow Master',
    320: 'Crossbowman',
    321: 'Sniper',
    322: 'Crossbow Master',
    
    // Thief
    400: 'Thief',
    410: 'Assassin',
    411: 'Hermit',
    412: 'Night Lord',
    420: 'Bandit',
    421: 'Chief Bandit',
    422: 'Shadower',
    
    // Pirate
    500: 'Pirate',
    510: 'Brawler',
    511: 'Marauder',
    512: 'Buccaneer',
    520: 'Gunslinger',
    521: 'Outlaw',
    522: 'Corsair'
  };

  return jobMap[jobId] || 'Unknown';
}