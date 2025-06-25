export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  familyId?: string;
}

export interface Family {
  id: string;
  name: string;
  members: string[]; // user IDs
  inviteCode: string;
  totalPoints: number;
  createdAt: Date;
}

export interface ShoppingItem {
  id: string;
  name: string;
  comment?: string;
  addedBy: string; // user ID
  addedByName: string;
  addedByAvatar: string;
  likedBy: string[]; // user IDs
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  familyId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
}

export const AVATARS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄'
]; 