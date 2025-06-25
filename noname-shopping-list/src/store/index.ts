import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Family, ShoppingItem, ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Families
  families: Family[];
  currentFamily: Family | null;
  createFamily: (name: string) => Family;
  joinFamily: (inviteCode: string) => boolean;
  selectFamily: (familyId: string) => void;
  
  // Shopping List
  shoppingItems: ShoppingItem[];
  addShoppingItem: (name: string, comment?: string) => void;
  toggleItemCheck: (itemId: string) => void;
  toggleItemLike: (itemId: string) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  sendMessage: (message: string) => void;
  
  // Mock users for testing
  mockUsers: User[];
}

// Mock data for testing
const MOCK_USERS: User[] = [
  { id: '1', email: 'mom@family.com', name: 'Mom', avatar: '🐱', familyId: 'family1' },
  { id: '2', email: 'dad@family.com', name: 'Dad', avatar: '🐶', familyId: 'family1' },
  { id: '3', email: 'kid1@family.com', name: 'Sarah', avatar: '🦄', familyId: 'family1' },
  { id: '4', email: 'kid2@family.com', name: 'Tom', avatar: '🐼', familyId: 'family1' },
];

const MOCK_FAMILY: Family = {
  id: 'family1',
  name: 'The Smiths',
  members: ['1', '2', '3', '4'],
  inviteCode: 'SMITH123',
  totalPoints: 2450,
  createdAt: new Date(),
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      
      // Families
      families: [MOCK_FAMILY],
      currentFamily: null,
      
      createFamily: (name) => {
        const newFamily: Family = {
          id: uuidv4(),
          name,
          members: [get().currentUser?.id || ''],
          inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          totalPoints: 0,
          createdAt: new Date(),
        };
        set((state) => ({
          families: [...state.families, newFamily],
          currentFamily: newFamily,
        }));
        return newFamily;
      },
      
      joinFamily: (inviteCode) => {
        const family = get().families.find(f => f.inviteCode === inviteCode);
        if (family && family.members.length < 5) {
          const currentUserId = get().currentUser?.id;
          if (currentUserId && !family.members.includes(currentUserId)) {
            family.members.push(currentUserId);
            set({ currentFamily: family });
            return true;
          }
        }
        return false;
      },
      
      selectFamily: (familyId) => {
        const family = get().families.find(f => f.id === familyId);
        set({ currentFamily: family || null });
      },
      
      // Shopping List
      shoppingItems: [],
      
      addShoppingItem: (name, comment) => {
        const user = get().currentUser;
        if (!user) return;
        
        const newItem: ShoppingItem = {
          id: uuidv4(),
          name,
          comment,
          addedBy: user.id,
          addedByName: user.name,
          addedByAvatar: user.avatar,
          likedBy: [],
          checked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          shoppingItems: [...state.shoppingItems, newItem],
        }));
        
        // Simulate other users adding items occasionally
        setTimeout(() => {
          const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
          if (randomUser.id !== user.id) {
            const mockItems = ['Milk', 'Bread', 'Eggs', 'Cheese', 'Apples', 'Bananas'];
            const mockItem: ShoppingItem = {
              id: uuidv4(),
              name: mockItems[Math.floor(Math.random() * mockItems.length)],
              comment: Math.random() > 0.5 ? 'Get the organic one!' : undefined,
              addedBy: randomUser.id,
              addedByName: randomUser.name,
              addedByAvatar: randomUser.avatar,
              likedBy: [],
              checked: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            set((state) => ({
              shoppingItems: [...state.shoppingItems, mockItem],
            }));
          }
        }, Math.random() * 10000 + 5000);
      },
      
      toggleItemCheck: (itemId) => {
        set((state) => ({
          shoppingItems: state.shoppingItems.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        }));
      },
      
      toggleItemLike: (itemId) => {
        const userId = get().currentUser?.id;
        if (!userId) return;
        
        set((state) => ({
          shoppingItems: state.shoppingItems.map(item => {
            if (item.id === itemId) {
              const likedBy = item.likedBy.includes(userId)
                ? item.likedBy.filter(id => id !== userId)
                : [...item.likedBy, userId];
              return { ...item, likedBy };
            }
            return item;
          }),
        }));
      },
      
      // Chat
      chatMessages: [],
      
      sendMessage: (message) => {
        const user = get().currentUser;
        const family = get().currentFamily;
        if (!user || !family) return;
        
        const newMessage: ChatMessage = {
          id: uuidv4(),
          familyId: family.id,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          message,
          timestamp: new Date(),
        };
        
        set((state) => ({
          chatMessages: [...state.chatMessages, newMessage],
        }));
        
        // Simulate responses from other family members
        setTimeout(() => {
          const responses = [
            "Sounds good!",
            "I'll get that on my way home",
            "Do we need anything else?",
            "Got it! 👍",
            "Thanks for adding that to the list!",
          ];
          const randomUser = MOCK_USERS.filter(u => u.id !== user.id)[Math.floor(Math.random() * (MOCK_USERS.length - 1))];
          const responseMessage: ChatMessage = {
            id: uuidv4(),
            familyId: family.id,
            userId: randomUser.id,
            userName: randomUser.name,
            userAvatar: randomUser.avatar,
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
          };
          set((state) => ({
            chatMessages: [...state.chatMessages, responseMessage],
          }));
        }, Math.random() * 3000 + 1000);
      },
      
      // Mock users
      mockUsers: MOCK_USERS,
    }),
    {
      name: 'noname-shopping-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 