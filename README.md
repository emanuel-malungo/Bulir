# Bulir Platform

A Bulir é uma plataforma inovadora para conexão entre prestadores de serviços e clientes, desenvolvida com foco em performance, escalabilidade e uma experiência de usuário premium.

Este repositório contém o ecossistema completo da plataforma:
- **`backend-api`**: API RESTful construída com Express, TypeScript e Prisma.
- **`frontend-web`**: Dashboard Web construído com Next.js (Admin, Cliente e Provedor).
- **`frontend-mobile`**: Aplicação móvel (React Native/Expo).

---API RESTful construída com NestJS e Prisma

## 🛠️ Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (ou Docker para rodar uma instância local)

---

## 🚀 Setup do Projeto

### 1. Clonar o projeto e instalar dependências
```bash
# Clone o repositório e entre na pasta
git clone <url-do-repositorio>
cd repo-bulir

# Instalar dependências de todos os módulos
cd backend-api && npm install
cd ../frontend-web && npm install
```

### 2. Configurar o Backend (`backend-api`)
1. Crie um arquivo `.env` na pasta `backend-api` (use o `.env.example` como base):
   ```bash
   cp .env.example .env
   ```
2. Configure a `DATABASE_URL` (PostgreSQL) e as chaves de `JWT`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bulir_db"
   JWT_SECRET="sua_chave_secreta"
   JWT_REFRESH_SECRET="sua_chave_secreta_refresh"
   ```
3. Execute as migrações do banco de dados e o **seed** (dados iniciais):
   ```bash
   # Rodar migrações
   npm run db:migrate
   
   # Popular o banco com dados (Admin, Roles, Categorias)
   npm run seed
   ```
4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *A API ficará disponível em: `http://localhost:4000/api`*

### 3. Configurar o Frontend Web (`frontend-web`)
1. Crie um arquivo `.env.local` na pasta `frontend-web`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4000/api"
   ```
2. Inicie o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O dashboard ficará disponível em: `http://localhost:3000`*

---

## 🔐 Credenciais de Acesso (DADOS DO SEED)

Após executar o comando de seed, você poderá utilizar as seguintes contas para testes:

| Cargo (Role) | E-mail | Senha |
|---|---|---|
| **Super Admin** | `admin@bulir.com` | `AdminBulir123!` |
| **Cliente** | `cliente@bulir.com` | `Cliente123!` |
| **Provedor** | `provedor@bulir.com` | `Provedor123!` |

*Nota: Todas as senhas do seed seguem o padrão mencionado.*

---

## 📦 Tecnologias Utilizadas

### Backend
- **[Express](https://expressjs.com/)**: Framework para Node.js rápido e minimalista.
- **[Prisma](https://www.prisma.io/)**: ORM de última geração para Node.js e TypeScript.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para JavaScript.
- **[Zod](https://zod.dev/)**: Validação de esquema com foco em TypeScript.
- **[JWT](https://jwt.io/)**: Autenticação segura via tokens.

### Frontend
- **[Next.js](https://nextjs.org/)**: Framework React com renderização híbrida.
- **[Tailwind CSS](https://tailwindcss.com/)**: Estilização via classes utilitárias modernas.
- **[React Hook Form](https://react-hook-form.com/)**: Gerenciamento de formulários performático.
- **[Axios](https://axios-http.com/)**: Cliente HTTP para integrações com a API.

---

## 🎯 Estrutura de Pastas

```text
repo-bulir/
├── backend-api/        # Lógica de negócio, banco de dados e autenticação
├── frontend-web/       # Interface Web (Painel Admin, Cliente e Provedor)
├── frontend-mobile/    # Aplicação para dispositivos móveis
└── README.md           # Documentação do projeto
```

---

## 📄 Licença

Este projeto é de uso exclusivo da plataforma **Bulir**. Todos os direitos reservados.
