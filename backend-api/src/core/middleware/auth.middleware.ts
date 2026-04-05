import type { Request, Response, NextFunction } from "express";
import { signAccessToken, verifyAccessToken, verifyRefreshToken } from "../../utils/jwt.utils.js";
import { rbacService } from "../rbac/rbac.service.js";
import type { PermissionCode } from "../rbac/permission.constants.js";
import prisma from "../../config/prisma.js";

export interface JwtPayload {
	userId: number;
	email: string;
	iat?: number;
	exp?: number;
}

export interface AuthRequest extends Request {
	user?: JwtPayload;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		console.log('🛡️ [AUTH-MIDDLEWARE] ===== VERIFICANDO AUTENTICAÇÃO =====');
		console.log('📍 [AUTH-MIDDLEWARE] Rota:', req.method, req.path);
		
		// 1. Try to get and validate access token from Authorization header first
		const authHeader = req.headers.authorization;
		console.log('📨 [AUTH-MIDDLEWARE] Authorization header presente:', !!authHeader);
		
		let decoded: JwtPayload | null = null;

		if (authHeader && authHeader.startsWith('Bearer ')) {
			const accessToken = authHeader.slice(7); // Remove 'Bearer ' prefix
			console.log('🔑 [AUTH-MIDDLEWARE] AccessToken encontrado:', accessToken.substring(0, 20) + '...');
			
			try {
				decoded = verifyAccessToken(accessToken) as JwtPayload;
				console.log('✅ [AUTH-MIDDLEWARE] AccessToken válido para userId:', decoded.userId);
				req.user = decoded;
				return next();
			} catch (error) {
				console.log('⚠️ [AUTH-MIDDLEWARE] AccessToken expirado ou inválido');
				console.log('📝 [AUTH-MIDDLEWARE] Erro ao validar:', error instanceof Error ? error.message : 'Desconhecido');
				// Access token expirou, tentar refresh
			}
		} else {
			console.log('⚠️ [AUTH-MIDDLEWARE] Nenhum AccessToken no header, tentando refresh token...');
		}

		// 2. Access token não fornecido ou expirou, usar refresh token
		const refreshToken = req.cookies['refreshToken'];
		console.log('🍪 [AUTH-MIDDLEWARE] RefreshToken cookie encontrado:', !!refreshToken);

		if (!refreshToken) {
			console.error('❌ [AUTH-MIDDLEWARE] ERRO: Nenhum token de autenticação disponível');
			return res.status(401).json({ message: "Refresh token não fornecido" });
		}

		// Verify refresh token
		decoded = verifyRefreshToken(refreshToken) as JwtPayload;
		console.log('✅ [AUTH-MIDDLEWARE] RefreshToken verificado para userId:', decoded.userId);

		// Check if session exists and is not revoked
		const session = await prisma.session.findUnique({
			where: { refreshToken }
		});
		
		console.log('🔍 [AUTH-MIDDLEWARE] Sessão encontrada:', !!session);
		if (session) {
			console.log('📋 [AUTH-MIDDLEWARE] Sessão revogada:', session.isRevoked);
		}

		if (!session || session.isRevoked) {
			console.error('❌ [AUTH-MIDDLEWARE] ERRO: Sessão inválida ou expirada');
			return res.status(401).json({ message: "Sessão inválida ou expirada" });
		}

		// Get user to include email in access token
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: { email: true }
		});
		
		console.log('👤 [AUTH-MIDDLEWARE] Usuário encontrado:', user?.email);

		if (!user) {
			console.error('❌ [AUTH-MIDDLEWARE] ERRO: Usuário não encontrado');
			return res.status(401).json({ message: "Usuário não encontrado" });
		}

		// Generate new access token
		const newAccessToken = signAccessToken({
			userId: decoded.userId,
			email: user.email
		});
		console.log('🔐 [AUTH-MIDDLEWARE] Novo AccessToken gerado:', newAccessToken.substring(0, 20) + '...');

		// Set new access token in Authorization header for the response
		res.set('Authorization', `Bearer ${newAccessToken}`);
		console.log('📤 [AUTH-MIDDLEWARE] Header Authorization setado no response');
		
		req.user = decoded;
		next();
	} catch (error) {
		console.error('❌ [AUTH-MIDDLEWARE] ERRO GERAL:', error);
		if (error instanceof Error) {
			if (error.message.includes('jwt')) {
				return res.status(401).json({ message: "Refresh token inválido ou expirado" });
			}
		}
		return res.status(401).json({ message: "Token não fornecido" });
	}
};

// Middleware para verificar permissão específica
export const requirePermission = (permission: PermissionCode) => {
	return async (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}

		const hasPermission = await rbacService.hasPermission(req.user.userId, permission);
		
		if (!hasPermission) {
			return res.status(403).json({ message: "Permissão insuficiente" });
		}

		next();
	};
};

// Middleware para verificar papel específico
export const requireRole = (roleName: string) => {
	return async (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user) {
			return res.status(401).json({ message: "Usuário não autenticado" });
		}

		const hasRole = await rbacService.hasRole(req.user.userId, roleName);
		
		if (!hasRole) {
			return res.status(403).json({ message: "Acesso restrito a este papel" });
		}

		next();
	};
};