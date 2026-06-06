# EasyGest — Guia de Setup e Estrutura Completa

## Árvore de arquivos

```
easygest/
│
├── README.md
│
├── easygest-api/                          ← Backend Node.js + TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example                       → copie para .env e edite
│   ├── data/
│   │   └── easygest.db                    ← criado automaticamente
│   └── src/
│       ├── server.ts                      ← entry point
│       ├── types/
│       │   └── index.ts                   ← todas as interfaces e DTOs
│       ├── database/
│       │   ├── connection.ts              ← singleton better-sqlite3
│       │   ├── migrate.ts                 ← cria as tabelas (npm run migrate)
│       │   └── seed.ts                    ← dados iniciais (npm run seed)
│       ├── middleware/
│       │   ├── auth.middleware.ts         ← verifica JWT + roleGuard()
│       │   └── error.middleware.ts        ← handler global de erros
│       └── modules/
│           ├── auth/
│           │   ├── auth.service.ts        ← bcrypt + JWT
│           │   ├── auth.controller.ts
│           │   └── auth.routes.ts         ← POST /auth/login, GET /auth/me
│           ├── products/
│           │   ├── products.service.ts    ← CRUD + decrementStock()
│           │   └── products.routes.ts     ← GET/POST/PUT/DELETE /products
│           ├── customers/
│           │   └── customers.routes.ts    ← GET/POST/PUT/DELETE /customers
│           ├── users/
│           │   └── users.routes.ts        ← GET/POST/PUT/DELETE /users (admin only)
│           ├── sales/
│           │   └── sales.routes.ts        ← POST /sales (transação atômica)
│           └── financial/
│               └── financial.routes.ts    ← GET /financial/summary + /boleto/:id
│
└── easygest-app/                          ← Frontend Ionic Angular
    ├── package.json
    ├── capacitor.config.ts
    ├── src/
    │   ├── environments/
    │   │   ├── environment.ts             ← apiUrl: 'http://localhost:3000'
    │   │   └── environment.prod.ts        ← apiUrl: 'https://sua-api.com'
    │   └── app/
    │       ├── app.module.ts              ← providers: HTTP, Storage, Interceptor
    │       ├── app-routing.module.ts      ← /login + /tabs (lazy load)
    │       ├── app.component.ts
    │       ├── core/
    │       │   ├── models/
    │       │   │   └── index.ts           ← User, Product, Customer, Sale, DTOs, CartItem
    │       │   ├── services/
    │       │   │   ├── api.service.ts     ← get/post/put/patch/delete com tratamento de erro
    │       │   │   ├── auth.service.ts    ← login/logout, Signal<User>, getToken()
    │       │   │   └── services.ts        ← Products, Customers, Users, Sales, Financial, Cart
    │       │   ├── interceptors/
    │       │   │   └── auth.interceptor.ts← injeta Bearer token em toda requisição
    │       │   └── guards/
    │       │       └── auth.guard.ts      ← redireciona para /login se não autenticado
    │       └── pages/
    │           ├── login/
    │           │   ├── login.page.ts
    │           │   └── login.module.ts
    │           ├── tabs/
    │           │   └── tabs.module.ts     ← shell com ion-tab-bar
    │           ├── dashboard/
    │           │   └── dashboard.page.ts  ← métricas + vendas recentes
    │           ├── sales/
    │           │   └── sales.page.ts      ← grid de produtos + carrinho
    │           ├── financial/
    │           │   └── financial.page.ts  ← resumo + boleto
    │           └── cadastros/
    │               ├── cadastros.page.ts  ← menu
    │               ├── products/
    │               │   ├── product-list.page.ts
    │               │   └── product-form.page.ts  ← serve para criar E editar
    │               ├── customers/
    │               │   ├── customer-list.page.ts  ← mesma estrutura de products
    │               │   └── customer-form.page.ts  ← select CPF/CNPJ muda máscara
    │               └── users/
    │                   ├── user-list.page.ts      ← só visível para admin
    │                   └── user-form.page.ts
```

---

## 1 — Instalar dependências globais (uma vez)

```bash
npm install -g @ionic/cli @angular/cli
```

