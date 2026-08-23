# API de Cadastro

API simples com dois recursos:

- **Usuários**: nome, e-mail, senha (senha armazenada com hash bcrypt)
- **Clientes**: nome, endereço, telefone

## Stack

- Node.js >= 22
- TypeScript
- Fastify
- @fastify/swagger + @fastify/swagger-ui
- fastify-type-provider-zod
- Zod
- Prisma ORM (PostgreSQL)

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure a variável `DATABASE_URL` no arquivo `.env`:

   ```
   DATABASE_URL="postgresql://SEU_USUARIO_POSTGRES:SUA_SEHA_POSTGRES@localhost:5432/api-teste?schema=public"
   ```

3. Crie o banco `api-teste` no PostgreSQL (caso ainda não exista) e rode a migration do Prisma:

   ```bash
   npm run prisma:migrate
   ```

4. Suba o servidor em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse a documentação interativa (Swagger UI):

   ```
   http://localhost:3000/docs
   ```

## Endpoints

### Usuários

- `POST /users` — cadastrar usuário
- `GET /users` — listar usuários
- `GET /users/:id` — buscar usuário por id
- `PUT /users/:id` — atualizar usuário
- `DELETE /users/:id` — remover usuário

### Clientes

- `POST /clients` — cadastrar cliente
- `GET /clients` — listar clientes
- `GET /clients/:id` — buscar cliente por id
- `PUT /clients/:id` — atualizar cliente
- `DELETE /clients/:id` — remover cliente

## Build para produção

```bash
npm run build
npm start
```
