import prisma  from "../../config/prisma.js";
import type { PermissionCode } from "./permission.constants.js";

export class RbacService {
	async hasPermission(userId: number, permissionCode: PermissionCode): Promise<boolean> {
		const userWithPermissions = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				userRoles: {
					include: {
						role: {
							include: {
								rolePermissions: {
									include: {
										permission: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!userWithPermissions) return false;

		return userWithPermissions.userRoles.some((userRole) =>
			userRole.role.rolePermissions.some(
				(rp) => rp.permission.name === permissionCode
			)
		);
	}

	async hasRole(userId: number, roleName: string): Promise<boolean> {
		const userWithRoles = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				userRoles: {
					include: {
						role: true,
					},
				},
			},
		});

		if (!userWithRoles) return false;

		return userWithRoles.userRoles.some((ur) => ur.role.name === roleName);
	}

	async getUserPermissions(userId: number): Promise<PermissionCode[]> {
		const userWithPermissions = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				userRoles: {
					include: {
						role: {
							include: {
								rolePermissions: {
									include: {
										permission: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!userWithPermissions) return [];

		const permissions = new Set<PermissionCode>();
		userWithPermissions.userRoles.forEach((ur) => {
			ur.role.rolePermissions.forEach((rp) => {
				permissions.add(rp.permission.name as PermissionCode);
			});
		});

		return Array.from(permissions);
	}
}

export const rbacService = new RbacService();