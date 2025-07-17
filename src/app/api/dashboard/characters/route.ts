// src/app/api/dashboard/characters/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { secureQueries } from '@/lib/db';
import { query } from '@/lib/db'; // Import the query function for direct queries

export const GET = requireAuth(async (req: AuthenticatedRequest) => {
  try {
    const userId = req.user!.userId;

    // Get all user's characters with appearance data
    const characters = await secureQueries.getCharactersByAccountId(userId);

    // Format characters data with equipment
    const formattedCharacters = await Promise.all(characters.map(async (char: any) => {
      // Get equipment for this character
      const equipmentQuery = `
        SELECT itemid, position
        FROM inventoryitems
        WHERE characterid = ? AND inventorytype = -1
      `;
      
      const equipmentRows = await query(equipmentQuery, [char.id]);
      
      // Map equipment positions to equipment slots
      const equipment: any = {};

      // First pass: Add regular items
      equipmentRows.forEach((item: any) => {
        let slot: string | null = null;
        
        // Map regular equipment positions
        switch(item.position) {
          case -1: slot = 'cap'; break;
          case -2: slot = 'mask'; break;
          case -3: slot = 'eyes'; break;
          case -4: slot = 'ears'; break;
          case -5: slot = 'coat'; break;
          case -6: slot = 'pants'; break;
          case -7: slot = 'shoes'; break;
          case -8: slot = 'glove'; break;
          case -9: slot = 'cape'; break;
          case -10: slot = 'shield'; break;
          case -11: slot = 'weapon'; break;
        }
        
        if (slot) {
          equipment[slot] = item.itemid;
        }
      });

      // Second pass: Override with cash items (they take priority)
      equipmentRows.forEach((item: any) => {
        let slot: string | null = null;
        
        // Map cash equipment positions
        switch(item.position) {
          case -101: slot = 'cap'; break;
          case -102: slot = 'mask'; break;
          case -103: slot = 'eyes'; break;
          case -104: slot = 'ears'; break;
          case -105: slot = 'coat'; break;
          case -106: slot = 'pants'; break;
          case -107: slot = 'shoes'; break;
          case -108: slot = 'glove'; break;
          case -109: slot = 'cape'; break;
          case -110: slot = 'shield'; break;
          case -111: slot = 'weapon'; break;
        }
        
        if (slot) {
          equipment[slot] = item.itemid; // This overwrites the regular item
        }
      });

      // Calculate exp percentage (simplified)
      const expToNextLevel = getExpForLevel(char.level + 1);
      const expCurrentLevel = getExpForLevel(char.level);
      const expProgress = expToNextLevel > expCurrentLevel ? 
        Math.floor(((char.exp - expCurrentLevel) / (expToNextLevel - expCurrentLevel)) * 100) : 0;

      return {
        id: char.id,
        name: char.name,
        level: char.level,
        job: getJobName(char.job),
        jobId: char.job,
        exp: Math.max(0, Math.min(100, expProgress)),
        meso: char.meso || 0,
        // Add appearance data
        skincolor: char.skincolor || 0,
        gender: char.gender || 0,
        hair: char.hair || 30000,
        face: char.face || 20000,
        // Add stats
        stats: {
          str: char.str || 4,
          dex: char.dex || 4,
          int: char.int || 4,
          luk: char.luk || 4
        },
        // Add equipment
        equipment: equipment,
        // Additional useful data
        fame: char.fame || 0,
        map: char.map || 0,
        guildid: char.guildid || 0
      };
    }));

    return NextResponse.json({ characters: formattedCharacters });

  } catch (error) {
    console.error('Characters error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    );
  }
});

// Helper function to get exp required for level (simplified)
function getExpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level <= 15) return Math.floor(level * level * level / 3);
  if (level <= 30) return Math.floor(level * level * level * 1.2);
  return Math.floor(level * level * level * 1.5);
}

// Helper function to convert job ID to job name
function getJobName(jobId: number): string {
  const jobMap: { [key: number]: string } = {
    0: 'Beginner',
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
    300: 'Bowman',
    310: 'Hunter',
    311: 'Ranger',
    312: 'Bow Master',
    320: 'Crossbowman',
    321: 'Sniper',
    322: 'Crossbow Master',
    400: 'Thief',
    410: 'Assassin',
    411: 'Hermit',
    412: 'Night Lord',
    420: 'Bandit',
    421: 'Chief Bandit',
    422: 'Shadower',
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