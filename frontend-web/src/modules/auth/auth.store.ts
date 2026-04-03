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
  walletBalance?: number; // Saldo da carteira sincronizado
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  syncWalletBalance: (balance: number) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  checkAuth: () => Promise<void>;
  isCheckingAuth: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isCheckingAuth: true,
      error: null,

      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      syncWalletBalance: (balance) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, walletBalance: balance } });
        }
      },
      
      
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

      checkAuth: async () => {
        const { user } = get();
        if (!user) {
          set({ isCheckingAuth: false });
          return;
        }

        try {
          // Import dynamic para evitar dependência circular
          const { AuthService } = await import('./auth.services');
          const updatedUser = await AuthService.verifySession();
          if (updatedUser) {
            set({ user: updatedUser });
          }
        } catch (error) {
          console.error('Falha na verificação de sessão:', error);
          // O interceptor já trata o logout em caso de 401, 
          // mas por segurança limpamos se falhar aqui também
          set({ user: null });
        } finally {
          set({ isCheckingAuth: false });
        }
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
      // ✅ Apenas persistir o usuário, ignorando estados de loading/erro
      partialize: (state) => ({ 
        user: state.user 
      } as AuthStore),
    }
  )
);
