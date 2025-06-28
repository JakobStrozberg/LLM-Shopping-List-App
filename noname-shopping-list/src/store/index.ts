import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Family, ShoppingItem, ChatMessage, ShoppingList, ItemComment } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { CategorizationService, TaggingService } from '../services/categorization';

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  
  isDemoMode: boolean;
  setDemoMode: (isDemo: boolean) => void;
  
  families: Family[];
  currentFamily: Family | null;
  createFamily: (name: string) => Family;
  joinFamily: (inviteCode: string) => boolean;
  selectFamily: (familyId: string) => void;
  setupDemoFamily: () => void;
  
  shoppingLists: ShoppingList[];
  currentList: ShoppingList | null;
  createShoppingList: (name: string, icon: string, color: string) => void;
  selectList: (listId: string) => void;
  deleteList: (listId: string) => void;
  
  shoppingItems: ShoppingItem[];
  addShoppingItem: (name: string, comment?: string, image?: string, quantity?: number, points?: number) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  toggleItemCheck: (itemId: string) => void;
  toggleItemLike: (itemId: string) => void;
  deleteShoppingItem: (itemId: string) => void;
  
  itemComments: ItemComment[];
  addItemComment: (itemId: string, text: string) => void;
  getItemComments: (itemId: string) => ItemComment[];
  
  chatMessages: ChatMessage[];
  sendMessage: (message: string) => void;
  
  mockUsers: User[];
}

const DEMO_USERS: User[] = [
  { id: 'demo-mom', email: 'mom@smithfamily.com', name: 'Mom Smith', avatar: '👩', familyId: 'demo-family' },
  { id: 'demo-dad', email: 'dad@smithfamily.com', name: 'Dad Smith', avatar: '👨', familyId: 'demo-family' },
  { id: 'demo-sarah', email: 'sarah@smithfamily.com', name: 'Sarah', avatar: '👧', familyId: 'demo-family' },
  { id: 'demo-tom', email: 'tom@smithfamily.com', name: 'Tom', avatar: '👦', familyId: 'demo-family' },
];

const DEMO_FAMILY: Family = {
  id: 'demo-family',
  name: 'The Smiths',
  members: ['demo-mom', 'demo-dad', 'demo-sarah', 'demo-tom'],
  inviteCode: 'DEMO123',
  totalPoints: 2450,
  createdAt: new Date(),
};

const createDemoItems = (listId: string): ShoppingItem[] => [
  {
    id: 'demo-item-1',
    name: 'Organic Milk',
    comment: 'Get the 2% one',
    quantity: 2,
    addedBy: 'demo-mom',
    addedByName: 'Mom Smith',
    addedByAvatar: '👩',
    likedBy: ['demo-dad'],
    checked: false,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    listId,
    category: 'Dairy',
    tags: ['organic', 'dairy', '2%'],
    points: 15,
  },
  {
    id: 'demo-item-2',
    name: 'Whole Wheat Bread',
    comment: 'The one with seeds',
    quantity: 1,
    addedBy: 'demo-dad',
    addedByName: 'Dad Smith',
    addedByAvatar: '👨',
    likedBy: ['demo-mom', 'demo-sarah'],
    checked: true,
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 1800000),
    listId,
    category: 'Bakery',
    tags: ['bread', 'whole wheat', 'seeds'],
    points: 10,
  },
  {
    id: 'demo-item-3',
    name: 'Bananas',
    quantity: 6,
    addedBy: 'demo-sarah',
    addedByName: 'Sarah',
    addedByAvatar: '👧',
    likedBy: ['demo-tom'],
    checked: false,
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 1800000),
    listId,
    category: 'Produce',
    tags: ['fruit', 'bananas'],
    points: 8,
  },
  {
    id: 'demo-item-4',
    name: 'Chicken Breast',
    comment: 'For dinner tonight',
    quantity: 2,
    addedBy: 'demo-mom',
    addedByName: 'Mom Smith',
    addedByAvatar: '👩',
    likedBy: [],
    checked: false,
    createdAt: new Date(Date.now() - 900000),
    updatedAt: new Date(Date.now() - 900000),
    listId,
    category: 'Meat',
    tags: ['chicken', 'protein', 'dinner'],
    points: 25,
  },
];

