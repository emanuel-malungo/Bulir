import 'dotenv/config';
import prisma from '../src/config/prisma.js';
import { hashPassword } from '../src/utils/hash.utils.js';
import { PERMISSIONS } from '../src/core/rbac/permission.constants.js';

// Dados para preencher o banco
const SEED_DATA = {
  permissions: Object.values(PERMISSIONS),
  roles: [
    {
      name: 'SUPER_ADMIN',
      description: 'Super administrador da plataforma com acesso total'
    },
    {
      name: 'PROVIDER',
      description: 'Provedor de serviços'
    },
    {
      name: 'CLIENT',
      description: 'Cliente da plataforma'
    }
  ],
  users: [
    {
      fullName: 'Admin da Plataforma',
      email: 'admin@bulir.com',
      nif: '12345678901',
      password: 'AdminBulir123!',
      role: 'SUPER_ADMIN'
    },
    {
      fullName: 'Emanuel Gaspar - Provedor',
      email: 'emanuel.provider@bulir.com',
      nif: '98765432101',
      password: 'Provider123!',
      role: 'PROVIDER'
    },
    {
      fullName: 'Emanuel Malungo - Cliente',
      email: 'emanuel.client@bulir.com',
      nif: '55544433322',
      password: 'Client123!',
      role: 'CLIENT'
    },
  ]
};

// Mapear permissões para cada papel
function getPermissionsByRole(roleName: string): string[] {
  const rolePermissions: Record<string, string[]> = {
    SUPER_ADMIN: Object.values(PERMISSIONS),
    PROVIDER: [
      PERMISSIONS.USER_VIEW_PROFILE,
      PERMISSIONS.USER_UPDATE_PROFILE,
      PERMISSIONS.SERVICE_VIEW,
      PERMISSIONS.SERVICE_CREATE,
      PERMISSIONS.SERVICE_UPDATE,
      PERMISSIONS.SERVICE_DELETE,
      PERMISSIONS.SERVICE_PUBLISH,
      PERMISSIONS.SERVICE_UNPUBLISH,
      PERMISSIONS.RESERVATION_VIEW_OWN,
      PERMISSIONS.RESERVATION_VIEW_ALL,
      PERMISSIONS.RESERVATION_UPDATE,
      PERMISSIONS.RESERVATION_CONFIRM,
      PERMISSIONS.BALANCE_VIEW,
      PERMISSIONS.BALANCE_WITHDRAW,
      PERMISSIONS.TRANSACTION_VIEW
    ],
    CLIENT: [
      PERMISSIONS.USER_VIEW_PROFILE,
      PERMISSIONS.USER_UPDATE_PROFILE,
      PERMISSIONS.SERVICE_VIEW,
      PERMISSIONS.RESERVATION_VIEW_OWN,
      PERMISSIONS.RESERVATION_CREATE,
      PERMISSIONS.RESERVATION_UPDATE,
      PERMISSIONS.RESERVATION_CANCEL,
      PERMISSIONS.BALANCE_VIEW,
      PERMISSIONS.TRANSACTION_VIEW
    ]
  };

  return rolePermissions[roleName] || [];
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  try {
    // Criar permissões
    console.log('📝 Criando permissões...');
    const createdPermissions = [];
    
    for (const permissionName of SEED_DATA.permissions) {
      const permission = await prisma.permission.upsert({
        where: { name: permissionName },
        update: {},
        create: {
          name: permissionName,
          description: `Permissão: ${permissionName}`
        }
      });
      createdPermissions.push(permission);
    }
    console.log(`✅ ${createdPermissions.length} permissões criadas/atualizadas\n`);

    // Criar papéis
    console.log('👥 Criando papéis...');
    const createdRoles: Record<string, any> = {};
    
    for (const roleData of SEED_DATA.roles) {
      const role = await prisma.role.upsert({
        where: { name: roleData.name },
        update: { description: roleData.description },
        create: roleData,
        include: { rolePermissions: true }
      });
      createdRoles[roleData.name] = role;
      console.log(`  ✓ Papel \"${roleData.name}\" criado`);
    }
    console.log();

    // Atribuir permissões aos papéis
    console.log('🔐 Atribuindo permissões aos papéis...');
    
    for (const [roleName, role] of Object.entries(createdRoles)) {
      const permissionsForRole = getPermissionsByRole(roleName);
      
      // Remover permissões antigas
      await prisma.rolePermission.deleteMany({
        where: { roleId: role.id }
      });

      // Adicionar novas permissões
      for (const permissionName of permissionsForRole) {
        const permission = await prisma.permission.findUnique({
          where: { name: permissionName }
        });

        if (permission) {
          await prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId: permission.id
            }
          });
        }
      }
      
      console.log(`  ✓ ${permissionsForRole.length} permissões atribuídas ao papel \"${roleName}\"`);
    }
    console.log();

    // Criar usuários
    console.log('👤 Criando usuários...');
    const createdUsers = [];
    
    for (const userData of SEED_DATA.users) {
      // Verificar se usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`  ⚠️  Usuário ${userData.email} já existe, pulando...`);
        continue;
      }

      // Criptografar senha
      const passwordHash = await hashPassword(userData.password);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          fullName: userData.fullName,
          email: userData.email,
          nif: userData.nif,
          passwordHash,
          isActive: true
        }
      });

      // Atribuir papel ao usuário
      const role = createdRoles[userData.role];
      if (role) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id
          }
        });
        console.log(`  ✓ ${userData.fullName} (${userData.role}) criado`);
      }

      createdUsers.push({
        ...user,
        role: userData.role,
        password: userData.password
      });
    }
    console.log();

    // Exibir resumo
    console.log('✨ Seed concluído com sucesso!\n');
    console.log('📋 Resumo:');
    console.log(`  • ${createdPermissions.length} permissões`);
    console.log(`  • ${Object.keys(createdRoles).length} papéis`);
    console.log(`  • ${createdUsers.length} usuários criados\n`);

    console.log('🔑 Credenciais dos usuários criados:');
    createdUsers.forEach((user) => {
      console.log(`\n  ${user.fullName} (${user.role})`);
      console.log(`    Email: ${user.email}`);
      console.log(`    NIF: ${user.nif}`);
      console.log(`    Senha: ${user.password}`);
    });

    console.log('\n✅ Você pode usar essas credenciais para fazer login\n');

  } catch (error) {
    console.error('❌ Erro ao criar seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
