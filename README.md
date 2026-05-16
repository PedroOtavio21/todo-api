# Todo API

Aplicação fullstack de gerenciamento de tarefas (To-Do List) desenvolvida como desafio técnico para vaga. Cobre todos os requisitos obrigatórios do MVP e inclui os diferenciais de autenticação JWT, validação de dados com Zod e filtros de listagem.

---

## Funcionalidades

- Cadastro e autenticação de usuários via JWT
- Senhas armazenadas com hash bcrypt
- Criação, listagem, busca, edição e exclusão de tarefas
- Marcar tarefa como concluída e desmarcar
- Filtro de tarefas por status (todas, pendentes, concluídas)
- Tarefas isoladas por usuário — cada usuário vê apenas as próprias tarefas
- Validação de dados no backend (Zod) e no frontend (Zod)
- Tratamento centralizado de erros com mensagens claras

---

## Arquitetura

### Backend

```
backend/
├── src/
│   ├── controllers/   # Recebe requisições HTTP, valida o body com Zod e chama a Service
│   ├── services/      # Regras de negócio
│   ├── repositories/  # Acesso ao banco via Prisma
│   ├── middlewares/   # Autenticação JWT e error handler global
│   ├── models/        # Interfaces TypeScript das entidades (Task, User)
│   ├── routes/        # Definição de rotas e instanciação de dependências
│   ├── errors/        # Classe HttpError para erros tratados
│   ├── lib/           # Instância singleton do PrismaClient
│   └── index.ts       # Entry point — configura Express e sobe o servidor
└── prisma/
    ├── schema.prisma  # Models Task, User e enum Status
    └── migrations/    # Histórico de migrações do banco
```

**Fluxo de uma requisição:**
```
Request → Route → Middleware (JWT) → Controller (Zod) → Service → Repository → PostgreSQL
```

### Frontend

```
frontend/
└── src/
    ├── api/           # Instância Axios e funções de chamada à API
    ├── components/    # Componentes reutilizáveis (TaskCard, Navbar, Button, Input...)
    ├── contexts/      # AuthContext — armazena token e dados do usuário
    ├── hooks/         # useAuth
    ├── pages/         # Uma pasta por página
    ├── routes/        # AppRouter e PrivateRoute
    ├── types/         # Interfaces Task e User
    └── validators/    # Schemas Zod dos formulários
```

---

## Stack

### Backend

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| Banco de dados | PostgreSQL |
| Autenticação | JWT (`jsonwebtoken`) |
| Hash de senha | `bcryptjs` |
| Validação | Zod |
| Dev runner | `tsx watch` |

### Frontend

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Estilização | Tailwind CSS 4 |
| Roteamento | React Router DOM 7 |
| Cliente HTTP | Axios |
| Validação | Zod |
| Build | Vite 8 |

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

### Backend

> Todas as rotas de tarefas exigem o header `Authorization: Bearer <token>`.

#### Autenticação — `/api/v1`

**`POST /register`** — Cadastrar usuário

```json
// Body
{
  "email": "joao@email.com",
  "password": "minhasenha123",
  "name": "João Silva"
}

// Resposta 201
{
  "id": 1,
  "email": "joao@email.com",
  "name": "João Silva",
  "createdAt": "2026-05-13T00:00:00.000Z",
  "updatedAt": "2026-05-13T00:00:00.000Z"
}
```

**`POST /login`** — Autenticar usuário

```json
// Body
{
  "email": "joao@email.com",
  "password": "minhasenha123"
}

// Resposta 200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "joao@email.com",
    "name": "João Silva",
    "createdAt": "2026-05-13T00:00:00.000Z",
    "updatedAt": "2026-05-13T00:00:00.000Z"
  }
}
```

#### Tarefas — `/api/v1/tasks`

**`GET /tasks`** — Listar tarefas do usuário autenticado

Parâmetro opcional: `?status=PENDING` ou `?status=DONE`

```json
// Resposta 200
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

**`POST /tasks`** — Criar tarefa

> `description` é opcional. `status` é sempre `PENDING` na criação.

```json
// Body
{
  "title": "Estudar TypeScript",
  "description": "Revisar generics e utility types"
}

// Resposta 201
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

**`GET /tasks/:id`** — Buscar tarefa por ID

```json
// Resposta 200
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

**`PUT /tasks/:id`** — Atualizar tarefa (todos os campos são opcionais)

```json
// Body
{
  "title": "Estudar TypeScript avançado",
  "description": "Focar em decorators",
  "status": "DONE"
}

// Resposta 200 — retorna a tarefa atualizada
```

**`DELETE /tasks/:id`** — Remover tarefa

```
Resposta 204 No Content
```

#### Status de erro

| Status | Situação |
|---|---|
| `400` | Dados inválidos (Zod) ou regra de negócio violada |
| `401` | Token ausente, inválido ou expirado |
| `404` | Recurso não encontrado |
| `409` | Conflito — e-mail já cadastrado |
| `500` | Erro interno do servidor |

---

### Frontend

| Rota | Página | Autenticação |
|---|---|---|
| `/login` | Tela de entrada com formulário de login | Pública |
| `/register` | Cadastro de novo usuário | Pública |
| `/tasks` | Lista de tarefas com filtro por status | Protegida |
| `/tasks/new` | Formulário de criação de tarefa | Protegida |
| `/tasks/:id` | Detalhes de uma tarefa | Protegida |
| `/tasks/:id/edit` | Edição de uma tarefa | Protegida |

> Rotas protegidas redirecionam para `/login` se o token estiver ausente ou expirado.

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) rodando localmente

### Backend

**1. Acesse a pasta e instale as dependências**

```bash
cd backend
npm install
```

**2. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/todo_api"
JWT_SECRET="sua_chave_secreta_longa_aqui"
JWT_EXPIRES_IN="7d"
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

**3. Gere o client Prisma e execute as migrações**

```bash
npx prisma generate
npx prisma migrate deploy
```

**4. Inicie o servidor**

```bash
npm run dev       # desenvolvimento com hot reload
npm run build     # compila para produção
npm start         # inicia o build compilado
```

O servidor estará disponível em `http://localhost:3000`.

---

### Frontend

**1. Acesse a pasta e instale as dependências**

```bash
cd frontend
npm install
```

**2. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

**3. Inicie o servidor de desenvolvimento**

```bash
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # build de produção na pasta dist/
npm run preview   # visualiza o build localmente
```

---

## Scripts

### Backend

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia com hot reload via `tsx watch` |
| `npm run build` | Compila TypeScript para `build/` |
| `npm start` | Inicia o servidor a partir do build |

### Frontend

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Visualiza o build localmente |
| `npm run lint` | Executa o ESLint |