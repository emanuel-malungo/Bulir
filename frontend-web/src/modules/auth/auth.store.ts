import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  nif: string;
  isActive: boolean;
  createdAt: Date;
  role?: string;
  roleId?: number;
  permissions?: string[];
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      logout: () => set({ user: null, error: null }),
      
      isAuthenticated: () => !!get().user,
      
      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
      },
      
      hasRole: (role: string) => {
        const { user } = get();
        if (!user || !user.role) return false;
        return user.role === role;
      },
    }),
    {
      name: 'auth-store',
      storage: {
        getItem: (name) => {
          // Use sessionStorage to persist across page reloads but clear on browser close
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
