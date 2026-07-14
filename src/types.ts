export interface Child {
  id: string;
  name: string;
  avatarId: string; // 'babyshark' | 'superjett' | 'cosmictiger' | 'spacebunny' | 'dolphin'
  avatarUrl?: string; // Custom uploaded base64 avatar image URL
}

export type HabitCategory = 'hygiene' | 'sleep' | 'eating' | 'learning' | 'sports' | 'custom';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  iconId: string; // 'toothbrush' | 'moon' | 'sun' | 'book' | 'apple' | 'toybox' | 'water' | 'running' | 'custom'
  goalValue: number; // Target total count (e.g. 21 times, 30 times)
  dailyFrequency: number; // Target times per day (usually 1 or 2, max 8)
  themeColor: string; // Tailwind class name or pastel hex code
  createdAt: number;
  points: number; // NEW: point value for each punch-in
}

export interface PunchInLog {
  id: string;
  habitId: string;
  childId: string;
  date: string; // YYYY-MM-DD
  timestamp: number; // Unix timestamp
  encouragementText: string;
}

export interface Reward {
  id: string;
  name: string;
  pointsRequired: number;
  createdAt: number;
  imageUrl?: string; // Optional custom uploaded base64 image URL
}

export interface RewardRedemption {
  id: string;
  childId: string;
  rewardId: string;
  timestamp: number;
}

export interface AppState {
  children: Child[];
  activeChildId: string | null;
  habits: Habit[];
  logs: PunchInLog[];
  parentPasswordHash: string; // Simplistic storage of password
  isInitialized: boolean;
  rewards?: Reward[]; // NEW: reward configuration
  redemptions?: RewardRedemption[]; // NEW: reward redemption history
}
