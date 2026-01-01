import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface CurrencyPair {
  id: string;
  name: string;
  status: boolean;
  category: 'USDT' | 'Web3' | 'NFT';
  price: number;
  change: number;
  icon: string;
  description?: string;
}

interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Deposit {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

interface Trade {
  id: string;
  userId: string;
  userName: string;
  pair: string;
  type: 'up' | 'down';
  amount: number;
  profit: number;
  status: 'active' | 'completed' | 'failed';
  createdAt: string;
}

interface AdminState {
  isAuthenticated: boolean;
  currencyPairs: CurrencyPair[];
  withdrawals: Withdrawal[];
  deposits: Deposit[];
  trades: Trade[];
  
  // Actions
  login: (password: string) => boolean;
  logout: () => void;
  
  // User management (now syncs with authStore)
  getAllUsers: () => User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Currency management
  addCurrencyPair: (pair: Omit<CurrencyPair, 'id'>) => void;
  toggleCurrencyPair: (id: string) => void;
  deleteCurrencyPair: (id: string) => void;
  updateCurrencyPair: (id: string, updates: Partial<CurrencyPair>) => void;
  removeDuplicatePairs: () => void;
  
  // Withdrawal management
  addWithdrawal: (withdrawal: Omit<Withdrawal, 'id' | 'createdAt' | 'status'>) => void;
  updateWithdrawalStatus: (id: string, status: 'approved' | 'rejected') => void;
  
  // Deposit management
  addDeposit: (deposit: Omit<Deposit, 'id' | 'createdAt' | 'status'>) => void;
  updateDepositStatus: (id: string, status: 'confirmed' | 'rejected') => void;
  
  // Trade management
  addTrade: (trade: Omit<Trade, 'id' | 'createdAt' | 'status'>) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currencyPairs: [],
      withdrawals: [],
      deposits: [],
      trades: [],

      login: (password: string) => {
        const isValid = password === 'admin123'; // Change this to your secure password
        if (isValid) {
          set({ isAuthenticated: true });
        }
        return isValid;
      },

      logout: () => set({ isAuthenticated: false }),

      // Get all users from authStore
      getAllUsers: () => {
        return useAuthStore.getState().getAllUsers();
      },

      addUser: (user) => {
        const newUser = {
          name: user.name,
          email: user.email,
          password: 'default123', // Default password for admin-created users
        };
        // Add to authStore
        useAuthStore.getState().registerUser(newUser);
      },

      updateUser: (id, updates) => {
        // Only support balance updates for now
        if (updates.balance !== undefined) {
          useAuthStore.getState().updateUserBalance(id, updates.balance);
        }
      },

      deleteUser: (id) => {
        // Get current users from localStorage
        const users = useAuthStore.getState().getAllUsers();
        const updatedUsers = users.filter((user) => user.id !== id);
        // Save back to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('toptrades-users', JSON.stringify(updatedUsers));
        }
      },

      addCurrencyPair: (pair) =>
        set((state) => {
          // Check if pair with same name already exists
          const exists = state.currencyPairs.some(p => p.name === pair.name);
          if (exists) {
            console.warn(`Currency pair ${pair.name} already exists, skipping...`);
            return state;
          }
          
          return {
            currencyPairs: [
              ...state.currencyPairs,
              {
                ...pair,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              },
            ],
          };
        }),

      updateCurrencyPair: (id, updates) =>
        set((state) => ({
          currencyPairs: state.currencyPairs.map((pair) =>
            pair.id === id ? { ...pair, ...updates } : pair
          ),
        })),

      toggleCurrencyPair: (id) =>
        set((state) => ({
          currencyPairs: state.currencyPairs.map((pair) =>
            pair.id === id ? { ...pair, status: !pair.status } : pair
          ),
        })),

      deleteCurrencyPair: (id) =>
        set((state) => ({
          currencyPairs: state.currencyPairs.filter((pair) => pair.id !== id),
        })),

      removeDuplicatePairs: () =>
        set((state) => {
          const seen = new Map<string, CurrencyPair>();
          const uniquePairs: CurrencyPair[] = [];
          
          // Keep only the first occurrence of each pair name
          state.currencyPairs.forEach(pair => {
            if (!seen.has(pair.name)) {
              seen.set(pair.name, pair);
              uniquePairs.push(pair);
            }
          });
          
          if (uniquePairs.length < state.currencyPairs.length) {
            console.log(`Removed ${state.currencyPairs.length - uniquePairs.length} duplicate currency pairs`);
          }
          
          return { currencyPairs: uniquePairs };
        }),

      addWithdrawal: (withdrawal) =>
        set((state) => {
          const newWithdrawal = {
            ...withdrawal,
            id: Date.now().toString(),
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
          };
          console.log('AdminStore: Adding withdrawal', newWithdrawal);
          return {
            withdrawals: [...state.withdrawals, newWithdrawal],
          };
        }),

      updateWithdrawalStatus: (id, status) =>
        set((state) => {
          const withdrawal = state.withdrawals.find(w => w.id === id);
          if (withdrawal && status === 'approved') {
            // Update user balance in authStore
            const authStore = useAuthStore.getState();
            const users = authStore.getAllUsers();
            const user = users.find(u => u.id === withdrawal.userId);
            if (user) {
              authStore.updateUserBalance(withdrawal.userId, (user.balance || 0) - withdrawal.amount);
            }
          }
          return {
            withdrawals: state.withdrawals.map((w) =>
              w.id === id ? { ...w, status } : w
            ),
          };
        }),

      addDeposit: (deposit) =>
        set((state) => {
          const newDeposit = {
            ...deposit,
            id: Date.now().toString(),
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
          };
          console.log('AdminStore: Adding deposit', newDeposit);
          console.log('Current deposits:', state.deposits.length);
          return {
            deposits: [...state.deposits, newDeposit],
          };
        }),

      updateDepositStatus: (id, status) =>
        set((state) => {
          const deposit = state.deposits.find(d => d.id === id);
          if (deposit && status === 'confirmed') {
            // Update user balance in authStore
            const authStore = useAuthStore.getState();
            const users = authStore.getAllUsers();
            const user = users.find(u => u.id === deposit.userId);
            if (user) {
              authStore.updateUserBalance(deposit.userId, (user.balance || 0) + deposit.amount);
            }
          }
          return {
            deposits: state.deposits.map((d) =>
              d.id === id ? { ...d, status } : d
            ),
          };
        }),

      addTrade: (trade) =>
        set((state) => {
          const newTrade = {
            ...trade,
            id: Date.now().toString(),
            status: 'active' as const,
            createdAt: new Date().toISOString(),
          };
          console.log('AdminStore: Adding trade', newTrade);
          return {
            trades: [...state.trades, newTrade],
          };
        }),

      updateTrade: (id, updates) =>
        set((state) => ({
          trades: state.trades.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
    }),
    {
      name: 'admin-storage',
      version: 2, // Increment this to clear old cache
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        // Don't persist currency pairs - always load from database
        currencyPairs: [],
        withdrawals: state.withdrawals,
        deposits: state.deposits,
        trades: state.trades,
      }),
    }
  )
);
