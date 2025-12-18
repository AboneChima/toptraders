import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (user: Omit<User, 'id' | 'balance' | 'status' | 'createdAt'>) => Promise<boolean>;
  updateUserBalance: (userId: string, balance: number) => void;
  getAllUsers: () => User[];
}

// Direct localStorage functions
const USERS_KEY = 'toptrades-users';
const AUTH_KEY = 'toptrades-auth';

const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getAuth = (): { user: User | null; isAuthenticated: boolean } => {
  if (typeof window === 'undefined') return { user: null, isAuthenticated: false };
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : { user: null, isAuthenticated: false };
};

const saveAuth = (user: User | null, isAuthenticated: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify({ user, isAuthenticated }));
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    // Try API login first
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user } = await response.json();
        const authUser = {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          password: '', // Don't store password
          balance: user.balance,
          status: user.status as 'active' | 'inactive',
          createdAt: user.createdAt,
        };
        set({ user: authUser, isAuthenticated: true });
        saveAuth(authUser, true);
        return true;
      }
    } catch (error) {
      console.log('API login failed, trying localStorage');
    }

    // Fallback to localStorage
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      set({ user, isAuthenticated: true });
      saveAuth(user, true);
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
    saveAuth(null, false);
  },
  
  registerUser: async (userData) => {
    // Try API registration first
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const { user } = await response.json();
        const authUser = {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          password: '', // Don't store password
          balance: user.balance,
          status: user.status as 'active' | 'inactive',
          createdAt: user.createdAt,
        };
        set({ user: authUser, isAuthenticated: true });
        saveAuth(authUser, true);
        return true;
      }
    } catch (error) {
      console.log('API registration failed, using localStorage');
    }

    // Fallback to localStorage
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return false;
    }
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      balance: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Auto login
    set({ user: newUser, isAuthenticated: true });
    saveAuth(newUser, true);
    
    return true;
  },
  
  updateUserBalance: (userId: string, balance: number) => {
    const users = getUsers();
    const updatedUsers = users.map(u => u.id === userId ? { ...u, balance } : u);
    saveUsers(updatedUsers);
    
    const state = get();
    if (state.user?.id.toString() === userId.toString()) {
      const updatedUser = { ...state.user, balance };
      set({ user: updatedUser });
      saveAuth(updatedUser, true);
    }
  },
  
  getAllUsers: () => {
    return getUsers();
  },
}));

// Initialize from localStorage on load and refresh balance from database
if (typeof window !== 'undefined') {
  const auth = getAuth();
  if (auth.user && auth.isAuthenticated) {
    useAuthStore.setState({ user: auth.user, isAuthenticated: auth.isAuthenticated });
    
    // Refresh balance from database
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.users) {
          const currentUser = data.users.find((u: any) => u.id.toString() === auth.user?.id.toString());
          if (currentUser) {
            const updatedUser = { ...auth.user, balance: currentUser.balance };
            useAuthStore.setState({ user: updatedUser });
            saveAuth(updatedUser, true);
          }
        }
      })
      .catch(err => console.log('Failed to refresh balance:', err));
  }
}
