import { db } from './connection';

db.exec(`
  -- Usuários do sistema
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    email        TEXT    NOT NULL UNIQUE,
    password_hash TEXT   NOT NULL,
    role         TEXT    NOT NULL DEFAULT 'vendedor'
                         CHECK(role IN ('admin','vendedor','financeiro','estoque')),
    active       INTEGER NOT NULL DEFAULT 1,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
  );

  -- Produtos
  CREATE TABLE IF NOT EXISTS products (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    sku        TEXT    NOT NULL UNIQUE,
    category   TEXT    NOT NULL DEFAULT 'Geral',
    price      REAL    NOT NULL CHECK(price >= 0),
    stock      INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
    active     INTEGER NOT NULL DEFAULT 1,
    created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
  );

  -- Clientes (PF e PJ)
  CREATE TABLE IF NOT EXISTS customers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    doc_type   TEXT    NOT NULL CHECK(doc_type IN ('CPF','CNPJ')),
    doc_number TEXT    NOT NULL UNIQUE,
    email      TEXT,
    phone      TEXT,
    active     INTEGER NOT NULL DEFAULT 1,
    created_at TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
  );

  -- Vendas
  CREATE TABLE IF NOT EXISTS sales (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    user_id     INTEGER NOT NULL REFERENCES users(id),
    total       REAL    NOT NULL DEFAULT 0,
    status      TEXT    NOT NULL DEFAULT 'pendente'
                        CHECK(status IN ('pendente','pago','cancelado')),
    notes       TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
  );

  -- Itens da venda
  CREATE TABLE IF NOT EXISTS sale_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id    INTEGER NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL CHECK(quantity > 0),
    unit_price REAL    NOT NULL,
    subtotal   REAL    NOT NULL
  );

  -- Índices
  CREATE INDEX IF NOT EXISTS idx_sales_customer  ON sales(customer_id);
  CREATE INDEX IF NOT EXISTS idx_sales_status    ON sales(status);
  CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
`);

console.log('✅ Migração concluída — tabelas criadas.');
