import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const rbacGuard = (handler: (req: AuthRequest) => Promise<boolean> | boolean) => {
	return async (req: AuthRequest, res: Response, next: NextFunction) => {
		try {
			const isAuthorized = await handler(req);
			if (!isAuthorized) {
				return res.status(403).json({ message: "Acesso negado pela política RBAC" });
			}
			next();
		} catch (error) {
			next(error);
		}
	};
};