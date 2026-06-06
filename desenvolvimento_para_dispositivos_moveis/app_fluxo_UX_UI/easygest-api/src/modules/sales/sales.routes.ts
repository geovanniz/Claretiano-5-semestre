import { db } from '../../database/connection';
import { Sale, SaleItem, CreateSaleDTO } from '../../types';
import { ProductsService } from '../products/products.service';

const productsService = new ProductsService();

interface SaleWithItems extends Sale {
  items: Array<SaleItem & { product_name: string }>;
  customer_name: string;
}

export class SalesService {
  findAll(): SaleWithItems[] {
    const sales = db.prepare(`
      SELECT s.*, c.name AS customer_name
      FROM sales s JOIN customers c ON c.id = s.customer_id
      ORDER BY s.created_at DESC
    `).all() as SaleWithItems[];

    return sales.map(s => ({ ...s, items: this.getItems(s.id) }));
  }

  findById(id: number): SaleWithItems {
    const row = db.prepare(`
      SELECT s.*, c.name AS customer_name
      FROM sales s JOIN customers c ON c.id = s.customer_id
      WHERE s.id = ?
    `).get(id) as SaleWithItems | undefined;

    if (!row) throw new Error('Venda não encontrada.');
    return { ...row, items: this.getItems(id) };
  }

  private getItems(saleId: number) {
    return db.prepare(`
      SELECT si.*, p.name AS product_name
      FROM sale_items si JOIN products p ON p.id = si.product_id
      WHERE si.sale_id = ?
    `).all(saleId) as Array<SaleItem & { product_name: string }>;
  }

  // Cria venda + itens + desconta estoque em uma única transação
  create(dto: CreateSaleDTO, userId: number): SaleWithItems {
    const createSale = db.transaction(() => {
      // Calcula total e valida estoque
      let total = 0;
      const enriched = dto.items.map(item => {
        const product = productsService.findById(item.product_id);
        if (product.stock < item.quantity)
          throw new Error(`Estoque insuficiente: ${product.name}`);
        const subtotal = product.price * item.quantity;
        total += subtotal;
        return { ...item, unit_price: product.price, subtotal };
      });

      // Insere venda
      const saleResult = db.prepare(`
        INSERT INTO sales (customer_id, user_id, total, notes)
        VALUES (?, ?, ?, ?)
      `).run(dto.customer_id, userId, total, dto.notes ?? null);

      const saleId = saleResult.lastInsertRowid as number;

      // Insere itens e desconta estoque
      const insertItem = db.prepare(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `);
      for (const item of enriched) {
        insertItem.run(saleId, item.product_id, item.quantity, item.unit_price, item.subtotal);
        productsService.decrementStock(item.product_id, item.quantity);
      }

      return this.findById(saleId);
    });

    return createSale();
  }

  updateStatus(id: number, status: Sale['status']): SaleWithItems {
    this.findById(id);
    db.prepare('UPDATE sales SET status = ? WHERE id = ?').run(status, id);
    return this.findById(id);
  }
}

// ── Controller + Routes ───────────────────────────────────────────────────────
import { Router, Response } from 'express';
import { AuthRequest } from '../../types';
import { authMiddleware } from '../../middleware/auth.middleware';

const service = new SalesService();

export const saleRoutes = Router();
saleRoutes.use(authMiddleware);

saleRoutes.get('/', (_req, res: Response) => res.json({ data: service.findAll() }));

saleRoutes.get('/:id', (req: AuthRequest, res: Response) => {
  try { res.json({ data: service.findById(+req.params.id) }); }
  catch (e: unknown) { res.status(404).json({ error: (e as Error).message }); }
});

saleRoutes.post('/', (req: AuthRequest, res: Response) => {
  try {
    const sale = service.create(req.body, req.user!.sub);
    res.status(201).json({ data: sale });
  } catch (e: unknown) { res.status(400).json({ error: (e as Error).message }); }
});

saleRoutes.patch('/:id/status', (req: AuthRequest, res: Response) => {
  try {
    const sale = service.updateStatus(+req.params.id, req.body.status);
    res.json({ data: sale });
  } catch (e: unknown) { res.status(400).json({ error: (e as Error).message }); }
});
