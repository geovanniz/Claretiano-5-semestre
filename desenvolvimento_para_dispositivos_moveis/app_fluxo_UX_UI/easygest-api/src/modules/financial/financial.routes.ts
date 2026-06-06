import { db } from '../../database/connection';
import { Router, Response } from 'express';
import { AuthRequest } from '../../types';
import { authMiddleware, roleGuard } from '../../middleware/auth.middleware';

interface FinancialSummary {
  total_revenue: number;
  total_received: number;
  total_pending: number;
  total_cancelled: number;
  sales_count: number;
  pending_count: number;
}

interface Boleto {
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

class FinancialService {
  getSummary(): FinancialSummary {
    const row = db.prepare(`
      SELECT
        COALESCE(SUM(total), 0)                          AS total_revenue,
        COALESCE(SUM(CASE WHEN status='pago'      THEN total ELSE 0 END), 0) AS total_received,
        COALESCE(SUM(CASE WHEN status='pendente'  THEN total ELSE 0 END), 0) AS total_pending,
        COALESCE(SUM(CASE WHEN status='cancelado' THEN total ELSE 0 END), 0) AS total_cancelled,
        COUNT(*)                                         AS sales_count,
        SUM(CASE WHEN status='pendente' THEN 1 ELSE 0 END) AS pending_count
      FROM sales
    `).get() as FinancialSummary;
    return row;
  }

  generateBoleto(saleId: number): Boleto {
    const sale = db.prepare(`
      SELECT s.*, c.name AS payer_name, c.doc_number AS payer_doc
      FROM sales s JOIN customers c ON c.id = s.customer_id
      WHERE s.id = ? AND s.status = 'pendente'
    `).get(saleId) as (ReturnType<typeof db.prepare> extends { get: (...args: unknown[]) => infer R } ? R : never) & {
      id: number; total: number; payer_name: string; payer_doc: string;
    } | undefined;

    if (!sale) throw new Error('Venda não encontrada ou já liquidada.');

    const items = db.prepare(`
      SELECT p.name AS product, si.quantity, si.subtotal
      FROM sale_items si JOIN products p ON p.id = si.product_id
      WHERE si.sale_id = ?
    `).all(saleId) as Array<{ product: string; quantity: number; subtotal: number }>;

    // Número e código de barras simulados (formato Boleto Bancário padrão FEBRABAN)
    const boletoNumber = String(saleId).padStart(10, '0');
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const barcode = [
      '001',
      '9',
      dueDate.toISOString().slice(0, 10).replace(/-/g, ''),
      String(Math.floor(sale.total * 100)).padStart(10, '0'),
      boletoNumber,
      '0',
      '00000000000',
    ].join('');

    return {
      sale_id: saleId,
      boleto_number: boletoNumber,
      barcode,
      assignor: 'EasyGest Comercial Ltda',
      payer_name: sale.payer_name,
      payer_doc: sale.payer_doc,
      amount: sale.total,
      due_date: dueDate.toISOString().slice(0, 10),
      items,
    };
  }
}

const service = new FinancialService();

export const financialRoutes = Router();
financialRoutes.use(authMiddleware, roleGuard('admin', 'financeiro'));

financialRoutes.get('/summary', (_req, res: Response) => {
  res.json({ data: service.getSummary() });
});

financialRoutes.get('/boleto/:saleId', (req: AuthRequest, res: Response) => {
  try {
    res.json({ data: service.generateBoleto(+req.params.saleId) });
  } catch (e: unknown) {
    res.status(400).json({ error: (e as Error).message });
  }
});
