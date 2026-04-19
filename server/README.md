Mentis Tech — Backend (MVP)

Este repositório contém o backend do MVP da plataforma Mentis Tech. O objetivo desta entrega é fornecer uma API backend organizada, segura e documentada cobrindo:

- Autenticação (login com email/senha + JWT)
- Controle de acesso por papéis (RBAC)
- Aceite obrigatório dos termos LGPD (registro com data/hora)
- Fluxo de questionário de funcionário (respostas e níveis calculados)

Stack

- Node.js 20 (alpine) + TypeScript
- Express.js
- PostgreSQL em container Docker (compose)
- JWT (`jsonwebtoken`)

Visão geral das mudanças

- Backend empacotado em container: `server/Dockerfile` (multi-stage)
- Compose unificado na raiz: `docker-compose.yml` (services: `mentis-db`, `backend`)
- Arquivo de ambiente para containers: `server/.env.docker`
- Ajuste de conexão DB em `server/src/config/db.ts` (usa `DATABASE_URL` ou `DB_HOST=mentis-db`)
- Validações e tratamento de erros fortalecidos nas controllers

Estrutura relevante do projeto (resumida)

```
server/
	src/
		config/
		controllers/
		routes/
		services/
		repositories/
		middlewares/
		db/
			migrations/
	Dockerfile
	.env.docker
	package.json
docker-compose.yml (raiz)
```

Variáveis de ambiente essenciais (usar `server/.env.docker` no Docker)

- `DB_HOST` — host do Postgres no compose (mentis-db)
- `DB_PORT` — 5432
- `DB_USER` — postgres
- `DB_PASSWORD` — postgres
- `DB_NAME` — mentis
- `DATABASE_URL` — opcional (se preferir connection string)
- `JWT_SECRET` — segredo para assinar tokens (alterar em produção)
- `JWT_EXPIRES_IN` — tempo de expiração do JWT (ex: `7d`)
- `PORT` — porta do backend (4000 em containers)

Como rodar (desenvolvimento com Docker)

1. Na raiz do repositório, suba os containers (Postgres + backend):

```bash
docker compose up --build
```

2. (Opcional) Rode migrations manualmente dentro do container:

```bash
docker compose exec backend npm run migrate
```

3. (Opcional) Rode seed para criar dados de exemplo:

```bash
docker compose exec backend npm run seed
```

4. Parar e remover containers e volumes:

```bash
docker compose down -v
```

Endpoints principais

Autenticação

- `POST /api/auth/register` — criar usuário (dev/seed). Body: `{ name, email, password, role?, empresa_id? }`.
- `POST /api/auth/login` — login. Body: `{ email, password }`. Retorna `{ token, user }`.
- `GET /api/auth/me` — retorna usuário atual (require Authorization header).

LGPD

- `POST /api/lgpd/accept` — grava aceite e timestamp. Requer Authorization.
- `GET /api/lgpd/status` — retorna estado do aceite.

Questionário

- `GET /api/questionnaire/` — lista questionários (requer LGPD aceito).
- `POST /api/questionnaire/submit` — submete respostas: `{ questionario_id, answers }`.
  - `answers` = array de `{ questionId, domain: 'stress'|'anxiety'|'burnout'|'depression', value: number (1-5) }`.
- `GET /api/questionnaire/history` — histórico do usuário.

Manual testing (cenários mínimos)

1. Login com sucesso

```http
POST /api/auth/login
Content-Type: application/json

{ "email":"admin@mentis.test","password":"admin123" }
```

Resposta esperada: 200

```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "email": "admin@mentis.test",
    "role": "admin",
    "lgpd_accepted": true
  }
}
```

2. Login com credenciais erradas

Request igual ao anterior com senha inválida.

Resposta esperada: 401

```json
{ "message": "Invalid credentials" }
```

3. Acessar rota protegida sem token

Request: `GET /api/questionnaire/` sem header Authorization.

Resposta esperada: 401 `{ "message": "Token missing" }`

4. Acessar rota protegida sem aceitar LGPD

- Login com usuário de teste `funcionario@mentis.test` (seed: lgpd_accepted=false).
- `GET /api/questionnaire/` com token válido.

Resposta esperada: 403 `{ "message":"LGPD terms must be accepted before using this resource" }`

5. Aceitar LGPD com sucesso

```http
POST /api/lgpd/accept
Authorization: Bearer <token>
```

Resposta esperada: 200 — usuário atualizado com `lgpd_accepted: true` e `lgpd_accepted_at`.

6. Submissão do questionário com sucesso

```http
POST /api/questionnaire/submit
Authorization: Bearer <token>
Content-Type: application/json

{
	"questionario_id":"<uuid>",
	"answers":[{"questionId":"q1","domain":"stress","value":4}, {"questionId":"q2","domain":"anxiety","value":2}]
}
```

Resposta esperada: 201 com `record` que inclui `stress_level`, `anxiety_level`, `burnout_level`, `depression_level`.

7. Submissão inválida do questionário (value fora do intervalo)

Resposta esperada: 400 `{ "message": "Each answer value must be a number between 1 and 5" }`

Observações técnicas e próximos passos

- O código segue separação `routes -> controllers -> services -> repositories` para facilitar manutenção e testes futuros.
- Recomenda-se:
  - Restringir criação de usuários (endpoint `register`) a admins ou fluxo de convite.
  - Implementar refresh tokens e revogação.
  - Harden secrets (usar secret manager em produção).
  - Adicionar testes automáticos e CI.

Arquivo de migrations: `server/db/migrations/001_init.sql` contém esquema inicial.