---

## 2 — Backend

```bash
cd easygest-api

npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env: troque JWT_SECRET por uma string forte

# Criar tabelas e popular dados iniciais
npm run migrate
npm run seed

# Iniciar servidor de desenvolvimento (hot reload)
npm run dev
# → http://localhost:3000
```

### Endpoints disponíveis

| Método | Rota                       | Auth     | Descrição                          |
|--------|---------------------------|----------|------------------------------------|
| POST   | /auth/login               | ❌ público| Login — retorna JWT                |
| GET    | /auth/me                  | ✅ token | Usuário logado                     |
| GET    | /products                 | ✅ token | Lista produtos ativos              |
| POST   | /products                 | admin/estoque | Cadastrar produto            |
| PUT    | /products/:id             | admin/estoque | Atualizar produto            |
| DELETE | /products/:id             | admin    | Desativar produto (soft delete)    |
| GET    | /customers                | ✅ token | Lista clientes                     |
| POST   | /customers                | ✅ token | Cadastrar cliente (CPF ou CNPJ)   |
| GET    | /sales                    | ✅ token | Lista vendas com itens             |
| POST   | /sales                    | ✅ token | Criar venda (transação atômica)   |
| PATCH  | /sales/:id/status         | ✅ token | Mudar status (pendente/pago)       |
| GET    | /financial/summary        | admin/financeiro | Totais consolidados       |
| GET    | /financial/boleto/:saleId | admin/financeiro | Gerar dados do boleto     |

---

## 3 — Frontend

```bash
cd easygest-app

npm install

# Desenvolvimento no browser
ionic serve
# → http://localhost:8100

# Sincronizar com Capacitor (após qualquer build)
npm run cap:sync

# Rodar no dispositivo/emulador Android
npm run cap:android

# Rodar no simulador iOS (só em macOS com Xcode)
npm run cap:ios
```

---

## 4 — Deploy em produção

```bash
# Backend — build TypeScript
cd easygest-api
npm run build
# Servir com PM2: pm2 start dist/server.js --name easygest-api

# Frontend — build para web (PWA ou WebView do Capacitor)
cd easygest-app
ionic build --prod
# Para Android: npx cap copy android && npx cap open android
# Para iOS:     npx cap copy ios     && npx cap open ios
```

**Para mobile no app de produção**, atualize `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.seudominio.com.br',
};
```

---

## 5 — Padrões do projeto

### Backend — convenções

- Cada módulo tem `service` (lógica + SQL) + `routes` (HTTP)
- SQL é escrito com `better-sqlite3` puro (sem ORM) — mais transparente
- Todas as gravações críticas usam `db.transaction()` — atômicas
- Soft delete em todos os recursos (campo `active = 0`)
- Senhas sempre com `bcryptjs` (10 rounds)
- JWT com expiração em 7 dias (`JWT_EXPIRES_IN`)

### Frontend — convenções

- `ApiService` centraliza todo acesso HTTP
- `AuthInterceptor` injeta o token automaticamente
- `CartService` usa `signal()` do Angular 17 — reativo sem RxJS
- Lazy loading em todas as rotas (melhor performance no mobile)
- `ion-item-sliding` para swipe de exclusão nas listas
- `ion-fab-button` para o botão de criar novo item
- Formulários com `ReactiveFormsModule` + `Validators`

### Estrutura para páginas novas (padrão)

Ao criar uma nova funcionalidade, siga:
```
pages/
└── nova-funcionalidade/
    ├── nova-funcionalidade-list.page.ts   ← ion-list com sliding
    ├── nova-funcionalidade-form.page.ts   ← formulário reativo (cria e edita)
    └── nova-funcionalidade.module.ts      ← declara as duas pages + routing
```

---

## 6 — Credenciais de desenvolvimento

| Usuário           | E-mail                 | Senha      | Perfil      |
|-------------------|------------------------|-----------|-------------|
| Admin Silva        | admin@empresa.com       | admin123  | admin        |
| Maria Santos       | maria@empresa.com       | senha123  | vendedor     |
| Carlos Finanças    | carlos@empresa.com      | financas1 | financeiro   |
