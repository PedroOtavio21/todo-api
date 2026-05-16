# Todo API

API REST para gerenciamento de tarefas (To-Do List) construída com Node.js, Express, TypeScript, Prisma e PostgreSQL. O projeto cobre todos os requisitos obrigatórios do MVP e inclui os diferenciais de autenticação JWT e criptografia de senhas com bcrypt.

---

## Funcionalidades

- Criação, listagem, busca, edição e exclusão de tarefas
- Autenticação de usuários via JWT (registro e login)
- Senhas armazenadas com hash bcrypt
- Validação de dados com Zod
- Tratamento centralizado de erros
- Tarefas isoladas por usuário (cada usuário vê apenas as próprias tarefas)

---

## Arquitetura

O projeto segue uma arquitetura em camadas, separando responsabilidades de forma clara e facilitando a manutenção:

```
src/
├── controllers/      # Recebe as requisições HTTP, valida o body com Zod e chama a Service
├── services/         # Contém as regras de negócio (ex: impede criar tarefa já como DONE)
├── repositories/     # Camada de acesso ao banco via Prisma
├── middlewares/      # auth-middleware (JWT) e error-handler global
├── models/           # Tipos TypeScript das entidades (Task, User)
├── routes/           # Definição das rotas e instanciação das dependências
├── errors/           # Classe HttpError para erros esperados
├── lib/              # Instância singleton do PrismaClient
└── index.ts          # Entry point: configura o Express e sobe o servidor
prisma/
├── schema.prisma     # Definição dos models (Task, User) e enum Status
└── migrations/       # Histórico de migrações do banco
```

**Fluxo de uma requisição:**
```
Request → Route → Middleware (auth) → Controller (validação Zod) → Service (regra de negócio) → Repository (Prisma) → PostgreSQL
```

**Stack:**
| Camada | Tecnologia |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework HTTP | Express 5 |
| ORM | Prisma 7 (com adapter `@prisma/adapter-pg`) |
| Banco de dados | PostgreSQL |
| Autenticação | JWT (`jsonwebtoken`) |
| Hash de senha | `bcryptjs` |
| Validação | Zod |
| Dev runner | `tsx watch` |

---

## Modelo de dados

### User
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Int (PK) | Identificador auto-incrementado |
| `email` | String (unique) | E-mail do usuário |
| `name` | String? | Nome opcional |
| `password` | String | Senha hasheada com bcrypt |
| `createdAt` | DateTime | Data de criação |
| `updatedAt` | DateTime | Data da última atualização |

### Task
| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Int (PK) | Identificador auto-incrementado |
| `title` | String | Título da tarefa |
| `description` | String? | Descrição opcional |
| `status` | Enum (`PENDING` \| `DONE`) | Status da tarefa, padrão `PENDING` |
| `userId` | Int (FK) | Referência ao usuário dono da tarefa |
| `createdAt` | DateTime | Data de criação |
| `updatedAt` | DateTime | Data da última atualização |

---

## Documentação das rotas

> Todas as rotas de tarefas exigem o header `Authorization: Bearer <token>`.

### Autenticação — `/api/v1`

#### `POST /register` — Cadastrar usuário

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "minhasenha123",
  "name": "João Silva"
}
```

**Resposta `201 Created`:**
```json
{
  "id": 1,
  "email": "joao@email.com",
  "name": "João Silva",
  "createdAt": "2026-05-13T00:00:00.000Z",
  "updatedAt": "2026-05-13T00:00:00.000Z"
}
```

---

#### `POST /login` — Autenticar usuário

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

**Resposta `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Tarefas — `/api/v1/tasks` (requer autenticação)

#### `GET /tasks` — Listar todas as tarefas do usuário autenticado

**Resposta `200 OK`:**
```json
[
  {
    "id": 1,
    "title": "Estudar TypeScript",
    "description": "Revisar generics e utility types",
    "status": "PENDING",
    "userId": 1,
    "createdAt": "2026-05-13T00:00:00.000Z",
    "updatedAt": "2026-05-13T00:00:00.000Z"
  }
]
```

---

#### `POST /tasks` — Criar uma tarefa