const createDemoComments = (): ItemComment[] => [
  {
    id: 'demo-comment-1',
    itemId: 'demo-item-1',
    userId: 'demo-dad',
    userName: 'Dad Smith',
    userAvatar: '👨',
    text: 'Make sure it\'s not expired!',
    timestamp: new Date(Date.now() - 3000000),
  },
  {
    id: 'demo-comment-2',
    itemId: 'demo-item-4',
    userId: 'demo-sarah',
    userName: 'Sarah',
    userAvatar: '👧',
    text: 'Can we get the organic kind?',
    timestamp: new Date(Date.now() - 600000),
  },
];

const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'demo-chat-1',
    familyId: 'demo-family',
    userId: 'demo-mom',
    userName: 'Mom Smith',
    userAvatar: '👩',
    message: 'Hey everyone, I\'m heading to the store now!',
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: 'demo-chat-2',
    familyId: 'demo-family',
    userId: 'demo-dad',
    userName: 'Dad Smith',
    userAvatar: '👨',
    message: 'Great! Don\'t forget the items on the list',
    timestamp: new Date(Date.now() - 1700000),
  },
  {
    id: 'demo-chat-3',
    familyId: 'demo-family',
    userId: 'demo-sarah',
    userName: 'Sarah',
    userAvatar: '👧',
    message: 'Can you grab some ice cream too? 🍦',
    timestamp: new Date(Date.now() - 1600000),
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ 
        currentUser: null, 
        currentFamily: null,
        currentList: null,
        shoppingItems: [],
        chatMessages: [],
        itemComments: [],
        isDemoMode: false,
      }),
      
      isDemoMode: false,
      setDemoMode: (isDemo) => set({ isDemoMode: isDemo }),
      
      families: [],
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
        
        const user = get().currentUser;
        if (user) {
          const defaultList: ShoppingList = {
            id: uuidv4(),
            name: 'Groceries',
            familyId: newFamily.id,
            color: '#FFD500',
            icon: '🛒',
            createdBy: user.id,
            createdAt: new Date(),
            itemCount: 0,
          };
          
          set((state) => ({
            shoppingLists: [...state.shoppingLists, defaultList],
            currentList: defaultList,
          }));
        }
        
        return newFamily;
      },
      
      joinFamily: (inviteCode) => {
        const family = get().families.find(f => f.inviteCode === inviteCode);
        if (family && family.members.length < 5) {
          const currentUserId = get().currentUser?.id;
          if (currentUserId && !family.members.includes(currentUserId)) {
            family.members.push(currentUserId);
            set({ currentFamily: family });
            
            const existingList = get().shoppingLists.find(l => l.familyId === family.id);
            if (!existingList) {
              const defaultList: ShoppingList = {
                id: uuidv4(),
                name: 'Groceries',
                familyId: family.id,
                color: '#FFD500',
                icon: '🛒',
                createdBy: currentUserId,
                createdAt: new Date(),
                itemCount: 0,
              };
              
              set((state) => ({
                shoppingLists: [...state.shoppingLists, defaultList],
                currentList: defaultList,
              }));
            } else {
              set({ currentList: existingList });
            }
            
            return true;
          }
        }
        return false;
      },
      
      setupDemoFamily: () => {
        const user = get().currentUser;
        if (!user) return;
        
        let demoFamily = get().families.find(f => f.id === 'demo-family');
        if (!demoFamily) {
          demoFamily = { ...DEMO_FAMILY };
          set((state) => ({
            families: [...state.families, demoFamily!],
          }));
        }
        
        if (!demoFamily.members.includes(user.id)) {
          demoFamily.members.push(user.id);
        }
        
        set({ 
          currentFamily: demoFamily,
          isDemoMode: true,
        });
        
        const demoList: ShoppingList = {
          id: 'demo-list',
          name: 'Weekly Groceries',
          familyId: 'demo-family',
          color: '#FFD500',
          icon: '🛒',
          createdBy: 'demo-mom',
          createdAt: new Date(Date.now() - 86400000),
          itemCount: 4,
        };
        
        set((state) => ({
          shoppingLists: [demoList],
          currentList: demoList,
          shoppingItems: createDemoItems(demoList.id),
          itemComments: createDemoComments(),
          chatMessages: DEMO_CHAT_MESSAGES,
          mockUsers: DEMO_USERS,
        }));
      },
      
      selectFamily: (familyId) => {
        const family = get().families.find(f => f.id === familyId);
        set({ currentFamily: family || null });
      },
      
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
      
      shoppingItems: [],
      
      addShoppingItem: async (name, comment, image, quantity = 1, points) => {
        const user = get().currentUser;
        const currentList = get().currentList;
        if (!user || !currentList) return;
        
        const [category, tags] = await Promise.all([
          CategorizationService.categorizeItem(name),
          TaggingService.generateTags(name, comment)
        ]);
        
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
          category,
          tags,
          points,
        };
        
        const currentFamily = get().currentFamily;
        if (points && currentFamily) {
          const totalPointsToAdd = points * quantity;
          set((state) => ({
            families: state.families.map(family =>
              family.id === currentFamily.id
                ? { ...family, totalPoints: family.totalPoints + totalPointsToAdd }
                : family
            ),
            currentFamily: state.currentFamily
              ? { ...state.currentFamily, totalPoints: state.currentFamily.totalPoints + totalPointsToAdd }
              : null
          }));
        }
        
        set((state) => ({
          shoppingItems: [...state.shoppingItems, newItem],
          shoppingLists: state.shoppingLists.map(list =>
            list.id === currentList.id
              ? { ...list, itemCount: list.itemCount + 1 }
              : list
          ),
        }));
        
        if (get().isDemoMode && get().mockUsers.length > 0) {
          setTimeout(() => {
            const randomUser = get().mockUsers[Math.floor(Math.random() * get().mockUsers.length)];
          if (randomUser.id !== user.id) {
            const mockItems = ['Milk', 'Bread', 'Eggs', 'Cheese', 'Apples', 'Bananas'];
            const mockItemName = mockItems[Math.floor(Math.random() * mockItems.length)];
            
            (async () => {
              const mockComment = Math.random() > 0.5 ? 'Get the organic one!' : undefined;
              const [mockCategory, mockTags] = await Promise.all([
                CategorizationService.categorizeItem(mockItemName),
                TaggingService.generateTags(mockItemName, mockComment)
              ]);
              const mockItem: ShoppingItem = {
                id: uuidv4(),
                name: mockItemName,
                comment: mockComment,
                quantity: Math.floor(Math.random() * 3) + 1,
                addedBy: randomUser.id,
                addedByName: randomUser.name,
                addedByAvatar: randomUser.avatar,
                likedBy: Math.random() > 0.7 ? [get().mockUsers[Math.floor(Math.random() * get().mockUsers.length)].id] : [],
                checked: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                listId: currentList.id,
                category: mockCategory,
                tags: mockTags,
              };
              set((state) => ({
                shoppingItems: [...state.shoppingItems, mockItem],
                shoppingLists: state.shoppingLists.map(list =>
                  list.id === currentList.id
                    ? { ...list, itemCount: list.itemCount + 1 }
                    : list
                ),
              }));
              
              if (Math.random() > 0.6) {
                const commentUser = get().mockUsers.filter(u => u.id !== randomUser.id)[Math.floor(Math.random() * (get().mockUsers.length - 1))];
                const comments = [
                  "Don't forget to check the expiry date!",
                  "The brand on sale is just as good 👍",
                  "We already have some at home",
                  "Get 2, they're on special",
                  "Make sure it's the low-fat version"
                ];
                const mockComment: ItemComment = {
                  id: uuidv4(),
                  itemId: mockItem.id,
                  userId: commentUser.id,
                  userName: commentUser.name,
                  userAvatar: commentUser.avatar,
                  text: comments[Math.floor(Math.random() * comments.length)],
                  timestamp: new Date(),
                };
                set((state) => ({
                  itemComments: [...state.itemComments, mockComment],
                }));
              }
            })();
          }
        }, Math.random() * 10000 + 5000);
        }
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
      
      itemComments: [],
      
      addItemComment: (itemId, text) => {
        const newComment: ItemComment = {
          id: uuidv4(),
          itemId,
          text,
          userId: get().currentUser?.id || '',
          userName: get().currentUser?.name || '',
          userAvatar: get().currentUser?.avatar || '',
          timestamp: new Date(),
        };
        set((state) => ({
          itemComments: [...state.itemComments, newComment],
        }));
      },
      
      getItemComments: (itemId) => {
        return get().itemComments.filter(c => c.itemId === itemId);
      },
      
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
        
        if (get().isDemoMode && get().mockUsers.length > 0) {
          setTimeout(() => {
            const responses = [
              "Sounds good!",
              "I'll get that on my way home",
              "Do we need anything else?",
              "Got it! 👍",
              "Thanks for adding that to the list!",
            ];
            const otherUsers = get().mockUsers.filter(u => u.id !== user.id);
            if (otherUsers.length > 0) {
              const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
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
            }
          }, Math.random() * 3000 + 1000);
        }
      },
      
      mockUsers: [],
    }),
    {
      name: 'noname-shopping-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 