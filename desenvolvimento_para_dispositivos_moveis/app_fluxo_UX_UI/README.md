# EasyGest — Documentação de Arquitetura

Stack: **Ionic Angular** (mobile híbrido) + **Node.js + TypeScript + Express + SQLite** (backend)

---

## Estrutura do monorepo

```
easygest/
├── easygest-api/          ← Backend TypeScript
├── easygest-app/          ← Frontend Ionic Angular
└── README.md
```

## Setup rápido

```bash
# Clonar / criar pasta raiz
mkdir easygest && cd easygest

# --- Backend ---
cd easygest-api
npm install
cp .env.example .env        # edite JWT_SECRET
npm run migrate             # cria tabelas SQLite
npm run seed                # dados iniciais
npm run dev                 # http://localhost:3000

# --- Frontend (em outro terminal) ---
cd easygest-app
npm install
ionic serve                 # browser (dev)
ionic cap run android       # emulador Android
ionic cap run ios           # simulador iOS
```

## Arquitetura geral

```
┌──────────────────────────────────────┐
│  Ionic Angular (Capacitor)           │
│  ┌─────────┐  ┌──────────────────┐   │
│  │ Pages   │  │ Services (HTTP)  │   │
│  │ login   │  │ auth.service     │   │
│  │ dash    │  │ product.service  │   │
│  │ sales   │  │ customer.service │   │
│  │ finance │  │ sale.service     │   │
│  └─────────┘  └──────────────────┘   │
│         ↕ HttpClient + JWT           │
└──────────────────────────────────────┘
         ↕ REST API (JSON)
┌──────────────────────────────────────┐
│  Express + TypeScript                │
│  ┌───────────┐  ┌─────────────────┐  │
│  │ Routes    │  │ Services        │  │
│  │ /auth     │  │ bcrypt + JWT    │  │
│  │ /products │  │ better-sqlite3  │  │
│  │ /customers│  │ SQL puro        │  │
│  │ /sales    │  └─────────────────┘  │
│  │ /financial│         ↕             │
│  └───────────┘  ┌─────────────────┐  │
│                 │ SQLite (arquivo) │  │
│                 │ data/easygest.db │  │
│                 └─────────────────┘  │
└──────────────────────────────────────┘
```