**Body:**
```json
{
  "title": "Estudar TypeScript",
  "description": "Revisar generics e utility types",
  "status": "PENDING"
}
```
> `description` e `status` são opcionais. `status` padrão é `PENDING`. Não é possível criar uma tarefa já com status `DONE`.

**Resposta `201 Created`:**
```json
{
  "id": 1,
  "title": "Estudar TypeScript",
  "description": "Revisar generics e utility types",
  "status": "PENDING",
  "userId": 1,
  "createdAt": "2026-05-13T00:00:00.000Z",
  "updatedAt": "2026-05-13T00:00:00.000Z"
}
```

---

#### `GET /tasks/:id` — Buscar tarefa por ID

**Resposta `200 OK`:**
```json
{
  "id": 1,
  "title": "Estudar TypeScript",
  "description": "Revisar generics e utility types",
  "status": "PENDING",
  "userId": 1,
  "createdAt": "2026-05-13T00:00:00.000Z",
  "updatedAt": "2026-05-13T00:00:00.000Z"
}
```

> Retorna `404` se a tarefa não existir ou não pertencer ao usuário autenticado.

---

#### `PUT /tasks/:id` — Atualizar uma tarefa

**Body (todos os campos são opcionais):**
```json
{
  "title": "Estudar TypeScript avançado",
  "description": "Focar em decorators",
  "status": "DONE"
}
```

**Resposta `200 OK`:** retorna a tarefa atualizada.

---

#### `DELETE /tasks/:id` — Remover uma tarefa

**Resposta `204 No Content`** — sem body.

> Retorna `404` se a tarefa não existir ou não pertencer ao usuário autenticado.

---

### Erros comuns

| Status | Situação |
|---|---|
| `400` | Dados inválidos (Zod) ou regra de negócio violada |
| `401` | Token ausente, inválido ou expirado |
| `404` | Recurso não encontrado |
| `409` | Conflito — e-mail já cadastrado |
| `500` | Erro interno do servidor |

---

## Como executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) rodando localmente ou em um serviço (ex: Railway, Supabase, Render)

### 1. Clone o repositório e acesse a pasta

```bash
git clone <url-do-repositorio>
cd todo-api-develop/backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com os seus dados:

```bash
cp .env.example .env
```

Edite o `.env` com as informações do seu banco e do JWT:

```env
# URL de conexão com o PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

# Chave secreta para assinar os tokens JWT (use uma string longa e aleatória)
JWT_SECRET="sua_chave_secreta_aqui"

# Tempo de expiração do token (opcional, padrão: 7d)
JWT_EXPIRES_IN="7d"

# Porta do servidor (opcional, padrão: 3000)
PORT=3000
```

### 4. Gere o cliente Prisma

```bash
npx prisma generate
```

### 5. Execute as migrações no banco

```bash
npx prisma migrate deploy
```

> Durante o desenvolvimento, você pode usar `npx prisma migrate dev` para criar e aplicar migrações novas.

### 6. Inicie o servidor

**Modo desenvolvimento** (com hot reload):
```bash
npm run dev
```

**Modo produção:**
```bash
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3000` (ou na porta configurada no `.env`).

---

## Frontend

Interface web construída em React que consome a API REST do backend.

| Camada | Tecnologia |
|---|---|
| Framework | React.js + TypeScript |
| Estilização | Tailwind CSS |
| Roteamento | React Router DOM |
| Cliente HTTP | Axios |
| Validação | Zod |

### Instalação

```bash
cd todo-api-develop/frontend
npm install
```

### Variáveis de ambiente

Crie um `.env` na pasta `frontend/` baseado no `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento em `http://localhost:5173` |
| `npm run build` | Gera o build de produção na pasta `dist/` |
| `npm run preview` | Visualiza o build de produção localmente |

### Páginas

| Rota | Descrição | Autenticação |
|---|---|---|
| `/login` | Tela de entrada com formulário de login | Pública |
| `/register` | Cadastro de novo usuário | Pública |
| `/tasks` | Lista de tarefas com filtro por status | Protegida |
| `/tasks/new` | Formulário de criação de tarefa | Protegida |
| `/tasks/:id` | Detalhes de uma tarefa | Protegida |
| `/tasks/:id/edit` | Edição de uma tarefa | Protegida |
