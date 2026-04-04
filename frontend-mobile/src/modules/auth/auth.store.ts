import { StorageAdapter } from '@/utils/storage.utils';
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
  onboardingCompleted: boolean;
  
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOnboardingCompleted: (completed: boolean) => void;
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
      onboardingCompleted: false,

      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
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
      storage: StorageAdapter,
      // ✅ Persistir usuário e status de onboarding, ignorando estados de loading/erro
      partialize: (state) => ({ 
        user: state.user,
        onboardingCompleted: state.onboardingCompleted
      } as AuthStore),
    }
  )
);
