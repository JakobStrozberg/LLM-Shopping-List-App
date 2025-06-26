import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Family, ShoppingItem, ChatMessage, ShoppingList } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  
  // Families
  families: Family[];
  currentFamily: Family | null;
  createFamily: (name: string) => Family;
  joinFamily: (inviteCode: string) => boolean;
  selectFamily: (familyId: string) => void;
  
  // Shopping Lists
  shoppingLists: ShoppingList[];
  currentList: ShoppingList | null;
  createShoppingList: (name: string, icon: string, color: string) => void;
  selectList: (listId: string) => void;
  deleteList: (listId: string) => void;
  
  // Shopping Items
  shoppingItems: ShoppingItem[];
  addShoppingItem: (name: string, comment?: string, image?: string, quantity?: number) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  toggleItemCheck: (itemId: string) => void;
  toggleItemLike: (itemId: string) => void;
  deleteShoppingItem: (itemId: string) => void;
  
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
      logout: () => set({ 
        currentUser: null, 
        currentFamily: null,
        currentList: null,
        shoppingItems: [],
        chatMessages: [] 
      }),
      
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
      
      // Shopping Lists
      shoppingLists: [],
      currentList: null,
      
      createShoppingList: (name, icon, color) => {
        const user = get().currentUser;
        const family = get().currentFamily;
        if (!user || !family) return;
        
        const newList: ShoppingList = {
          id: uuidv4(),
          name,
          familyId: family.id,
          color,
          icon,
          createdBy: user.id,
          createdAt: new Date(),
          itemCount: 0,
        };
        
        set((state) => ({
          shoppingLists: [...state.shoppingLists, newList],
          currentList: newList,
        }));
      },
      
      selectList: (listId) => {
        const list = get().shoppingLists.find(l => l.id === listId);
        set({ currentList: list || null });
      },
      
      deleteList: (listId) => {
        set((state) => ({
          shoppingLists: state.shoppingLists.filter(l => l.id !== listId),
          shoppingItems: state.shoppingItems.filter(item => item.listId !== listId),
          currentList: state.currentList?.id === listId ? null : state.currentList,
        }));
      },
      
      // Shopping Items
      shoppingItems: [],
      
      addShoppingItem: (name, comment, image, quantity = 1) => {
        const user = get().currentUser;
        const currentList = get().currentList;
        if (!user || !currentList) return;
        
        const newItem: ShoppingItem = {
          id: uuidv4(),
          name,
          comment,
          image,
          quantity,
          addedBy: user.id,
          addedByName: user.name,
          addedByAvatar: user.avatar,
          likedBy: [],
          checked: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          listId: currentList.id,
        };
        
        set((state) => ({
          shoppingItems: [...state.shoppingItems, newItem],
          shoppingLists: state.shoppingLists.map(list =>
            list.id === currentList.id
              ? { ...list, itemCount: list.itemCount + 1 }
              : list
          ),
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
              quantity: Math.floor(Math.random() * 3) + 1,
              addedBy: randomUser.id,
              addedByName: randomUser.name,
              addedByAvatar: randomUser.avatar,
              likedBy: [],
              checked: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              listId: currentList.id,
            };
            set((state) => ({
              shoppingItems: [...state.shoppingItems, mockItem],
              shoppingLists: state.shoppingLists.map(list =>
                list.id === currentList.id
                  ? { ...list, itemCount: list.itemCount + 1 }
                  : list
              ),
            }));
          }
        }, Math.random() * 10000 + 5000);
      },
      
      updateItemQuantity: (itemId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          shoppingItems: state.shoppingItems.map(item =>
            item.id === itemId ? { ...item, quantity, updatedAt: new Date() } : item
          ),
        }));
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
      
      deleteShoppingItem: (itemId) => {
        const item = get().shoppingItems.find(i => i.id === itemId);
        if (!item) return;
        
        set((state) => ({
          shoppingItems: state.shoppingItems.filter(i => i.id !== itemId),
          shoppingLists: state.shoppingLists.map(list =>
            list.id === item.listId
              ? { ...list, itemCount: Math.max(0, list.itemCount - 1) }
              : list
          ),
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