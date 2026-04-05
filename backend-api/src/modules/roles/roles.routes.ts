import { Router } from "express";
import { RoleController } from "./roles.controller.js";
import { authMiddleware, requirePermission } from "../../core/middleware/auth.middleware.js";
import { PERMISSIONS } from "../../core/rbac/permission.constants.js";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// ===== ROLES =====
// Listar todos os papéis (Admin only via permission)
router.get("/", requirePermission(PERMISSIONS.ROLE_VIEW), RoleController.getAllRoles);

// Criar novo papel
router.post("/", RoleController.createRole);

// Obter papel por ID (com permissões)
router.get("/:id", RoleController.getRoleById);

// Atualizar papel
router.patch("/:id", RoleController.updateRole);

// Deletar papel
router.delete("/:id", RoleController.deleteRole);

// ===== PERMISSIONS =====
// Listar todas as permissões
router.get("/permissions", RoleController.getAllPermissions);

// Criar nova permissão
router.post("/permissions", RoleController.createPermission);

// Obter permissão por ID
router.get("/permissions/:id", RoleController.getPermissionById);

// Atualizar permissão
router.patch("/permissions/:id", RoleController.updatePermission);

// Deletar permissão
router.delete("/permissions/:id", RoleController.deletePermission);

// ===== ROLE PERMISSIONS =====
// Atribuir permissão a papel
router.post("/:id/permissions", RoleController.assignPermissionToRole);

// Remover permissão de papel
router.delete("/:id/permissions", RoleController.removePermissionFromRole);

// Listar permissões de um papel
router.get("/:id/permissions", RoleController.getPermissionsByRole);

// ===== USER ROLES =====
// Atribuir papel a usuário
router.post("/users/roles", RoleController.assignRoleToUser);

// Remover papel de usuário
router.delete("/users/roles", RoleController.removeRoleFromUser);

// Listar papéis de um usuário
router.get("/users/:id/roles", RoleController.getRolesByUser);

export default router;
