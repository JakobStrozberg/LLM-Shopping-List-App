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
  members: string[];
  inviteCode: string;
  totalPoints: number;
  createdAt: Date;
}

export interface ShoppingItem {
  id: string;
  name: string;
  comment?: string;
  image?: string;
  quantity: number;
  addedBy: string;
  addedByName: string;
  addedByAvatar: string;
  likedBy: string[];
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
  listId: string;
  category?: string;
  tags?: string[];
  points?: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  familyId: string;
  color: string;
  icon: string;
  createdBy: string;
  createdAt: Date;
  itemCount: number;
}

export interface ItemComment {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: Date;
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

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  brand?: string;
  tags?: string[];
  points?: number;
}

export interface FamilyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  image: string;
  unlocked?: boolean;
}

export const AVATARS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄'
]; 