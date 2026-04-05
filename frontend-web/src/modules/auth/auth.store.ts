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

      setUser: (user) => {
        console.log('👤 [STORE] Atualizando usuário:', user ? user.email : 'null');
        set({ user, error: null });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => {
        if (error) console.error('❌ [STORE] Erro:', error);
        set({ error });
      },
      syncWalletBalance: (balance) => {
        const { user } = get();
        if (user) {
          console.log('💰 [STORE] Sincronizando saldo da carteira:', balance);
          set({ user: { ...user, walletBalance: balance } });
        }
      },
      
      
      logout: () => {
        console.log('🚪 [STORE] Executando logout');
        set({ user: null, error: null });
      },
      
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
        console.log('🔍 [STORE] ===== VERIFICANDO AUTENTICAÇÃO =====');
        console.log('👤 [STORE] Usuário no store:', user ? user.email : 'NENHUM');
        console.log('🔐 [STORE] isCheckingAuth começando...');
        
        if (!user) {
          console.log('⚠️ [STORE] Nenhum usuário no store, pulando verificação');
          set({ isCheckingAuth: false });
          return;
        }

        try {
          console.log('🔄 [STORE] Chamando AuthService.verifySession()...');
          // Import dynamic para evitar dependência circular
          const { AuthService } = await import('./auth.services');
          const updatedUser = await AuthService.verifySession();
          
          if (updatedUser) {
            console.log('✅ [STORE] Sessão válida!');
            console.log('👤 [STORE] Usuário verificado:', updatedUser.email);
            console.log('🎫 [STORE] Role:', updatedUser.role);
            console.log('🔐 [STORE] Permissões:', updatedUser.permissions?.length || 0);
            set({ user: updatedUser });
          } else {
            console.warn('⚠️ [STORE] Sessão válida mas usuário vazio');
          }
        } catch (error) {
          console.error('❌ [STORE] ERRO AO VERIFICAR SESSÃO:', error);
          console.error('❌ [STORE] Erro detalhado:', error instanceof Error ? error.message : 'Desconhecido');
          // O interceptor já trata o logout em caso de 401, 
          // mas por segurança limpamos se falhar aqui também
          console.log('🚪 [STORE] Limpando user do store (logout por segurança)');
          set({ user: null });
        } finally {
          console.log('✅ [STORE] isCheckingAuth finalizado');
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
