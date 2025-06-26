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
  image?: string;
  quantity: number;
  addedBy: string; // user ID
  addedByName: string;
  addedByAvatar: string;
  likedBy: string[]; // user IDs
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
  listId: string; // Adding list reference
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

export interface ShoppingList {
  id: string;
  name: string;
  familyId: string;
  color: string; // For visual distinction
  icon: string; // Emoji icon
  createdBy: string;
  createdAt: Date;
  itemCount: number;
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
}

export const AVATARS = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄'
]; 