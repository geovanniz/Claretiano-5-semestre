import bcrypt from 'bcryptjs';
import { db } from './connection';

// Garante tabelas existam antes do seed
import './migrate';

const users = [
  { name: 'Admin Silva',    email: 'admin@empresa.com',  password: 'admin123',  role: 'admin'      },
  { name: 'Maria Santos',   email: 'maria@empresa.com',  password: 'senha123',  role: 'vendedor'   },
  { name: 'Carlos Finanças',email: 'carlos@empresa.com', password: 'financas1', role: 'financeiro' },
];

const products = [
  { name: 'Notebook Dell 15"',   sku: 'NB-001', category: 'Eletrônicos', price: 2499.90, stock: 15 },
  { name: 'Mouse Logitech MX3',  sku: 'MS-002', category: 'Periféricos', price: 89.90,   stock: 43 },
  { name: 'Cadeira Gamer Pro',   sku: 'CG-003', category: 'Móveis',      price: 799.90,  stock: 8  },
  { name: 'Monitor Samsung 24"', sku: 'MN-004', category: 'Eletrônicos', price: 1199.90, stock: 12 },
  { name: 'Teclado Mecânico K2', sku: 'TC-005', category: 'Periféricos', price: 349.90,  stock: 25 },
  { name: 'Headset HyperX',      sku: 'HS-006', category: 'Áudio',       price: 299.90,  stock: 18 },
];

const customers = [
  { name: 'João da Silva',      doc_type: 'CPF',  doc_number: '123.456.789-00',     email: 'joao@email.com',    phone: '(11) 98765-4321' },
  { name: 'Tech Solutions Ltda',doc_type: 'CNPJ', doc_number: '12.345.678/0001-99', email: 'contato@tech.com',  phone: '(11) 3456-7890'  },
  { name: 'Ana Oliveira',       doc_type: 'CPF',  doc_number: '987.654.321-00',     email: 'ana@email.com',     phone: '(21) 99876-5432' },
];

// Transação atômica
const seed = db.transaction(() => {
  // Limpa dados anteriores (ordem importa: foreign keys)
  db.exec('DELETE FROM sale_items; DELETE FROM sales; DELETE FROM customers; DELETE FROM products; DELETE FROM users;');

  const insertUser = db.prepare(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`
  );
  for (const u of users) {
    const hash = bcrypt.hashSync(u.password, 10);
    insertUser.run(u.name, u.email, hash, u.role);
  }

  const insertProduct = db.prepare(
    `INSERT INTO products (name, sku, category, price, stock) VALUES (?, ?, ?, ?, ?)`
  );
  for (const p of products) {
    insertProduct.run(p.name, p.sku, p.category, p.price, p.stock);
  }

  const insertCustomer = db.prepare(
    `INSERT INTO customers (name, doc_type, doc_number, email, phone) VALUES (?, ?, ?, ?, ?)`
  );
  for (const c of customers) {
    insertCustomer.run(c.name, c.doc_type, c.doc_number, c.email, c.phone);
  }
});

seed();
console.log('✅ Seed concluído — dados iniciais inseridos.');
console.log('   Login: admin@empresa.com / admin123');
