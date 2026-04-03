import prisma from "../../config/prisma.js";
import type {
  IRole,
  IPermission,
  IRoleWithPermissions,
  ICreateRoleRequest,
  ICreatePermissionRequest,
} from "./roles.types.js";

export class RoleService {
  // ===== ROLES =====

  static async createRole(data: ICreateRoleRequest): Promise<IRole> {
    // Validar se o papel já existe
    const existingRole = await prisma.role.findUnique({
      where: { name: data.name },
    });

    if (existingRole) {
      throw new Error("Este papel já existe");
    }

    const role = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description || "",
      },
    });

    return role;
  }

  static async getAllRoles(): Promise<IRole[]> {
    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" },
    });

    return roles;
  }

  static async getRoleById(id: number): Promise<IRoleWithPermissions> {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new Error("Papel não encontrado");
    }

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.rolePermissions.map((rp) => rp.permission),
    };
  }

  static async updateRole(id: number, data: Partial<ICreateRoleRequest>): Promise<IRole> {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new Error("Papel não encontrado");
    }

    // Se está mudando o nome, validar duplicata
    if (data.name && data.name !== role.name) {
      const existing = await prisma.role.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        throw new Error("Um papel com este nome já existe");
      }
    }

    const updated = await prisma.role.update({
      where: { id },
      data: {
        name: data.name || role.name,
        description: data.description !== undefined ? data.description : role.description,
      },
    });

    return updated;
  }

  static async deleteRole(id: number): Promise<void> {
    const role = await prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new Error("Papel não encontrado");
    }

    // Não permitir deletar papel se houver usuários com este papel
    const usersWithRole = await prisma.userRole.count({
      where: { roleId: id },
    });

    if (usersWithRole > 0) {
      throw new Error("Não é possível deletar um papel que está atribuído a usuários");
    }

    await prisma.role.delete({
      where: { id },
    });
  }

  // ===== PERMISSIONS =====

  static async createPermission(data: ICreatePermissionRequest): Promise<IPermission> {
    const existingPermission = await prisma.permission.findUnique({
      where: { name: data.name },
    });

    if (existingPermission) {
      throw new Error("Esta permissão já existe");
    }

    const permission = await prisma.permission.create({
      data: {
        name: data.name,
        description: data.description || "",
      },
    });

    return permission;
  }

  static async getAllPermissions(): Promise<IPermission[]> {
    const permissions = await prisma.permission.findMany({
      orderBy: { name: "asc" },
    });

    return permissions;
  }

  static async getPermissionById(id: number): Promise<IPermission> {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new Error("Permissão não encontrada");
    }

    return permission;
  }

  static async updatePermission(id: number, data: Partial<ICreatePermissionRequest>): Promise<IPermission> {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new Error("Permissão não encontrada");
    }

    // Se está mudando o nome, validar duplicata
    if (data.name && data.name !== permission.name) {
      const existing = await prisma.permission.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        throw new Error("Uma permissão com este nome já existe");
      }
    }

    const updated = await prisma.permission.update({
      where: { id },
      data: {
        name: data.name || permission.name,
        description: data.description !== undefined ? data.description : permission.description,
      },
    });

    return updated;
  }

  static async deletePermission(id: number): Promise<void> {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new Error("Permissão não encontrada");
    }

    // Remover todas as associações desta permissão com papéis
    await prisma.rolePermission.deleteMany({
      where: { permissionId: id },
    });

    await prisma.permission.delete({
      where: { id },
    });
  }

  // ===== ROLE PERMISSIONS =====

  static async assignPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new Error("Papel não encontrado");
    }

    const permission = await prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new Error("Permissão não encontrada");
    }

    // Validar se já existe a associação
    const existing = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    if (existing) {
      throw new Error("Esta permissão já foi atribuída a este papel");
    }

    await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  static async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    const rolePermission = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    if (!rolePermission) {
      throw new Error("Esta permissão não está atribuída a este papel");
    }

    await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
  }

  static async getPermissionsByRole(roleId: number): Promise<IPermission[]> {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new Error("Papel não encontrado");
    }

    return role.rolePermissions.map((rp) => rp.permission);
  }

  // ===== USER ROLES =====

  static async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new Error("Papel não encontrado");
    }

    // Validar se já existe a associação
    const existing = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    if (existing) {
      throw new Error("Este papel já foi atribuído a este usuário");
    }

    await prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  static async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    const userRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });

    if (!userRole) {
      throw new Error("Este papel não está atribuído a este usuário");
    }

    await prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }

  static async getRolesByUser(userId: number): Promise<IRole[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user.userRoles.map((ur) => ur.role);
  }

  static async hasPermission(userId: number, permissionName: string): Promise<boolean> {
    const userWithRoles = await prisma.user.findUnique({
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

    if (!userWithRoles) {
      return false;
    }

    // Verificar se o usuário tem a permissão através de algum papel
    for (const userRole of userWithRoles.userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        if (rolePermission.permission.name === permissionName) {
          return true;
        }
      }
    }

    return false;
  }
}
