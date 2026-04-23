# Mentis Tech — Backend (MVP)

Este diretório contém a implementação do backend do MVP Mentis Tech (Node.js, Express, TypeScript, PostgreSQL). O objetivo é ser simples, bem documentado e fácil de evoluir.

Resumo do que está implementado nesta entrega

- Autenticação com JWT (access token + refresh token com rotação)
- Controle de acesso por papéis (`funcionario`, `psicologo`, `gestor`, `admin`)
- LGPD: aceite obrigatório armazenado em `usuario` (`aceitou_lgpd`, `data_aceite`)
- Questionário dinâmico (estrutura em JSON) — listar, responder, histórico
- Swagger UI disponível em `/docs`
- Migrations e seeds com Knex
- Docker + docker-compose com Postgres

Arquitetura e organização

- `src/` - código TypeScript da aplicação
  - `app.ts` - configuração do Express
  - `server.ts` - bootstrap
  - `routes/` - rotas organizadas por versão (`/api/v1`)
  - `controllers/` - controllers (entrada dos endpoints)
  - `services/` - lógica de negócio (autenticação, questionário)
  - `repositories/` - acesso ao banco (Knex)
  - `middlewares/` - autenticação, autorização, LGPD, validação, erro
  - `db/` - wrapper do Knex
  - `docs/` - spec OpenAPI para Swagger

Banco de dados (ERD)
As tabelas do banco seguem o ERD solicitado e foram criadas nas migrations:

- `empresa` — empresas clientes
- `usuario` — usuários (contém `aceitou_lgpd` e `data_aceite`)
- `conversa_ia`, `mensagem` — modelagem para chat IA (não funcional nesta entrega)
- `questionario`, `resposta_questionario` — questionnaires e respostas (histórico)
- `alerta`, `insight` — modelagem prevista (não funcional nesta entrega)

IMPORTANTE: foi adicionada uma tabela auxiliar `refresh_token` para suportar rotação e revogação de refresh tokens. A modelagem ERD principal foi preservada.

Como rodar localmente (development)

1. Criar variáveis de ambiente

2. Instale dependências:
   ```bash
   npm install
   ```
3. Rode Postgres (recomendado via Docker Compose):
   ```bash
   cd server
   docker-compose up -d db
   ```
4. Rode migrations e seed:
   ```bash
   npm run migrate
   npm run seed
   ```
5. Inicie em modo desenvolvimento:
   ```bash
   npm run dev
   ```

Rodando com Docker (API + Postgres)

1. No diretório `server`:
   ```bash
   docker-compose up --build
   ```
2. O serviço da API ficará exposto em `http://localhost:4000` e o Swagger em `http://localhost:4000/docs`

Scripts úteis

- `npm run dev` — start em TypeScript com reload
- `npm run build` — compila TypeScript em `dist/`
- `npm start` — executa `dist/server.js`
- `npm run migrate` — aplica migrations
- `npm run seed` — executa seed inicial
- `npm run migrate-and-seed` — rodar migrations e seeds

Endpoints principais (versão /api/v1)

- `POST /api/v1/auth/login` — body: `{ email, password }` → `{ accessToken, refreshToken, user }`
- `POST /api/v1/auth/refresh` — body: `{ refreshToken }` → `{ accessToken, refreshToken }` (rotação)
- `POST /api/v1/auth/logout` — body: `{ refreshToken }` → revoga refresh token
- `GET /api/v1/auth/me` — retorna usuário logado (Bearer token)
- `GET /api/v1/lgpd/status` — retorna status de aceite (Bearer token)
- `POST /api/v1/lgpd/accept` — aceita termos (Bearer token)
- `GET /api/v1/questionnaires` — lista questionários (Bearer token)
- `GET /api/v1/questionnaires/:id` — obtém estrutura JSON do questionário
- `POST /api/v1/questionnaires/:id/response` — responde questionário (Bearer token, papel `funcionario`, LGPD aceito)
- `GET /api/v1/questionnaires/responses/history` — histórico de respostas do usuário (Bearer token)

Autenticação (fluxo)

- Login: front envia `email` e `password`. O backend retorna `accessToken` (curta duração) e `refreshToken` (opaco).
- Refresh: front envia `refreshToken` em `POST /auth/refresh`. O backend revoga o refresh antigo e emite novos `accessToken` + `refreshToken`.
- Logout: revoga o `refreshToken` no servidor.

LGPD (fluxo)

- Todo usuário tem campo `aceitou_lgpd` em `usuario`.
- Usuários sem aceite não podem acessar rotas protegidas marcadas com middleware LGPD (por exemplo submeter questionário).
- Rota `POST /api/v1/lgpd/accept` registra `aceitou_lgpd=true` e `data_aceite`.

Questionário dinâmico

- Estrutura JSON armazenada em `questionario.estrutura_json` com seções e perguntas.
- Ao enviar respostas, o backend computa pontuações por domínio (estresse, ansiedade, burnout, depressão), calcula `pontuacao_total` e `classificacao_geral`, e salva em `resposta_questionario`.

Swagger

- A documentação OpenAPI está disponível em `/docs` com descrições de endpoints e exemplos básicos.

Observações para o front-end

- Envie `Authorization: Bearer <accessToken>` para endpoints protegidos.
- Use `refreshToken` no fluxo de renovação; o refresh token é opaco — guarde-o com segurança (cookie httpOnly recomendado).
- Verifique LGPD antes de permitir ações protegidas no cliente.
