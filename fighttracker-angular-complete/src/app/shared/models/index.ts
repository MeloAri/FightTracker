export interface AuthRequest { email: string; password: string; }
export interface AuthResponse { token: string; }

export interface Fighter { id: number; name: string; category: string; }

export interface Fight {
  id: number;
  fighter1: string;
  fighter2: string;
  eventName: string;
  eventDate: string;
  category: string;
  location: string;
}

export interface FightEvent {
  id: number;
  name: string;
  date: string;
  location: string;
  category: string;
  source: string;
  fighterId?: number;
}

export interface CreateEventRequest {
  name: string; date: string; location: string;
  category: string; fighterId?: number;
}

export interface Follow { id: number; fighterId: number; fighterName: string; }
export interface ApiResponse { message: string; }

export interface Page<T> {
  content: T[]; totalElements: number; totalPages: number;
  number: number; size: number; first: boolean; last: boolean;
}

export interface Toast {
  id: number; type: 'success' | 'error' | 'warning' | 'info';
  title: string; message: string;
}

export const CATEGORIES = [
  'MMA', 'Boxe', 'Jiu-Jitsu', 'Muay Thai', 'Wrestling',
  'Kickboxing', 'Judô', 'Karatê', 'Sambo', 'Luta Livre', 'Taekwondo', 'Grappling'
] as const;
export type Category = typeof CATEGORIES[number];
export const FREE_FOLLOW_LIMIT = 3;
export const ESPN_CATEGORIES: string[] = ['MMA', 'Boxe'];
export const MANUAL_CATEGORIES = CATEGORIES.filter(c => !ESPN_CATEGORIES.includes(c));
