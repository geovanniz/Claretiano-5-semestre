// ── Entidades do banco ────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'vendedor' | 'financeiro' | 'estoque';
  active: number;          // 1 | 0 (SQLite boolean)
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  active: number;
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  doc_type: 'CPF' | 'CNPJ';
  doc_number: string;
  email: string;
  phone: string;
  active: number;
  created_at: string;
}

export interface Sale {
  id: number;
  customer_id: number;
  user_id: number;
  total: number;
  status: 'pendente' | 'pago' | 'cancelado';
  notes: string | null;
  created_at: string;
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

// ── DTOs ─────────────────────────────────────────────────────────────────────

export interface LoginDTO {
  email: string;
  password: string;
}

export interface CreateProductDTO {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
}

export interface CreateCustomerDTO {
  name: string;
  doc_type: 'CPF' | 'CNPJ';
  doc_number: string;
  email: string;
  phone: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: User['role'];
}

export interface CreateSaleDTO {
  customer_id: number;
  items: Array<{ product_id: number; quantity: number }>;
  notes?: string;
}

// ── JWT Payload ───────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: number;        // user id
  name: string;
  role: User['role'];
  iat?: number;
  exp?: number;
}

// ── Express request aumentado ─────────────────────────────────────────────────

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ── Resposta padrão ───────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}
