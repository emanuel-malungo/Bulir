import axios, { AxiosError } from 'axios';
import ENV from './env.utils';
import { useAuthStore } from '@/modules/auth/auth.store';

console.log('🔌 Aplicando baseURL na instância axios:', ENV.API_BASE_URL);

const api = axios.create({
	baseURL: ENV.API_BASE_URL,
	withCredentials: true,
	timeout: 30000, // 30 segundos globais para todas as requisições
	headers: {
		'Content-Type': 'application/json',
	},
});

// Track if refresh is in progress to avoid multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let lastAccessToken: string = '';

const onRefreshed = (token: string) => {
	lastAccessToken = token;
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
};

export const clearAccessToken = () => {
	lastAccessToken = '';
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
	refreshSubscribers.push(callback);
};

// ===== Request Interceptor - Add Access Token to headers =====
api.interceptors.request.use(
	(config) => {
		console.log('📤 [API-REQUEST] URL:', config.url);
		console.log('📤 [API-REQUEST] Método:', config.method?.toUpperCase());
		
		// Add the last received access token to the request
		if (lastAccessToken) {
			config.headers.Authorization = `Bearer ${lastAccessToken}`;
			console.log('🔑 [API-REQUEST] AccessToken adicionado ao header:', lastAccessToken.substring(0, 20) + '...');
		} else {
			console.log('⚠️ [API-REQUEST] Nenhum AccessToken disponível');
		}
		return config;
	},
	(error) => {
		console.error('❌ [API-REQUEST] Erro no interceptador de request:', error);
		return Promise.reject(error);
	}
);

// ===== Response Interceptor - Handle 401 and refresh token =====
api.interceptors.response.use(
	(response) => {
		console.log('✅ [API-RESPONSE] Response recebido');
		console.log('✅ [API-RESPONSE] Status:', response.status);
		console.log('✅ [API-RESPONSE] URL:', response.config.url);
		
		// Capture access token from response header if present
		const authHeader = response.headers['authorization'];
		console.log('📨 [API-RESPONSE] Authorization header presente:', !!authHeader);
		
		if (authHeader && authHeader.startsWith('Bearer ')) {
			lastAccessToken = authHeader.slice(7); // Remove 'Bearer ' prefix
			console.log('🔐 [API-RESPONSE] Novo AccessToken capturado:', lastAccessToken.substring(0, 20) + '...');
		}
		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as any;
		console.error('❌ [API-ERROR] Erro na requisição');
		console.error('❌ [API-ERROR] URL:', originalRequest?.url);
		console.error('❌ [API-ERROR] Status:', error.response?.status);
		console.error('❌ [API-ERROR] Mensagem:', (error.response?.data as any)?.error || error.message);

		// Se 401 e ainda não tentou refresh
		// NÃO fazer refresh em rotas de auth (login, register, refresh)
		if (error.response?.status === 401 && !originalRequest._retry) {
			const urlPath = originalRequest.url || '';
			const isAuthRoute = urlPath.endsWith('/auth/login') ||
				urlPath.endsWith('/auth/register') ||
				urlPath.endsWith('/auth/refresh');

			console.log('🔐 [API-ERROR] Status 401 detectado');
			console.log('🔐 [API-ERROR] É rota de auth:', isAuthRoute);

			// Se é rota de auth, apenas rejeitar o erro
			if (isAuthRoute) {
				console.error('🔐 [API-ERROR] Rota de auth falhou, rejeitando erro');
				return Promise.reject(error);
			}

			originalRequest._retry = true;
			console.log('🔄 [API-ERROR] Tentando refresh token...');

			if (isRefreshing) {
				console.log('🔄 [API-ERROR] Refresh já está em progresso, aguardando...');
				// Se já está fazendo refresh, espera e tenta novamente
				return new Promise((resolve) => {
					addRefreshSubscriber(() => {
						console.log('🔄 [API-ERROR] Refresh completado, retry da requisição original');
						resolve(api(originalRequest));
					});
				});
			}

			isRefreshing = true;

			try {
				console.log('🔑 [API-ERROR] Enviando refresh token para API...');
				// Refresh token em cookie é enviado automaticamente
				const response = await api.post('auth/refresh');

				// Access token é retornado no header Authorization
				const accessToken = response.headers['authorization']?.split(' ')[1];
				console.log('✅ [API-ERROR] Refresh token bem-sucedido');
				console.log('✅ [API-ERROR] Novo AccessToken:', accessToken?.substring(0, 20) + '...');

				isRefreshing = false;
				onRefreshed(accessToken || '');

				// Retry a requisição original
				console.log('🔄 [API-ERROR] Retry da requisição original com novo token');
				return api(originalRequest);
			} catch (refreshError) {
				console.error('❌ [API-ERROR] Refresh token falhou:', refreshError);
				// Refresh falhou - logout
				isRefreshing = false;
				console.log('🚪 [API-ERROR] Fazendo logout...');
				useAuthStore.getState().logout();

				// Redireciona para login se não estiver em ambiente SSR
				if (typeof window !== 'undefined') {
					console.log('🔄 [API-ERROR] Redirecionando para / (login)');
					window.location.href = '/';
				}

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default api;