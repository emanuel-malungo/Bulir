import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwt.utils.js";
import { rbacService } from "../rbac/rbac.service.js";
import type { PermissionCode } from "../rbac/permission.constants.js";

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
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Token não fornecido" });
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Token não fornecido" });
	}

	try {
		const decoded = verifyAccessToken(token) as JwtPayload;
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Token inválido ou expirado" });
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