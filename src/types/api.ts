// src/types/api.ts

// User types
export interface User {
  id: number;
  username: string;
  email?: string;
  nx?: number;
  votePoints?: number;
  isLoggedIn?: boolean;
}

// Character equipment types
export interface CharacterEquipment {
  cap?: number;      // Item ID for cap/hat
  mask?: number;     // Item ID for face accessory
  eyes?: number;     // Item ID for eye accessory
  ears?: number;     // Item ID for earrings
  coat?: number;     // Item ID for top/overall
  pants?: number;    // Item ID for bottom
  shoes?: number;    // Item ID for shoes
  glove?: number;    // Item ID for gloves
  cape?: number;     // Item ID for cape
  shield?: number;   // Item ID for shield
  weapon?: number;   // Item ID for weapon
}

// Character types
export interface Character {
  id: number;
  name: string;
  level: number;
  job: string;
  exp: number;
  meso: number;
  skincolor: number;  // 0-3 for different skin tones
  gender: number;     // 0 for male, 1 for female
  hair: number;       // Hair ID (e.g., 30000)
  face: number;       // Face ID (e.g., 20000)
  stats: {
    str: number;
    dex: number;
    int: number;
    luk: number;
  };
  equipment: CharacterEquipment;
}

// Announcement types
export interface Announcement {
  id: number;
  type: 'event' | 'update' | 'maintenance';
  title: string;
  description: string;
  date: string;
  time?: string;
  createdBy: string;
  gradient: string;
  priority?: number;
}

// Ranking types
export interface RankingPlayer {
  id: number;
  rank: number;
  name: string;
  level: number;
  job: string;
  guild?: string;
  fame: number;
  exp: number;
  isCurrentUser?: boolean;
}

// Vote types
export interface VoteSite {
  id: number;
  name: string;
  url: string;
  nx_reward: number;
  icon: string;
}

export interface VoteStatus {
  sites: VoteSite[];
  voteStatus: {
    [key: string]: {
      voted: boolean;
      canVoteAt?: number;
      pending?: boolean;
    };
  };
  todayRewards: number;
  username: string;
  currentNX: number;
  totalVotes: number;
}

// API Response types
export interface ApiResponse<T = any> {
  ok: boolean;
  data: T;
  status: number;
}

export interface StatsResponse {
  user: User & {
    nx: number;
    votePoints: number;
  };
  mainCharacter?: {
    level: number;
    job: string;
  };
  onlineCount: number;
}

export interface CharactersResponse {
  characters: Character[];
}

export interface RankingsResponse {
  rankings: RankingPlayer[];
  userRanking?: RankingPlayer;
}

export interface AnnouncementsResponse {
  announcements: Announcement[];
}

export interface AdminCheckResponse {
  isAdmin: boolean;
  username?: string;
}

export interface UsersResponse {
  users: Array<{
    id: number;
    name: string;
    createdat: string;
    lastlogin?: string;
    nxCredit?: number;
    banned: number;
    loggedin: number;
  }>;
  total: number;
}

// Export the character data type for the renderer
export type CharacterData = Character;