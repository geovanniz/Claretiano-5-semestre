// src/app/core/models/index.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'vendedor' | 'financeiro' | 'estoque';
  active: number;
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

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  customer_id: number;
  customer_name: string;
  user_id: number;
  total: number;
  status: 'pendente' | 'pago' | 'cancelado';
  notes: string | null;
  created_at: string;
  items: SaleItem[];
}

export interface FinancialSummary {
  total_revenue: number;
  total_received: number;
  total_pending: number;
  total_cancelled: number;
  sales_count: number;
  pending_count: number;
}

export interface Boleto {
  sale_id: number;
  boleto_number: string;
  barcode: string;
  assignor: string;
  payer_name: string;
  payer_doc: string;
  amount: number;
  due_date: string;
  items: Array<{ product: string; quantity: number; subtotal: number }>;
}

// ── DTOs para formulários ─────────────────────────────────────────────────────

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

// ── Carrinho (somente frontend) ───────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}
