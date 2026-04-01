import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { rbacService } from "./rbac.service.js";

export const roleGuard = (roleName: string) => {
	return async (req: AuthRequest, res: Response, next: NextFunction) => {
		const user = req.user;

		if (!user) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		try {
			const hasRole = await rbacService.hasRole(user.userId, roleName);
			if (!hasRole) {
				return res.status(403).json({ message: `Acesso negado: Papel necessário ${roleName}` });
			}
			next();
		} catch (error) {
			next(error);
		}
	};
};