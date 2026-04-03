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
		// 1. Try to get and validate access token from Authorization header first
		const authHeader = req.headers.authorization;
		let decoded: JwtPayload | null = null;

		if (authHeader && authHeader.startsWith('Bearer ')) {
			const accessToken = authHeader.slice(7); // Remove 'Bearer ' prefix
			try {
				decoded = verifyAccessToken(accessToken) as JwtPayload;
				console.log('✅ Access token válido:', decoded.userId);
				req.user = decoded;
				return next();
			} catch (error) {
				console.log('⚠️ Access token expirado ou inválido, tentando refresh...');
				// Access token expirou, tentar refresh
			}
		}

		// 2. Access token não fornecido ou expirou, usar refresh token
		const refreshToken = req.cookies['refreshToken'];

		if (!refreshToken) {
			return res.status(401).json({ message: "Refresh token não fornecido" });
		}

		// Verify refresh token
		decoded = verifyRefreshToken(refreshToken) as JwtPayload;

		// Check if session exists and is not revoked
		const session = await prisma.session.findUnique({
			where: { refreshToken }
		});

		if (!session || session.isRevoked) {
			return res.status(401).json({ message: "Sessão inválida ou expirada" });
		}

		// Get user to include email in access token
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: { email: true }
		});

		if (!user) {
			return res.status(401).json({ message: "Usuário não encontrado" });
		}

		// Generate new access token
		const newAccessToken = signAccessToken({
			userId: decoded.userId,
			email: user.email
		});

		// Set new access token in Authorization header for the response
		res.set('Authorization', `Bearer ${newAccessToken}`);
		console.log('✅ Novo access token gerado para userId:', decoded.userId);
		
		req.user = decoded;
		next();
	} catch (error) {
		console.error('❌ Erro no middleware de auth:', error);
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